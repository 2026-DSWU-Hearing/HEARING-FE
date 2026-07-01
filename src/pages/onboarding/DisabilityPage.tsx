import { useNavigate } from 'react-router-dom';

const DisabilityPage = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-base bg-neutral-950 text-primary">
      <h1 className="title-lg-semibold">장애유형 선택 페이지</h1>

      <div className="flex gap-sm">
        <button type="button">농인</button>
        <button type="button">난청인</button>
      </div>

      <div className="flex gap-sm">
        <button type="button" onClick={() => navigate('/onboarding/nickname')}>
          이전
        </button>
        <button type="button" onClick={() => navigate('/onboarding/terms')}>
          다음
        </button>
      </div>
    </main>
  );
};

export default DisabilityPage;
