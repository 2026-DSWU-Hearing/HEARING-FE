import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';

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
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        text="signin_with"
        shape="pill"
        theme="outline"
        width="100%"
      />

      {isGoogleLoginLoading && (
        <p className="caption-xs-regular mt-xs text-center text-primary-400">
          구글 로그인 중...
        </p>
      )}
    </div>
  );
};

export default GoogleLoginButton;
