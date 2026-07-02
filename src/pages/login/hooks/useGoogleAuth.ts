import type { CredentialResponse } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { postGoogleAuth } from '@/pages/login/apis/authApi';
import { setAuthTokens, setLoginType } from '@/pages/login/utils/tokenStorage';

export const useGoogleAuth = () => {
  const navigate = useNavigate();

  const { mutate: googleLogin, isPending: isGoogleLoginLoading } = useMutation({
    mutationFn: postGoogleAuth,
    onSuccess: ({ access_token, refresh_token }) => {
      setAuthTokens(access_token, refresh_token);
      setLoginType('google');

      navigate('/onboarding/nickname');
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
