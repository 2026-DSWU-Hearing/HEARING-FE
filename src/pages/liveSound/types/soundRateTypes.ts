export interface SoundRateTypes {
  id: string;
  label: string;
  category: string;
  rate: number;
}

// 궤도에 띄울 소리. slotIndex는 SOUND_ORBIT_CONFIG_LIST의 궤도 번호(0이 가장 안쪽)로,
// 배열 위치와 달리 그 소리가 사라질 때까지 바뀌지 않는다.
export interface OrbitSoundTypes extends SoundRateTypes {
  slotIndex: number;
}
