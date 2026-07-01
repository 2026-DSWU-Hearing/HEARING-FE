import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { postGuestLogin } from './apis/authApi';
import GoogleLoginButton from './components/GoogleLoginButton';
import LoginLogo from './components/LoginLogo';
import { useGoogleAuth } from './hooks/useGoogleAuth';

import './login.css';

const Login = () => {
  const navigate = useNavigate();

  const [isGuestLoginLoading, setIsGuestLoginLoading] = useState(false);

  const {
    isGoogleLoginLoading,
    handleGoogleLoginSuccess,
    handleGoogleLoginError,
  } = useGoogleAuth();

  const handleGuestLogin = async () => {
    try {
      setIsGuestLoginLoading(true);

      const data = await postGuestLogin();

      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      localStorage.setItem('tokenType', data.token_type);
      localStorage.setItem('loginType', 'guest');

      navigate('/');
    } catch (error) {
      console.error('게스트 로그인 실패:', error);
      alert('게스트 로그인에 실패했습니다.');
    } finally {
      setIsGuestLoginLoading(false);
    }
  };

  return (
    <main className="flex min-h-dvh w-full justify-center bg-neutral-950 text-primary">
      <section className="login-card-gradient flex min-h-dvh w-full flex-col px-lg pt-[108px]">
        <LoginLogo />

        <div className="mt-auto pb-[100px]">
          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={isGuestLoginLoading}
            className="
  caption-xs-semibold
  h-[48px] w-full rounded-pill
  bg-[linear-gradient(0deg,var(--color-primary-900),var(--color-primary-800)_100%)]
  text-secondary
  transition-all
  active:scale-[0.98]
  disabled:cursor-not-allowed
  disabled:opacity-60
"
          >
            {isGuestLoginLoading ? '게스트 로그인 중...' : '게스트 로그인'}
          </button>

          {/*
            이메일 로그인 UI 임시 주석 처리

            <form className="flex flex-col" onSubmit={handleEmailLoginSubmit}>
              <label
                className="caption-xs-semibold mb-xs text-primary"
                htmlFor="email"
              >
                이메일 주소
              </label>

              <input
                id="email"
                name="email"
                className="body-base-regular mb-base h-[48px] w-full rounded-lg border border-neutral-800 bg-neutral-900 px-base text-primary outline-none placeholder:text-disabled focus:border-primary-400"
                type="email"
                placeholder="example@naver.com"
                value={loginForm.email}
                onChange={handleLoginFormChange}
              />

              <label
                className="caption-xs-semibold mb-xs text-primary"
                htmlFor="password"
              >
                비밀번호
              </label>

              <PasswordInput
                value={loginForm.password}
                onChange={handleLoginFormChange}
              />

              <button
                className="caption-xs-semibold mt-xs h-[48px] w-full rounded-pill bg-[linear-gradient(0deg,var(--color-primary-300)_0%,var(--color-primary-400)_45%,var(--color-primary-500)_100%)] text-inverse shadow-[0_0_16px_0_rgb(255_249_212_/_45%)] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-none disabled:bg-disabled disabled:text-neutral-800 disabled:shadow-none"
                type="submit"
                disabled={isLoginButtonDisabled}
              >
                로그인하기
              </button>
            </form>
          */}

          <div className="my-lg flex items-center gap-sm">
            <span className="h-px flex-1 bg-neutral-800" />
            <p className="caption-xs-regular whitespace-nowrap text-disabled">
              SNS 계정으로 로그인
            </p>
            <span className="h-px flex-1 bg-neutral-800" />
          </div>

          <GoogleLoginButton
            isGoogleLoginLoading={isGoogleLoginLoading}
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />
        </div>
      </section>
    </main>
  );
};

export default Login;
