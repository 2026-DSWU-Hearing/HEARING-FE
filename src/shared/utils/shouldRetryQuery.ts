import { isAxiosError } from 'axios';

// 연결 실패·타임아웃·잘못된 요청은 즉시 안내하고, 일시적인 서버 오류만 한 번 재시도한다.
export const shouldRetryQuery = (failureCount: number, error: Error) => {
  return (
    failureCount < 1 &&
    isAxiosError(error) &&
    error.response !== undefined &&
    error.response.status >= 500
  );
};
