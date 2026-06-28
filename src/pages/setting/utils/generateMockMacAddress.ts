/**
 * 임시 MAC 주소 생성기.
 * TODO(api): 현재는 실제 BLE 페어링이 없어 프론트에서 랜덤 MAC을 만들어 POST /devices에 보낸다.
 * 실제 페어링 구현 시 이 함수 호출을 제거하고 페어링에서 받은 실제 MAC으로 교체할 것.
 * 형식: XX:XX:XX:XX:XX:XX (대문자 16진수)
 */
export const generateMockMacAddress = (): string => {
  const toHex = () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();

  return Array.from({ length: 6 }, toHex).join(':');
};
