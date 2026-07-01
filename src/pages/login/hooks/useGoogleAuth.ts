import axios from 'axios';
import type { CredentialResponse } from '@react-oauth/google';
import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';

import { postGoogleAuth } from '../apis/authApi';

export const useGoogleAuth = () => {
  //const navigate = useNavigate();
  const [isGoogleLoginLoading, setIsGoogleLoginLoading] = useState(false);

  const handleGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    try {
      console.log('구글 로그인 성공 응답:', credentialResponse);
      setIsGoogleLoginLoading(true);

      const idToken = credentialResponse.credential;
      console.log('idToken:', idToken);

      if (!idToken) {
        alert('구글 로그인 토큰을 가져오지 못했습니다.');
        return;
      }

      const data = await postGoogleAuth({
        id_token: idToken,
      });

      console.log('백엔드 로그인 응답:', data);

      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      localStorage.setItem('tokenType', data.token_type);
      localStorage.setItem('loginType', 'google');

      // 로그인 api 정상 작동 후 온보딩 페이지로 이동
      //navigate('/onboarding/nickname');

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          '백엔드 구글 로그인 실패 status:',
          error.response?.status,
        );
        console.error('백엔드 구글 로그인 실패 data:', error.response?.data);
      } else {
        console.error('구글 로그인 실패:', error);
      }

      alert('구글 로그인에 실패했습니다.');
    } finally {
      setIsGoogleLoginLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    console.error('구글 인증 자체 실패');
    alert('구글 로그인에 실패했습니다.');
  };

  return {
    isGoogleLoginLoading,
    handleGoogleLoginSuccess,
    handleGoogleLoginError,
  };
};
