import { useState } from 'react';

import SearchBar from '../sound/SearchBar';
import SoundCategoryAccordion from './SoundCategoryAccordion';

import type { Sound, SoundCategory } from '../../types/soundFiltering';

const soundsByCategory: Record<SoundCategory, Sound[]> = {
  긴급: [
    { id: 'knock', name: '노크 소리', category: '긴급', iconLabel: '문' },
    { id: 'alarm', name: '화재 경보', category: '긴급', iconLabel: '불' },
  ],
  생활음: [],
  길거리: [],
  '사람 소리': [],
};

const SoundSelectSection = () => {
  const [keyword, setKeyword] = useState('');
  const [selectedSoundIds, setSelectedSoundIds] = useState<string[]>([]);

  const selectedCount = selectedSoundIds.length;

  const toggleSound = (soundId: string) => {
    setSelectedSoundIds((currentSoundIds) =>
      currentSoundIds.includes(soundId)
        ? currentSoundIds.filter((currentSoundId) => currentSoundId !== soundId)
        : [...currentSoundIds, soundId],
    );
  };

  return (
    <section aria-labelledby="sound-select-title">
      <div>
        <h2 id="sound-select-title">소리 선택</h2>
        <span>{selectedCount}개 선택됨</span>
      </div>
      <SearchBar value={keyword} onChange={setKeyword} />
      {Object.entries(soundsByCategory).map(([category, sounds]) => (
        <SoundCategoryAccordion
          key={category}
          category={category as SoundCategory}
          sounds={sounds.filter((sound) => sound.name.includes(keyword))}
          selectedSoundIds={selectedSoundIds}
          onToggleSound={toggleSound}
        />
      ))}
    </section>
  );
};

export default SoundSelectSection;
