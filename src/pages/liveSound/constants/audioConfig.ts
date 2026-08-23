// 서버 스펙: PCM int16 · mono · 16kHz · 100ms 청크.

// AudioContext에 힌트로 넘기고, 브라우저가 무시하면 이 값으로 직접 리샘플링한다.
export const TARGET_SAMPLE_RATE = 16000;

export const CHANNEL_COUNT = 1;

// 16kHz에서 1600 샘플 = 3200 바이트.
export const CHUNK_DURATION_MS = 100;
export const CHUNK_SAMPLE_COUNT =
  (TARGET_SAMPLE_RATE * CHUNK_DURATION_MS) / 1000;

// 2의 거듭제곱만 허용되어 100ms에 딱 맞출 수 없다(16kHz에서 2048 = 128ms).
// 청크 재조립은 createAudioCapture가 하므로 소켓이 보는 프레임 크기는 같다.
export const SCRIPT_PROCESSOR_BUFFER_SIZE = 2048;

// public/에 있어 번들되지 않고 URL로 직접 로드된다.
// 서브 경로 배포에서도 찾을 수 있도록 base 경로를 붙인다.
// (로드에 실패하면 조용히 ScriptProcessor로 폴백해 오디오가 메인 스레드로 내려간다.)
export const WORKLET_MODULE_URL = `${import.meta.env.BASE_URL}livesoundAudioWorklet.js`;
export const WORKLET_PROCESSOR_NAME = 'livesound-processor';

// 송신 큐가 이 크기(약 1초치)를 넘으면 전송이 밀린 것으로 보고 청크를 버린다.
export const MAX_BUFFERED_AMOUNT = 32000;

// --- 시각화 전용 (서버 전송과 무관) ---

// 파형만 읽으므로 주파수 해상도는 필요 없다. 작을수록 계산이 싸다.
export const ANALYSER_FFT_SIZE = 512;

// RMS는 프레임마다 심하게 튄다. 1에 가까울수록 이전 값을 오래 붙들어 부드러워지고,
// 대신 소리에 반응하는 속도가 느려진다.
export const AMPLITUDE_SMOOTHING_FACTOR = 0.85;

// 마이크 자체 노이즈 플로어. 이 아래는 무음으로 보고 0으로 눌러,
// 조용한 방에서 링이 미세하게 떠는 것을 막는다.
export const AMPLITUDE_NOISE_FLOOR = 0.01;

// RMS 원값은 일상 대화에서도 0.1을 넘기 어려워 그대로 쓰면 링이 거의 안 움직인다.
// 이 값으로 나눠 화면이 쓸 수 있는 0~1 범위로 편다.
export const AMPLITUDE_NORMALIZE_DIVISOR = 0.25;
