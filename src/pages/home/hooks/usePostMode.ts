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
    },
  });
};
