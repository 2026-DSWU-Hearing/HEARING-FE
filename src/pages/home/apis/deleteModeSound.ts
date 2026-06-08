import http from '@/shared/apis/axios';

export const deleteModeSound = async (
  modeId: number,
  soundId: number,
): Promise<void> => {
  await http.delete(`/api/v1/modes/${modeId}/sounds/${soundId}`);
};
