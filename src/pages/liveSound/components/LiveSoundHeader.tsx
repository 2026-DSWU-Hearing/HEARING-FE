// 좌우 여백은 부모 main의 px-[1rem]에 맡기고 여기서는 상하 여백만 준다.
const LiveSoundHeader = () => {
  return (
    <header className="flex flex-col gap-sm pt-[2.75rem] pb-[2.81rem]">
      <h1 className="heading-5xl-semibold">실시간 소리 감지</h1>
      <div className="heading-base-semibold space-y-0.5">
        <p>시작 버튼을 누르면</p>
        <p>현재 주변에서 들리는 소리를 비율로 알려줍니다</p>
      </div>
    </header>
  );
};

export default LiveSoundHeader;
