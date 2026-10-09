import ConfirmModal from '@/shared/components/ConfirmModal';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
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
      />

      {/*
        ConfirmModal은 확인 직후 스스로 닫히므로, 요청이 끝날 때까지 설정 화면이 그대로 보인다.
        아무 변화가 없으면 로그아웃이 씹힌 것처럼 보이므로 전체를 덮어 진행 중임을 알린다.
        오버레이가 그동안의 조작도 막아준다.
      */}
      {isLogoutLoading && (
        <div className="fixed inset-0 z-50" role="status" aria-label="로그아웃 중">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
};

export default LogoutButton;
