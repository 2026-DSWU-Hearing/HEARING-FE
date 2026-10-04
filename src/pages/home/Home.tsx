import HomeHeader from '@/pages/home/components/HomeHeader';
import SoundSection from '@/pages/home/components/sound/SoundSection';
import ModeList from './components/mode/ModeList';
import {
  HomeModeProvider,
  useHomeModeContext,
} from '@/pages/home/hooks/useHomeModeContext';
import AlertModal from '@/shared/components/AlertModal';

// Provider 안에서 컨텍스트를 읽어야 하므로 화면 내용을 분리한다. 홈 공용 안내 모달도 여기서 렌더한다.
const HomeContent = () => {
  const { alertMessage, clearAlertMessage } = useHomeModeContext();

  return (
    <div className="min-h-dvh pt-[2.75rem] pb-[9.5rem] px-[1.03rem]">
      <HomeHeader />
      <ModeList />
      <SoundSection />
      <AlertModal
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={clearAlertMessage}
      />
    </div>
  );
};

const Home = () => {
  return (
    <HomeModeProvider>
      <HomeContent />
    </HomeModeProvider>
  );
};

export default Home;
