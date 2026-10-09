import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { postGuestLogin } from '@/pages/login/apis/authApi';
import { setAuthTokens, setLoginType } from '@/pages/login/utils/tokenStorage';
import { getUsers } from '@/shared/apis/getUsers';

export const useGuestLogin = () => {
  const navigate = useNavigate();

  const { mutate: guestLogin, isPending: isGuestLoginLoading } = useMutation({
    mutationFn: postGuestLogin,
    onSuccess: async ({ access_token, refresh_token }) => {
      setAuthTokens(access_token, refresh_token);
      setLoginType('guest');

      // 이미 온보딩을 마친 계정이면 바로 홈으로, 아니면 온보딩으로 보낸다.
      try {
        const user = await getUsers();
        navigate(user.terms_agreed ? '/' : '/onboarding/nickname');
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        navigate('/onboarding/nickname');
      }
    },
    onError: (error) => {
      console.error('게스트 로그인 실패:', error);
      alert('게스트 로그인에 실패했습니다.');
    },
  });

  const handleGuestLogin = () => {
    guestLogin();
  };

  return {
    isGuestLoginLoading,
    handleGuestLogin,
  };
};
