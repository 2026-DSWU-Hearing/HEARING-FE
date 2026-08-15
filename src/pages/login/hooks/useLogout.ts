import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { postLogout } from '@/pages/login/apis/authApi';
import { removeAuthTokens } from '@/pages/login/utils/tokenStorage';
import { useFavoriteAnswerStore } from '@/pages/communication/stores/useFavoriteAnswerStore';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending: isLogoutLoading } = useMutation({
    mutationFn: postLogout,
    onError: (error) => {
      console.error('로그아웃 실패:', error);
    },
    // 서버 요청이 실패해도 로컬 세션은 반드시 정리한다.
    // 공용 기기에서 로그아웃이 막히는 상황을 만들지 않기 위함이다.
    onSettled: () => {
      removeAuthTokens();
      // 이전 사용자의 프로필·기기 정보가 다음 로그인 화면에 잠깐 비치지 않도록
      // localStorage와 별개인 쿼리 캐시도 비운다.
      queryClient.clear();
      // 쿼리 캐시와 달리 zustand 스토어는 남아있어서, 다음 로그인 사용자에게
      // 이전 사용자의 자주 쓰는 답변이 그대로 보이고 서버 목록도 주입되지 않는다.
      useFavoriteAnswerStore.getState().reset();
      navigate('/login', { replace: true });
    },
  });

  const handleLogout = () => {
    logout();
  };

  return {
    isLogoutLoading,
    handleLogout,
  };
};
