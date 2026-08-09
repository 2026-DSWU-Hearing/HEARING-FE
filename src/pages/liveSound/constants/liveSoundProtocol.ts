import type {
  LiveSoundClassificationTypes,
  LiveSoundServerMessageTypes,
  LiveSoundStartMessageTypes,
  LiveSoundStopMessageTypes,
} from '../types/liveSoundSocketTypes';

// 훅/컴포넌트는 아래 함수들만 쓰고 envelope 모양을 직접 알지 못한다.
// 서버 형태가 확정되면 이 파일만 고치면 된다.

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
const isClassification = (
  value: unknown,
): value is LiveSoundClassificationTypes => {
  if (!isRecord(value)) return false;

  const { sound_id, name, category, confidence } = value;

  return (
    typeof sound_id === 'number' &&
    Number.isFinite(sound_id) &&
    typeof name === 'string' &&
    typeof category === 'string' &&
    typeof confidence === 'number' &&
    // typeof NaN === 'number'라 유한값인지까지 봐야 rate 계산이 안 깨진다.
    Number.isFinite(confidence)
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
