// 소리 id 배열에서 해당 id를 토글한다. (있으면 제거, 없으면 추가)
export const toggleSoundId = (soundIds: number[], soundId: number) => {
  if (soundIds.includes(soundId)) {
    return soundIds.filter((selectedSoundId) => selectedSoundId !== soundId);
  }

  return [...soundIds, soundId];
};
