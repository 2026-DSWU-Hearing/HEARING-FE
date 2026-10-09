import { useNavigate } from 'react-router-dom';

import LongConfirmButton from '@/pages/onboarding/components/LongConfirmButton';

// 앱 내 어떤 라우트에도 매칭되지 않는 주소로 들어왔을 때 보여주는 페이지.
// 하드웨어 연결 화면의 동심원 모티프를 그대로 가져와 서비스 톤을 유지하고,
// 중앙 숫자는 장식이라 스크린리더에서 숨기고 h1이 상황을 설명한다.
const NotFound = () => {
  const navigate = useNavigate();

  const handleHomeButtonClick = () => {
    // replace 로 잘못된 주소를 히스토리에서 지워 뒤로가기로 다시 404에 오지 않게 한다.
    navigate('/', { replace: true });
  };

  const handleBackButtonClick = () => {
    // 링크를 직접 열어 들어온 경우(앱 내 이동 기록 없음) navigate(-1)은 아무 일도
    // 하지 않으므로, React Router가 history.state에 남기는 이동 인덱스로 분기한다.
    const hasPreviousPage = (window.history.state?.idx ?? 0) > 0;

    if (hasPreviousPage) {
      navigate(-1);
      return;
    }

    navigate('/', { replace: true });
  };

  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-neutral-950 px-base pb-[98px] pt-[2.75rem] text-primary">
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        {/* 320px 화면(좌우 패딩 제외 288px)에서 넘치지 않도록 고정폭 대신 max-w 로 둔다.
            안쪽 원들은 % 로 바깥 원 크기에 따라 함께 줄어든다. */}
        <div
          aria-hidden="true"
          className="relative flex aspect-square w-full max-w-[290px] items-center justify-center"
        >
          {/* 링만 실시간 감지 페이지의 파동(animate-sound-wave)으로 숨 쉬게 하고,
              숫자는 형제 요소로 빼 항상 선명하게 둔다. 링을 숫자의 부모로 두면
              opacity 애니메이션이 숫자까지 같이 흐려지게 만든다.
              inset 비율은 온보딩 연결 화면의 290/214/152px 원 비율과 같다. */}
          <div className="animate-sound-wave absolute inset-0 rounded-full border-[0.5px] border-neutral-500 [animation-delay:0.4s]" />
          <div className="animate-sound-wave absolute inset-[13%] rounded-full border-[0.5px] border-neutral-600" />
          <div className="absolute inset-[24%] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,226,110,0.18)_0%,rgba(255,226,110,0)_100%)]" />
          <p className="relative text-[3.5rem] font-bold leading-none tracking-[-0.04em] text-primary-400 drop-shadow-[0_0_20px_rgba(255,249,212,0.5)]">
            404
          </p>
        </div>

        <h1 className="heading-3xl-semibold mt-2xl text-center text-primary">
          페이지를 찾을 수 없어요
        </h1>
        <p className="body-base-regular mt-sm whitespace-pre-line text-center text-tertiary">
          {'주소가 잘못 입력되었거나\n삭제된 페이지일 수 있어요.'}
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-xs">
        <LongConfirmButton onClick={handleHomeButtonClick}>
          홈으로 돌아가기
        </LongConfirmButton>
        <button
          type="button"
          onClick={handleBackButtonClick}
          className="body-base-regular py-xs text-center text-tertiary"
        >
          이전 페이지로
        </button>
      </div>
    </main>
  );
};

export default NotFound;
