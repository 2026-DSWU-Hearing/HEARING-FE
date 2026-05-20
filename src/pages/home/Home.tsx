import { useState } from 'react';

import HomeHeader from './components/HomeHeader';
import ModeSection from './components/mode/ModeSection';
import AddSoundBottomSheet from './components/sound/AddSoundBottomSheet';
import SoundSection from './components/sound/SoundSection';
import { useHomeSoundFilteringData } from './hooks/useHomeSoundFilteringData';

const Home = () => {
  const [isAddSoundOpen, setIsAddSoundOpen] = useState(false);
  const [selectedModeId, setSelectedModeId] = useState<number | null>(null);
  const { data, isLoading, error } = useHomeSoundFilteringData();

  const activatedModeId =
    selectedModeId ?? data?.modes.find((mode) => mode.isActivated)?.id;

  const modes =
    data?.modes.map((mode) => ({
      ...mode,
      isActivated: mode.id === activatedModeId,
    })) ?? [];

  const activatedMode = modes.find((mode) => mode.isActivated);
  const containedSounds =
    data?.modeDetails.find((mode) => mode.id === activatedMode?.id)?.sounds ??
    [];

  const handleChangeMode = (modeId: number) => {
    setSelectedModeId(modeId);
  };

  return (
    <main>
      <HomeHeader />
      {isLoading && <p>소리 필터링 정보를 불러오는 중입니다.</p>}
      {error && <p role="alert">{error.message}</p>}
      <ModeSection modes={modes} onChangeMode={handleChangeMode} />
      <SoundSection
        sounds={containedSounds}
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
