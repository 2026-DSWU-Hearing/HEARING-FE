import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { getDevices } from '@/pages/onboarding/apis/deviceApi';
import { DEVICE_POLLING_INTERVAL_MS } from '@/pages/onboarding/constants/hardwareConstants';
import { useOnboardingStore } from '@/pages/onboarding/stores/useOnboardingStore';

export const useDeviceConnectionPolling = () => {
  const navigate = useNavigate();
  const hasNavigatedRef = useRef(false);

  const setHardwareConnected = useOnboardingStore(
    (state) => state.setHardwareConnected,
  );
  const setConnectedDevice = useOnboardingStore(
    (state) => state.setConnectedDevice,
  );

  const { data: devices, isError } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
    refetchInterval: DEVICE_POLLING_INTERVAL_MS,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (hasNavigatedRef.current) return;

    const connectedDevice = devices?.find((device) => device.is_connected);

    if (!connectedDevice) return;

    hasNavigatedRef.current = true;
    setConnectedDevice(connectedDevice);
    setHardwareConnected(true);
    navigate('/onboarding/hardware/complete');
  }, [devices, navigate, setConnectedDevice, setHardwareConnected]);

  useEffect(() => {
    if (!isError) return;

    setConnectedDevice(null);
    setHardwareConnected(false);
  }, [isError, setConnectedDevice, setHardwareConnected]);
};
