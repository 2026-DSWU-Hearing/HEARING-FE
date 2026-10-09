import type { LiveSoundSoundItemTypes } from '../types/liveSoundSocketTypes';
import type { SoundRateTypes } from '../types/soundRateTypes';

// 같은 sound_name이 올 경우 화면에 뜨기 전에 이름 기준으로 한 장의 카드로 합친다.
// confidence는 소리별 독립 신뢰도라 합이 1이 아니므로 최댓값만 대표로 쓰고 임의로 정규화하지 않는다.
export const mergeLiveSoundSounds = (
  sounds: LiveSoundSoundItemTypes[],
): SoundRateTypes[] => {
  const highestConfidenceBySoundName = new Map<
    string,
    LiveSoundSoundItemTypes
  >();

  sounds.forEach((sound) => {
    const current = highestConfidenceBySoundName.get(sound.sound_name);
    if (!current || sound.confidence > current.confidence) {
      highestConfidenceBySoundName.set(sound.sound_name, sound);
    }
  });

  // 병합 키가 sound_name이라 이후 sound_name은 유일함이 보장돼 그대로 React key로 쓸 수 있다.
  // (원본 sound_id는 null일 수 있고 중복 항목 간에 서로 달라 key로 부적합하다.)
  return Array.from(highestConfidenceBySoundName.values()).map((sound) => ({
    id: sound.sound_name,
    label: sound.sound_name,
    category: sound.sound_category,
    rate: Math.round(sound.confidence * 100),
  }));
};
