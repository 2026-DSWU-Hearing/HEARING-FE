import { useCallback, useState } from 'react';
import HomeHeader from '@/pages/home/components/HomeHeader';
import SoundSection from '@/pages/home/components/sound/SoundSection';
import ModeList from './components/mode/ModeList';

const Home = () => {
  const [selectedModeId, setSelectedModeId] = useState<number | null>(null);

  const handleModeSelect = useCallback((modeId: number) => {
    setSelectedModeId(modeId);
  }, []);

  return (
    <div className="min-h-dvh px-6 pb-28 pt-12">
      <HomeHeader />
      <ModeList
        selectedModeId={selectedModeId}
        onModeSelect={handleModeSelect}
      />
      <SoundSection selectedModeId={selectedModeId} />
    </div>
  );
};

export default Home;
