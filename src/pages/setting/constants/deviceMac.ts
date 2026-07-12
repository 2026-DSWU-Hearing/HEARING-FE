/**
 * 넥밴드(ESP32) 단일 디바이스의 MAC 주소.
 * 앱은 단일 기기 전제이므로 실제 ESP32 한 대의 MAC을 고정 상수로 둔다.
 * 웹(PWA)은 보안상 BLE 페어링으로도 실제 MAC을 얻을 수 없어, 이 값을 직접 지정한다.
 * TODO(hardware): 실제 ESP32 보드의 MAC(XX:XX:XX:XX:XX:XX, 대문자 hex)으로 아래 값을 교체할 것.
 */
export const DEVICE_MAC_ADDRESS = 'AA:BB:CC:DD:EE:FF';
