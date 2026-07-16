import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postDevice } from '@/pages/setting/apis/postDevice';
import type { CreateDeviceRequestTypes } from '@/shared/types/deviceApiTypes';

// 기기를 등록하는 mutation 훅.
// 성공 시 ['devices'] 캐시를 무효화해 서버 값으로 동기화한다.
export const usePostDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deviceData: CreateDeviceRequestTypes) => postDevice(deviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
};
