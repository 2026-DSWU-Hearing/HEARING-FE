// 실시간 소리 감지용 오디오 워크릿.
// 오디오 렌더 스레드에서 128 샘플씩 콜백을 받는데, 그대로 postMessage하면 초당 수백 번이라
// 여기서 100ms 단위로 모아 보낸다.
//
// 주의: public/에 있어 번들되지 않으므로 src/의 모듈을 import할 수 없다.
// 그래서 Float32 -> Int16 변환과 리샘플링은 메인 스레드가 맡고 여기서는 Float32만 넘긴다.

const CHUNK_DURATION_SECONDS = 0.1;
const STOP_COMMAND = 'stop';

class LivesoundProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    // sampleRate는 워크릿 전역 스코프가 주는 컨텍스트 샘플레이트다.
    // 16kHz면 1600, 48kHz면 4800 샘플이 100ms다.
    this.chunkSampleCount = Math.round(sampleRate * CHUNK_DURATION_SECONDS);
    this.buffer = new Float32Array(this.chunkSampleCount);
    this.bufferOffset = 0;
    this.isStopped = false;

    this.port.onmessage = (event) => {
      // 정지 신호를 받으면 process가 false를 반환해 노드가 스스로 종료된다.
      if (event.data === STOP_COMMAND) {
        this.isStopped = true;
      }
    };
  }

  process(inputs) {
    if (this.isStopped) return false;

    const input = inputs[0];
    // 입력이 아직 없으면 노드는 살려두고 이번 콜백만 건너뛴다.
    if (!input || input.length === 0) return true;

    const channel = input[0];
    if (!channel) return true;

    for (let index = 0; index < channel.length; index += 1) {
      this.buffer[this.bufferOffset] = channel[index];
      this.bufferOffset += 1;

      if (this.bufferOffset === this.chunkSampleCount) {
        // transfer는 복사 없이 소유권만 넘기므로, 넘긴 버퍼는 새로 할당해야 한다.
        const chunk = this.buffer;
        this.port.postMessage(chunk, [chunk.buffer]);

        this.buffer = new Float32Array(this.chunkSampleCount);
        this.bufferOffset = 0;
      }
    }

    return true;
  }
}

registerProcessor('livesound-processor', LivesoundProcessor);
