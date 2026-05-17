import { useState } from 'react';

import HomeHeader from './components/HomeHeader';
import ModeSection from './components/mode/ModeSection';
import AddSoundBottomSheet from './components/sound/AddSoundBottomSheet';
import SoundSection from './components/sound/SoundSection';

import type { Mode, Sound } from './types/soundFiltering';

const modes: Mode[] = [
  { id: 'outdoor', name: '실외', iconLabel: '가방' },
  { id: 'home', name: '가정', iconLabel: '집' },
  { id: 'work', name: '업무', iconLabel: '카드' },
];

const containedSounds: Sound[] = [
  { id: 'baby-cry', name: '아기 울음소리', category: '생활음', iconLabel: '물방울' },
  { id: 'knock', name: '노크 소리', category: '생활음', iconLabel: '문' },
  { id: 'fire', name: '화재 경보', category: '긴급', iconLabel: '불' },
];

const Home = () => {
  const [isAddSoundOpen, setIsAddSoundOpen] = useState(false);

  return (
    <main>
      <HomeHeader />
      <ModeSection modes={modes} />
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
