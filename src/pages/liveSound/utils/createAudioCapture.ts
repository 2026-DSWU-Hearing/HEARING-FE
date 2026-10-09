import {
  AMPLITUDE_NOISE_FLOOR,
  AMPLITUDE_NORMALIZE_DIVISOR,
  ANALYSER_FFT_SIZE,
  CHANNEL_COUNT,
  CHUNK_SAMPLE_COUNT,
  SCRIPT_PROCESSOR_BUFFER_SIZE,
  TARGET_SAMPLE_RATE,
  WORKLET_MODULE_URL,
  WORKLET_PROCESSOR_NAME,
} from '../constants/audioConfig';

import { convertFloat32ToInt16 } from './convertFloat32ToInt16';
import { resampleLinear } from './resampleTo16kHz';

const WORKLET_STOP_COMMAND = 'stop';

interface CreateAudioCaptureParamsTypes {
  // 16kHz PCM int16 청크(100ms 분량)가 준비될 때마다 호출된다.
  onChunk: (chunk: Int16Array) => void;
}

export interface AudioCaptureTypes {
  captureMode: 'worklet' | 'scriptProcessor';
  contextSampleRate: number;
  // 지금 들어오는 소리의 세기를 0~1로 반환한다. 화면 애니메이션 전용이고
  // 서버로 가는 PCM과는 무관하다. 정리된 뒤에 불러도 0을 반환한다.
  getAmplitude: () => number;
  stop: () => Promise<void>;
}

// 평문 HTTP 등 마이크 API 자체가 없는 환경.
export class MicrophoneUnsupportedError extends Error {
  constructor() {
    super('이 환경에서는 마이크를 사용할 수 없습니다.');
    this.name = 'MicrophoneUnsupportedError';
  }
}

// Chrome/Edge는 16kHz 힌트를 존중하지만 Safari는 무시하거나 예외를 던진다.
// 예외가 나면 하드웨어 레이트로 열고 리샘플링은 우리가 직접 한다.
const createAudioContext = (): AudioContext => {
  try {
    return new AudioContext({ sampleRate: TARGET_SAMPLE_RATE });
  } catch {
    return new AudioContext();
  }
};

// 마이크를 열어 16kHz mono PCM int16 청크를 100ms 단위로 흘려보낸다.
// AudioWorklet을 우선 쓰고, 사용할 수 없으면 ScriptProcessorNode로 폴백한다.
export const createAudioCapture = async ({
  onChunk,
}: CreateAudioCaptureParamsTypes): Promise<AudioCaptureTypes> => {
  // localhost를 제외한 평문 HTTP에서는 mediaDevices가 undefined라 TypeError로 터진다.
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new MicrophoneUnsupportedError();
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: CHANNEL_COUNT,
      // 16kHz를 못 주는 장치에서 거부되지 않도록 선호값으로만 요청한다.
      // 어떤 레이트로 열리든 resampleLinear가 16kHz로 맞춘다.
      sampleRate: { ideal: TARGET_SAMPLE_RATE },
      // 브라우저 기본값은 음성 통화용이라 환경음 분류에 쓸 원 신호를 변형할 수 있다.
      // 우선 끄고 실기기에서 정확도를 검증한다.
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    },
  });

  // 아래 try 블록 안에서 생성한다. 여기서 던지면 이미 연 마이크가 정리되지 않는다.
  let audioContext: AudioContext | null = null;
  let contextSampleRate = TARGET_SAMPLE_RATE;

  let sourceNode: MediaStreamAudioSourceNode | null = null;
  let workletNode: AudioWorkletNode | null = null;
  let scriptProcessorNode: ScriptProcessorNode | null = null;
  let silentGainNode: GainNode | null = null;
  let analyserNode: AnalyserNode | null = null;
  // getFloatTimeDomainData는 SharedArrayBuffer를 받지 않아 ArrayBuffer로 좁혀 선언한다.
  // (Float32Array의 기본 타입 인자는 ArrayBufferLike라 그대로 쓰면 대입되지 않는다.)
  let analyserBuffer: Float32Array<ArrayBuffer> | null = null;
  let isStopped = false;

  // 현재 프레임의 RMS(제곱평균제곱근)를 0~1로 환산한다.
  // 피크가 아니라 RMS를 쓰는 이유: 피크는 순간 잡음 하나에 튀어 링이 경련하듯 움직인다.
  // 평활화(EMA)는 여기서 하지 않는다. 계수의 의미가 "호출 주기당 얼마나 붙드는가"라
  // 호출 주기를 아는 쪽(rAF 루프)이 맡아야 계수가 뜻을 유지하기 때문이다.
  const getAmplitude = (): number => {
    if (isStopped || !analyserNode || !analyserBuffer) return 0;

    analyserNode.getFloatTimeDomainData(analyserBuffer);

    let sumOfSquares = 0;
    for (let index = 0; index < analyserBuffer.length; index += 1) {
      sumOfSquares += analyserBuffer[index] * analyserBuffer[index];
    }
    const rootMeanSquare = Math.sqrt(sumOfSquares / analyserBuffer.length);

    // 노이즈 플로어 아래는 무음으로 눌러, 조용한 방에서 링이 미세하게 떠는 것을 막는다.
    if (rootMeanSquare < AMPLITUDE_NOISE_FLOOR) return 0;

    return Math.min(rootMeanSquare / AMPLITUDE_NORMALIZE_DIVISOR, 1);
  };

  // 리샘플 후 길이가 100ms로 딱 떨어지지 않아 남는 샘플을 다음 콜백까지 들고 있는다.
  // 두 캡처 경로 모두 여기를 지나므로 소켓은 항상 100ms 프레임을 본다.
  let pendingSamples = new Float32Array(0);

  const handleSamples = (samples: Float32Array) => {
    if (isStopped) return;

    const resampled = resampleLinear(
      samples,
      contextSampleRate,
      TARGET_SAMPLE_RATE,
    );

    const merged = new Float32Array(pendingSamples.length + resampled.length);
    merged.set(pendingSamples);
    merged.set(resampled, pendingSamples.length);

    let offset = 0;
    while (merged.length - offset >= CHUNK_SAMPLE_COUNT) {
      const chunk = merged.subarray(offset, offset + CHUNK_SAMPLE_COUNT);
      onChunk(convertFloat32ToInt16(chunk));
      offset += CHUNK_SAMPLE_COUNT;
    }

    // subarray는 같은 버퍼를 참조하므로 slice로 복사해 넘긴다.
    pendingSamples = merged.slice(offset);
  };

  // 오디오 렌더 스레드에서 버퍼링하므로 메인 스레드가 바빠도 소리가 끊기지 않는다.
  const startWithWorklet = async (context: AudioContext): Promise<boolean> => {
    if (!context.audioWorklet) return false;

    try {
      await context.audioWorklet.addModule(WORKLET_MODULE_URL);
    } catch (error) {
      console.warn(
        '[LiveSound] 오디오 워크릿 로드 실패, ScriptProcessor로 폴백합니다:',
        error,
      );
      return false;
    }

    if (isStopped) return false;

    workletNode = new AudioWorkletNode(context, WORKLET_PROCESSOR_NAME);
    workletNode.port.onmessage = (event: MessageEvent<Float32Array>) => {
      handleSamples(event.data);
    };

    // destination에 연결하면 마이크가 스피커로 되돌아 나온다. 소스 연결만으로 동작한다.
    sourceNode?.connect(workletNode);

    return true;
  };

  // deprecated지만 워크릿을 못 쓰는 구형 환경에서 유일한 대안이다(메인 스레드에서 동작).
  const startWithScriptProcessor = (context: AudioContext) => {
    scriptProcessorNode = context.createScriptProcessor(
      SCRIPT_PROCESSOR_BUFFER_SIZE,
      CHANNEL_COUNT,
      CHANNEL_COUNT,
    );

    scriptProcessorNode.onaudioprocess = (event) => {
      // 콜백이 넘겨주는 버퍼는 재사용되므로 복사해서 넘긴다.
      handleSamples(new Float32Array(event.inputBuffer.getChannelData(0)));
    };

    // destination까지 연결돼야 onaudioprocess가 발화하는데, 그대로 연결하면 하울링이 난다.
    // gain 0인 노드를 경유시켜 소리는 막고 콜백만 살린다.
    silentGainNode = context.createGain();
    silentGainNode.gain.value = 0;

    sourceNode?.connect(scriptProcessorNode);
    scriptProcessorNode.connect(silentGainNode);
    silentGainNode.connect(context.destination);
  };

  const stop = async () => {
    // 여러 경로에서 동시에 부를 수 있어 멱등해야 한다.
    if (isStopped) return;
    isStopped = true;

    if (workletNode) {
      workletNode.port.postMessage(WORKLET_STOP_COMMAND);
      workletNode.port.onmessage = null;
      workletNode.port.close();
      workletNode.disconnect();
    }

    if (scriptProcessorNode) {
      scriptProcessorNode.onaudioprocess = null;
      scriptProcessorNode.disconnect();
    }

    silentGainNode?.disconnect();
    analyserNode?.disconnect();
    // 버퍼 참조를 끊어 rAF 루프가 늦게 깨어나도 죽은 노드를 읽지 않게 한다.
    // (isStopped 가드가 이미 막지만, 참조까지 놓아야 GC가 회수한다.)
    analyserBuffer = null;
    sourceNode?.disconnect();

    // AudioContext를 닫아도 트랙은 별개 자원이라, stop하지 않으면 마이크 인디케이터가 켜진 채 남는다.
    stream.getTracks().forEach((track) => track.stop());

    // await하지 않으면 StrictMode 이중 마운트에서 오디오 장치 경합이 난다.
    if (audioContext && audioContext.state !== 'closed') {
      await audioContext.close();
    }
  };

  try {
    audioContext = createAudioContext();
    contextSampleRate = audioContext.sampleRate;

    // iOS는 컨텍스트를 suspended로 두는 경우가 있어 명시적으로 깨운다.
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    sourceNode = audioContext.createMediaStreamSource(stream);

    // 시각화 전용 분기. Web Audio의 한 출력은 여러 입력에 동시에 연결할 수 있어,
    // 아래 전송 경로(worklet/scriptProcessor)에는 아무 영향이 없다.
    // AnalyserNode는 종단 노드라 destination에 연결하지 않는다(연결하면 하울링이 난다).
    // 캡처 모드 분기보다 앞에 두어 두 경로 모두에서 음량을 읽을 수 있게 한다.
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = ANALYSER_FFT_SIZE;
    analyserBuffer = new Float32Array(analyserNode.fftSize);
    sourceNode.connect(analyserNode);

    const isWorkletReady = await startWithWorklet(audioContext);
    if (!isWorkletReady) {
      startWithScriptProcessor(audioContext);
    }

    return {
      captureMode: isWorkletReady ? 'worklet' : 'scriptProcessor',
      contextSampleRate,
      getAmplitude,
      stop,
    };
  } catch (error) {
    // 초기화 중 실패해도 이미 열린 마이크는 정리한다.
    await stop();
    throw error;
  }
};
