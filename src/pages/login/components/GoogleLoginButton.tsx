import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';

import googleIcon from '@/shared/assets/icons/login/ic_google_gray.svg';

interface GoogleLoginButtonPropTypes {
  isGoogleLoginLoading: boolean;
  onSuccess: (credentialResponse: CredentialResponse) => void;
  onError: () => void;
}

const GoogleLoginButton = ({
  isGoogleLoginLoading,
  onSuccess,
  onError,
}: GoogleLoginButtonPropTypes) => {
  return (
    <div className="w-full">
      <div className="relative h-[48px] w-full overflow-hidden rounded-full bg-[#1f211f]">
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-[10px]">
          <img src={googleIcon} alt="Google" className="h-[18px] w-[18px]" />
          <span className="text-[14px] font-medium text-white">
            Google로 로그인
          </span>
        </div>

        <div className="absolute inset-0 opacity-0">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
            text="signin_with"
            shape="pill"
            theme="outline"
            width="100%"
          />
        </div>
      </div>

      {isGoogleLoginLoading && (
        <p className="caption-xs-regular mt-xs text-center text-primary-400">
          구글 로그인 중...
        </p>
      )}
    </div>
  );
};

export default GoogleLoginButton;
