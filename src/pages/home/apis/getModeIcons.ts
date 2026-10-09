import http from '@/shared/apis/axios';
import type { GetModeIconsResponseTypes } from '@/pages/home/types/modeTypes';

// 선택 가능한 모드 아이콘 카탈로그 조회 (서버 정적 목록)
export const getModeIcons = async (): Promise<GetModeIconsResponseTypes> => {
  const response = await http.get<GetModeIconsResponseTypes>('/modes/icons');
  return response.data;
};
