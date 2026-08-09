// int16 범위 [-32768, 32767]가 비대칭이라 스케일을 나눠 쓴다.
// 양쪽에 0x8000을 곱하면 +1.0이 +32768로 넘쳐 -32768로 래핑된다(클리핑 왜곡).
const INT16_POSITIVE_MAX = 0x7fff;
const INT16_NEGATIVE_MAX = 0x8000;

// Float32 샘플을 서버가 요구하는 PCM int16으로 변환한다.
export const convertFloat32ToInt16 = (samples: Float32Array): Int16Array => {
  const converted = new Int16Array(samples.length);

  for (let index = 0; index < samples.length; index += 1) {
    // 이론상 [-1, 1]이지만 처리 과정에서 벗어날 수 있어 먼저 클램프한다.
    const clamped = Math.max(-1, Math.min(1, samples[index]));

    converted[index] =
      clamped < 0 ? clamped * INT16_NEGATIVE_MAX : clamped * INT16_POSITIVE_MAX;
  }

  return converted;
};
