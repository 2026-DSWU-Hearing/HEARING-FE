import HomeHeader from '@/pages/home/components/HomeHeader';
import SoundSection from '@/pages/home/components/sound/SoundSection';
import ModeList from './components/mode/ModeList';
import { HomeModeProvider } from '@/pages/home/hooks/useHomeModeContext';

const Home = () => {
  return (
    <HomeModeProvider>
      <div className="min-h-dvh pt-[2.75rem] pb-[9.5rem] px-[1.03rem]">
        <HomeHeader />
        <ModeList />
        <SoundSection />
      </div>
    </HomeModeProvider>
  );
};

export default Home;
