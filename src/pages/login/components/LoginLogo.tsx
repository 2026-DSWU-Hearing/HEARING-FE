import brandLogo from '@/shared/assets/brand/brand-logo.png';

const LoginLogo = () => {
  return (
    <div className="mb-[86px] flex flex-col items-center">
      <img
        className="w-[140px] h-auto object-contain"
        src={brandLogo}
        alt="Hearing 로고"
      />
    </div>
  );
};

export default LoginLogo;
