import http from '@/shared/apis/axios';

export const deleteModeSound = async (
  modeId: number,
  soundId: number,
): Promise<void> => {
  await http.delete(`/modes/${modeId}/sounds/${soundId}`);
};
