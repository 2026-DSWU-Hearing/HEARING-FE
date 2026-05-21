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

export const usePostMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (modeData: CreateModeRequestTypes) => postMode(modeData),

    onSuccess: (data) => {
      queryClient.setQueryData<GetModesResponseTypes>(['modes'], (old) => {
        const newMode = {
          mode_id: data.mode_id,
          name: data.name,
          icon: data.icon,
          is_active: false,
        };

        if (!old) {
          return {
            modes: [newMode],
          };
        }

        return {
          modes: [...old.modes, newMode],
        };
      });

      // 실제 서버 연결 후에는 아래 방식으로 변경 가능
      // queryClient.invalidateQueries({ queryKey: ['modes'] });
    },
  });
};
