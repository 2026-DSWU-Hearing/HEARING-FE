import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import ToastViewport from '@/shared/components/toast/ToastViewport';

export interface ToastItemTypes {
  id: number;
  soundName: string;
  categoryName: string;
}

// 토스트에 띄울 감지 정보. id를 제외한 토스트 표시 데이터.
export type ToastContentTypes = Omit<ToastItemTypes, 'id'>;

interface ToastContextTypes {
  showToast: (content: ToastContentTypes) => void;
}

// 토스트가 화면에 떠 있는 시간(ms). 이후 자동으로 사라진다.
const TOAST_DURATION = 5000;

const ToastContext = createContext<ToastContextTypes | null>(null);

interface ToastProviderPropTypes {
  children: ReactNode;
}

// 앱 전역에서 호출하는 인앱 토스트의 상태(큐)를 관리하는 Provider.
// WS 감지 알림처럼 연달아 오는 알림을 배열로 쌓아 동시에 여러 개를 보여줄 수 있다.
export const ToastProvider = ({ children }: ToastProviderPropTypes) => {
  const [toasts, setToasts] = useState<ToastItemTypes[]>([]);
  // 각 토스트의 자동 제거 타이머를 추적해 언마운트 시 정리한다.
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  // 토스트마다 고유 id를 부여하기 위한 증가 카운터.
  const nextIdRef = useRef(0);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));

    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (content: ToastContentTypes) => {
      const id = nextIdRef.current;
      nextIdRef.current += 1;

      setToasts((prevToasts) => [...prevToasts, { id, ...content }]);

      const timer = setTimeout(() => removeToast(id), TOAST_DURATION);
      timersRef.current.set(id, timer);
    },
    [removeToast],
  );

  // 언마운트 시 남아있는 모든 타이머를 정리한다.
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

// ToastProvider가 제공하는 showToast를 꺼내 쓰는 훅. Provider 밖에서 쓰면 에러를 던진다.
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast는 ToastProvider 안에서 사용해야 합니다');
  }

  return context;
};
