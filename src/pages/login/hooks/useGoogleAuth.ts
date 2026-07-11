import type { CredentialResponse } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { postGoogleAuth } from '@/pages/login/apis/authApi';
import { setAuthTokens, setLoginType } from '@/pages/login/utils/tokenStorage';
import { getUsers } from '@/pages/setting/apis/getUsers';

export const useGoogleAuth = () => {
  const navigate = useNavigate();

  const { mutate: googleLogin, isPending: isGoogleLoginLoading } = useMutation({
    mutationFn: postGoogleAuth,
    onSuccess: async ({ access_token, refresh_token }) => {
      setAuthTokens(access_token, refresh_token);
      setLoginType('google');

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
      console.error('구글 로그인 실패:', error);
      alert('구글 로그인에 실패했습니다.');
    },
  });

  const handleGoogleLoginSuccess = (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      alert('구글 로그인 토큰을 가져오지 못했습니다.');
      return;
    }

    googleLogin({
      id_token: idToken,
    });
  };

  const handleGoogleLoginError = () => {
    alert('구글 로그인에 실패했습니다.');
  };

  return {
    isGoogleLoginLoading,
    handleGoogleLoginSuccess,
    handleGoogleLoginError,
  };
};
