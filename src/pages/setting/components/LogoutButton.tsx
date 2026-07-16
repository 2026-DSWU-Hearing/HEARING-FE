import ConfirmModal from '@/shared/components/ConfirmModal';
import { useModal } from '@/shared/hooks/useModal';

// 설정 페이지 최하단의 로그아웃 텍스트 버튼.

const LogoutButton = () => {
  const confirmModal = useModal();

  const handleLogoutClick = () => confirmModal.open();

  const handleConfirmLogout = () => {
    // TODO(api): 로그아웃 API 연결 지점. 토큰 제거 후 /login으로 이동한다.
  };

  return (
    <>
      <button
        type="button"
        onClick={handleLogoutClick}
        className="mt-lg self-center body-sm-regular text-disabled"
      >
        로그아웃
      </button>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message="로그아웃 하시겠습니까?"
        onConfirm={handleConfirmLogout}
        onCancel={confirmModal.close}
        onClose={confirmModal.close}
        confirmText="로그아웃"
        cancelText="취소"
      />
    </>
  );
};

export default LogoutButton;
