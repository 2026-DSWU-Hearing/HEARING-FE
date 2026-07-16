import ConfirmModal from '@/shared/components/ConfirmModal';
import { useModal } from '@/shared/hooks/useModal';
import { useLogout } from '@/pages/login/hooks/useLogout';

// 설정 페이지 최하단의 로그아웃 텍스트 버튼.

const LogoutButton = () => {
  const confirmModal = useModal();
  const { isLogoutLoading, handleLogout } = useLogout();

  const handleLogoutClick = () => confirmModal.open();

  const handleConfirmLogout = () => {
    if (isLogoutLoading) return;
    handleLogout();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleLogoutClick}
        disabled={isLogoutLoading}
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
        confirmDisabled={isLogoutLoading}
      />
    </>
  );
};

export default LogoutButton;
