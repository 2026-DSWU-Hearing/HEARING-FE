import { putModeSounds } from '@/pages/home/apis/putModeSounds';
import type { UpdateModeSoundsResponseTypes } from '@/pages/home/types/modeTypes';

// 백엔드에는 소리 개별 삭제 엔드포인트가 없으므로, 남길 소리 id 목록으로 전체 교체(PUT)하여 삭제를 구현한다.
export const deleteModeSound = async (
  modeId: number,
  remainingSoundIds: number[],
): Promise<UpdateModeSoundsResponseTypes> => {
  return putModeSounds(modeId, { sound_ids: remainingSoundIds });
};
