import http from '@/shared/apis/axios';

// 모드 삭제
export const deleteMode = async (modeId: number): Promise<void> => {
  await http.delete(`/api/v1/modes/${modeId}`);
};
