const HomeHeader = () => {
  return (
    <header>
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">소리 필터링</h1>
        <button type="button" aria-label="알림">
          알림
        </button>
      </div>
      <p>리치님 반가워요 환경에 맞는 모드를 선택하세요</p>
    </header>
  );
};

export default HomeHeader;
