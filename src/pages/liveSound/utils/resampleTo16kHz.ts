// 선형 보간 리샘플러.
// Safari 등은 16kHz 요청을 무시하고 하드웨어 레이트로 열어서 직접 맞춰야 한다.
// 44100 -> 16000은 2.75625라 정수비를 가정할 수 없다.
//
// 한계: 저역통과 없이 다운샘플하면 8kHz 이상 성분이 대역 안으로 접혀 들어온다(앨리어싱).
// 컨텍스트가 이미 16kHz인 Chrome에선 발생하지 않고, iOS에서 정확도 문제가 보이면 FIR을 추가한다.
export const resampleLinear = (
  samples: Float32Array,
  fromRate: number,
  toRate: number,
): Float32Array => {
  // 레이트가 같으면 복사 없이 그대로 돌려준다(Chrome의 일반 경로).
  if (fromRate === toRate) return samples;

  const ratio = fromRate / toRate;
  const outputLength = Math.floor(samples.length / ratio);
  const resampled = new Float32Array(outputLength);

  for (let index = 0; index < outputLength; index += 1) {
    const sourcePosition = index * ratio;
    const leftIndex = Math.floor(sourcePosition);
    const rightIndex = Math.min(leftIndex + 1, samples.length - 1);
    const weight = sourcePosition - leftIndex;

    resampled[index] =
      samples[leftIndex] * (1 - weight) + samples[rightIndex] * weight;
  }

  return resampled;
};
