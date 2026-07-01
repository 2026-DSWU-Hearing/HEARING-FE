import { useNavigate } from 'react-router-dom';

const HwCompletePage = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-base bg-neutral-950 text-primary">
      <h1 className="title-lg-semibold">하드웨어 연결 완료</h1>

      <button type="button" onClick={() => navigate('/')}>
        시작하기
      </button>
    </main>
  );
};

export default HwCompletePage;
