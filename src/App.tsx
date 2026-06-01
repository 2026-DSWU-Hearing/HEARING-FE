import { useLocation } from 'react-router-dom';

import Navigation from '@/shared/components/layout/Navigation';
import Navigation from '@/layout/Navigation';
import AppRouter from '@/routes/AppRouter';
import '@/App.css';

function App() {
  const { pathname } = useLocation();
  // 모드쪽 설정 페이지에서는 네비게이션 숨김
  const hideNavigation = pathname.startsWith('/modes/');

  return (
    <div className="app">
      <AppRouter />
      {!hideNavigation && <Navigation />}
    </div>
  );
}

export default App;
