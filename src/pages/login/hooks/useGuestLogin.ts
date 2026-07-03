import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { postGuestLogin } from '@/pages/login/apis/authApi';
import { setAuthTokens, setLoginType } from '@/pages/login/utils/tokenStorage';

export const useGuestLogin = () => {
  const navigate = useNavigate();

  const { mutate: guestLogin, isPending: isGuestLoginLoading } = useMutation({
    mutationFn: postGuestLogin,
    onSuccess: ({ access_token, refresh_token }) => {
      setAuthTokens(access_token, refresh_token);
      setLoginType('guest');

      navigate('/onboarding/nickname');
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
