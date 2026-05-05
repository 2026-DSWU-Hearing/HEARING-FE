import Navigation from '@/shared/components/layout/Navigation';
import AppRouter from '@/routes/AppRouter';
import '@/App.css';

function App() {
  return (
    <>
      <div className="app">
        {/* 앱 내용 */}
        <AppRouter />
        <Navigation />
      </div>
    </>
  );
}

export default App;
