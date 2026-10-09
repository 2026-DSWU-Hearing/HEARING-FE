import type {
  LiveSoundClassificationTypes,
  LiveSoundServerMessageTypes,
  LiveSoundSoundItemTypes,
  LiveSoundStartMessageTypes,
  LiveSoundStopMessageTypes,
} from '../types/liveSoundSocketTypes';

export const buildStartMessage = (): string => {
  const message: LiveSoundStartMessageTypes = { type: 'start' };

  return JSON.stringify(message);
};

export const buildStopMessage = (): string => {
  const message: LiveSoundStopMessageTypes = { type: 'stop' };

  return JSON.stringify(message);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

// 단언(as)만 쓰면 서버 형태가 바뀌었을 때 화면에 NaN%가 찍히는 식으로 조용히 깨진다.
const isSoundItem = (value: unknown): value is LiveSoundSoundItemTypes => {
  if (!isRecord(value)) return false;

  const { sound_id, sound_name, sound_category, confidence } = value;

  return (
    (sound_id === null ||
      (typeof sound_id === 'number' && Number.isFinite(sound_id))) &&
    typeof sound_name === 'string' &&
    typeof sound_category === 'string' &&
    typeof confidence === 'number' &&
    // typeof NaN === 'number'라 유한값인지까지 봐야 rate 계산이 안 깨진다.
    Number.isFinite(confidence)
  );
};

const isClassification = (
  value: unknown,
): value is LiveSoundClassificationTypes => {
  if (!isRecord(value)) return false;

  const { sounds, analyzed_at } = value;

  // 빈 배열은 "아무 소리도 안 들린다"는 정상 신호다.
  // 실패로 처리하면 무음 메시지가 버려져 마지막 소리가 화면에 남는다.
  return (
    Array.isArray(sounds) &&
    sounds.every(isSoundItem) &&
    typeof analyzed_at === 'string'
  );
};

// 알려진 형태가 아니면 null을 반환해 호출부가 무시하게 한다.
export const parseLiveSoundMessage = (
  raw: string,
): LiveSoundServerMessageTypes | null => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    console.warn('[LiveSound] JSON 파싱 실패:', raw);
    return null;
  }

  if (!isRecord(parsed) || typeof parsed.type !== 'string') return null;

  switch (parsed.type) {
    case 'ready':
      return { type: 'ready' };

    case 'classification':
      if (!isClassification(parsed.data)) {
        console.warn(
          '[LiveSound] classification 형태가 예상과 다릅니다:',
          parsed,
        );
        return null;
      }
      return { type: 'classification', data: parsed.data };

    case 'error':
      return {
        type: 'error',
        message:
          typeof parsed.message === 'string' ? parsed.message : undefined,
      };

    default:
      console.warn('[LiveSound] 알 수 없는 메시지 타입:', parsed.type);
      return null;
  }
};
