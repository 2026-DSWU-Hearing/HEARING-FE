import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import type { CredentialResponse } from '@react-oauth/google';

import { postGoogleAuth } from '../apis/authApi';
import { setAuthTokens } from '../utils/tokenStorage';

export const useGoogleAuth = () => {
  //const navigate = useNavigate();
  const [isGoogleLoginLoading, setIsGoogleLoginLoading] = useState(false);

  const handleGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    try {
      const idToken = credentialResponse.credential;

      if (!idToken) {
        alert('구글 로그인 토큰을 받지 못했습니다.');
        return;
      }

      setIsGoogleLoginLoading(true);

      const { access_token, refresh_token } = await postGoogleAuth({
        id_token: idToken,
      });

      setAuthTokens(access_token, refresh_token);

      // 로그인 api 정상 작동 후 온보딩 페이지로 이동
      //navigate('/onboarding/nickname');

    } catch (error) {
      console.error(error);
      alert('구글 로그인에 실패했습니다.');
    } finally {
      setIsGoogleLoginLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    alert('구글 로그인이 취소되었거나 실패했습니다.');
  };

  return {
    isGoogleLoginLoading,
    handleGoogleLoginSuccess,
    handleGoogleLoginError,
  };
};
