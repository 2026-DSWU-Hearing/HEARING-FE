import { useNavigate } from 'react-router-dom';

const HwConnectPage = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-base bg-neutral-950 text-primary">
      <h1 className="title-lg-semibold">하드웨어를 연결하시겠습니까?</h1>

      <div className="flex gap-sm">
        <button type="button" onClick={() => navigate('/onboarding/terms')}>
          이전
        </button>
        <button type="button" onClick={() => navigate('/')}>
          나중에 하기
        </button>
        <button
          type="button"
          onClick={() => navigate('/onboarding/hardware/connecting')}
        >
          연결하기
        </button>
      </div>
    </main>
  );
};

export default HwConnectPage;
