const HomeHeader = () => {
  return (
    <header>
      <h1 className="text-2xl font-bold">소리 필터링</h1>
      <button type="button" aria-label="알림">
        알림
      </button>
      <p>00님 반가워요 환경에 맞는 모드를 선택하세요</p>
    </header>
  );
};

export default HomeHeader;
