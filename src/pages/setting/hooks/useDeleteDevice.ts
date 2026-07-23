import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDevice } from '@/pages/setting/apis/deleteDevice';

// 기기 연결을 해제하는 mutation 훅(기기 자체 삭제가 아니라 현재 계정의 연결 해제).
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
