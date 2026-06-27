const LiveSoundHeader = () => {
  return (
    <div className="flex flex-col gap-sm pt-[2.75rem] px-[1rem] pb-[2.81rem]">
      <div className="heading-5xl-semibold">실시간 소리 감지</div>
      <div className="heading-base-semibold space-y-0.5">
        <p>시작 버튼을 누르면</p>
        <p>현재 주변에서 들리는 소리를 비율로 알려줍니다</p>
      </div>
    </div>
  );
};

export default LiveSoundHeader;
