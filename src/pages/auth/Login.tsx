import { useState } from 'react';
import type { FormEvent } from 'react';
import Input from '@/pages/home/components/modeForm/Input';

// 로그인 페이지 (최소 UI). 실제 인증 연동(POST /auth/login + 토큰 저장)은 백엔드 auth 복구 후 채운다.
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: POST /auth/login 호출 → 성공 시 access_token 을 localStorage 'token' 에 저장 → 홈으로 이동
  };

  return (
    <div className="flex min-h-dvh flex-col justify-center px-6">
      <h1 className="mb-10 text-2xl font-bold">로그인</h1>

      <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6">
        <Input
          label="이메일"
          value={email}
          placeholder="이메일을 입력하세요"
          onChange={setEmail}
        />
        <Input
          label="비밀번호"
          value={password}
          placeholder="비밀번호를 입력하세요"
          onChange={setPassword}
        />

        <button
          type="submit"
          className="mt-4 rounded-xl bg-neutral-900 px-5 py-4 text-base font-bold text-white"
        >
          로그인
        </button>
      </form>
    </div>
  );
};

export default Login;
