import ModeForm from './components/modeForm/ModeForm';

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
