import { useState } from 'react';

import HomeHeader from './components/HomeHeader';
import ModeSection from './components/mode/ModeSection';
import AddSoundBottomSheet from './components/sound/AddSoundBottomSheet';
import SoundSection from './components/sound/SoundSection';
import { useHomeSoundFilteringData } from './hooks/useHomeSoundFilteringData';

const Home = () => {
  const [isAddSoundOpen, setIsAddSoundOpen] = useState(false);
  const { data, isLoading, error } = useHomeSoundFilteringData();

  return (
    <main>
      <HomeHeader />
      {isLoading && <p>소리 필터링 정보를 불러오는 중입니다.</p>}
      {error && <p role="alert">{error.message}</p>}
      <ModeSection modes={data?.modes ?? []} />
      <SoundSection
        sounds={data?.containedSounds ?? []}
        onAddSound={() => setIsAddSoundOpen(true)}
      />
      <AddSoundBottomSheet
        isOpen={isAddSoundOpen}
        onClose={() => setIsAddSoundOpen(false)}
      />
    </main>
  );
};

export default Home;
