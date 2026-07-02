import GoogleLoginButton from '@/pages/login/components/GoogleLoginButton';
import LoginLogo from '@/pages/login/components/LoginLogo';
import { useGoogleAuth } from '@/pages/login/hooks/useGoogleAuth';
import { useGuestLogin } from '@/pages/login/hooks/useGuestLogin';

import '@/pages/login/login.css';

const Login = () => {
  const { isGuestLoginLoading, handleGuestLogin } = useGuestLogin();

  const {
    isGoogleLoginLoading,
    handleGoogleLoginSuccess,
    handleGoogleLoginError,
  } = useGoogleAuth();

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
