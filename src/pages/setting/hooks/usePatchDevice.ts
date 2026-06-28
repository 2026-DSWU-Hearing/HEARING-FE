import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchDevice } from '@/pages/setting/apis/patchDevice';
import type { UpdateDeviceRequestTypes } from '@/pages/setting/types/deviceApiTypes';

// 기기 정보를 수정하는 mutation 훅. 연결 해제/다시 연결에 공용으로 사용한다.
// 인자가 여러 개이므로 객체로 묶어 받는다.
// 성공 시 ['devices'] 캐시를 무효화해 서버 값으로 동기화한다.
export const usePatchDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      deviceId,
      deviceData,
    }: {
      deviceId: number;
      deviceData: UpdateDeviceRequestTypes;
    }) => patchDevice(deviceId, deviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
};
