import ModeForm from './components/modeForm/ModeForm';
// 새 모드 만들기 페이지 - ModeForm 컴포넌트를 재사용하여 제목과 라벨만 다르게 전달
const ModeCreatePage = () => {
  return (
    <ModeForm title="새 모드 만들기" nameLabel="모드 이름" submitLabel="저장" />
  );
};

export default ModeCreatePage;
