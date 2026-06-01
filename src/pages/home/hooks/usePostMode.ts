// 실제 서버 연결 후 바꿀 로직
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { postMode } from '@/pages/home/apis/postMode';
// import type { CreateModeRequestTypes } from '@/pages/home/types/modeTypes';

// export const usePostMode = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (modeData: CreateModeRequestTypes) => postMode(modeData),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['modes'] });
//     },
//   });
// };

// src/pages/home/hooks/usePostMode.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postMode } from '@/pages/home/apis/postMode';
import type {
  CreateModeRequestTypes,
  GetModesResponseTypes,
} from '@/pages/home/types/modeTypes';

// 새 모드를 생성하는 mutation 훅. 성공 시 생성된 모드를 모드 목록 캐시 끝에 추가한다.
export const usePostMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (modeData: CreateModeRequestTypes) => postMode(modeData),

    onSuccess: (data) => {
      // 서버 응답(data)이 완전한 모드 객체이므로 그대로 목록 캐시 끝에 추가한다.
      queryClient.setQueryData<GetModesResponseTypes>(['modes'], (old) => {
        if (!old) return [data];

        return [...old, data];
      });
    },
  });
};
