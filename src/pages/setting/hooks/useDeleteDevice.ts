import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDevice } from '@/pages/setting/apis/deleteDevice';

// 기기를 삭제하는 mutation 훅.
// 성공 시 ['devices'] 캐시를 무효화해 서버 값으로 동기화한다.
export const useDeleteDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deviceId: number) => deleteDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
};
