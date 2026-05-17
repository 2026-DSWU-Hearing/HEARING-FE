import ModeForm from './components/modeForm/ModeForm';
// 모드 설정 페이지 - ModeForm 컴포넌트를 재사용하여 제목과 라벨만 다르게 전달, 초기값과 삭제 버튼 표시 여부도 전달
const ModeEditPage = () => {
  return (
    <ModeForm
      title="모드 설정"
      nameLabel="모드 이름 수정"
      submitLabel="완료"
      initialName="실외"
      showDeleteButton
    />
  );
};

export default ModeEditPage;
