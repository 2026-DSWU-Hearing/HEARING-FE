import { useNavigate } from 'react-router-dom';

import GoogleLoginButton from './components/GoogleLoginButton';
import LoginLogo from './components/LoginLogo';
import PasswordInput from './components/PasswordInput';
import { useGoogleAuth } from './hooks/useGoogleAuth';
import { useLoginForm } from './hooks/useLoginForm';

import './login.css';

const Login = () => {
  const navigate = useNavigate();

  const { loginForm, isLoginButtonDisabled, handleLoginFormChange } =
    useLoginForm();

  const {
    isGoogleLoginLoading,
    handleGoogleLoginSuccess,
    handleGoogleLoginError,
  } = useGoogleAuth();

  const handleEmailLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoginButtonDisabled) {
      return;
    }

    console.log('이메일 로그인 요청', loginForm);
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <main className="flex min-h-dvh w-full justify-center bg-neutral-950 text-primary">
      <section className="login-card-gradient min-h-dvh w-full px-lg pt-[108px]">
        <LoginLogo />

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
            className="
    caption-xs-semibold
    mt-xs h-[48px] w-full rounded-pill
    bg-[linear-gradient(0deg,var(--color-primary-300)_0%,var(--color-primary-400)_45%,var(--color-primary-500)_100%)]
    text-inverse
    shadow-[0_0_16px_0_rgb(255_249_212_/_45%)]
    transition-all
    active:scale-[0.98]
    disabled:cursor-not-allowed
    disabled:bg-none
    disabled:bg-disabled
    disabled:text-neutral-800
    disabled:shadow-none
  "
            type="submit"
            disabled={isLoginButtonDisabled}
          >
            로그인하기
          </button>
        </form>

        <div className="caption-xs-regular mt-base flex items-center justify-center gap-xs text-tertiary">
          <span>아직 계정이 없으신가요?</span>
          <button
            className="caption-xs-semibold text-primary-400 underline"
            type="button"
            onClick={handleSignUpClick}
          >
            회원가입
          </button>
        </div>

        <div className="my-lg flex items-center gap-sm">
          <span className="h-px flex-1 bg-neutral-800" />
          <p className="caption-xs-regular whitespace-nowrap text-tertiary">
            SNS 계정으로 로그인
          </p>
          <span className="h-px flex-1 bg-neutral-800" />
        </div>

        <GoogleLoginButton
          isGoogleLoginLoading={isGoogleLoginLoading}
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
        />
      </section>
    </main>
  );
};

export default Login;
