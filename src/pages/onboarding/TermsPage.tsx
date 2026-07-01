import { useNavigate } from 'react-router-dom';

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-base bg-neutral-950 text-primary">
      <h1 className="title-lg-semibold">약관 동의 페이지</h1>

      <label>
        <input type="checkbox" />
        이용약관 동의
      </label>

      <label>
        <input type="checkbox" />
        개인정보 처리방침 동의
      </label>

      <div className="flex gap-sm">
        <button
          type="button"
          onClick={() => navigate('/onboarding/disability')}
        >
          이전
        </button>
        <button type="button" onClick={() => navigate('/onboarding/hardware')}>
          다음
        </button>
      </div>
    </main>
  );
};

export default TermsPage;
