import http from '@/shared/apis/axios';

// 나중에 실제 서버랑 연동 시 false로 설정하면 됨 - 현재 mock 데이터 보여주는 용도
const IS_MOCK = true;
// 모드 삭제
export const deleteMode = async (modeId: number): Promise<void> => {
  if (IS_MOCK) {
    console.log(`${modeId}번 모드 삭제`);
    return;
  }

  await http.delete(`/api/v1/modes/${modeId}`);
};
