interface SettingSectionTitlePropTypes {
  title: string;
}

// 설정 페이지 섹션 제목 행.
// 나의 디바이스·진동 강도 설정 등에서 재사용한다.

const SettingSectionTitle = ({ title }: SettingSectionTitlePropTypes) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="heading-lg-semibold text-primary">{title}</h2>
    </div>
  );
};

export default SettingSectionTitle;
