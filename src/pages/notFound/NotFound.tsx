import { Link } from 'react-router-dom';

// 정의되지 않은 경로로 접근했을 때 보여주는 404 페이지
const NotFound = () => {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-5xl font-bold">404</p>
      <p className="text-lg font-bold text-neutral-600">
        페이지를 찾을 수 없습니다
      </p>
      <Link
        to="/"
        className="rounded-xl bg-neutral-900 px-6 py-3 text-base font-bold text-white"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;
