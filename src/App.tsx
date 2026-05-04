import Navigation from '@/shared/components/layout/Navigation';
import AppRouter from '@/routes/AppRouter';
import '@/App.css';

function App() {
  return (
    <>
      <Navigation />
      <AppRouter />
      <div className="app">{/* 앱 내용 */}</div>
    </>
  );
}

export default App;
