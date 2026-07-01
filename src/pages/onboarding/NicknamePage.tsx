import { useNavigate } from 'react-router-dom';

const NicknamePage = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-base bg-neutral-950 text-primary">
      <h1 className="title-lg-semibold">닉네임 입력 페이지</h1>

      <button type="button" onClick={() => navigate('/onboarding/disability')}>
        다음
      </button>
    </main>
  );
};

export default NicknamePage;
