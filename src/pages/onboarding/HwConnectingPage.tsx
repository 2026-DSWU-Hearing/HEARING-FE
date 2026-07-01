import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HwConnectingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      navigate('/onboarding/hardware/complete');
    }, 2000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [navigate]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-base bg-neutral-950 text-primary">
      <h1 className="title-lg-semibold">하드웨어 연결중...</h1>
      <p className="body-base-regular text-tertiary">
        잠시 후 연결 완료 페이지로 이동합니다.
      </p>
    </main>
  );
};

export default HwConnectingPage;
