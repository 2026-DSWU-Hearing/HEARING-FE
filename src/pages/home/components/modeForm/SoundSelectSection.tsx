import { useState } from 'react';

import { useSoundLibraryData } from '../../hooks/useSoundLibraryData';
import SearchBar from '../sound/SearchBar';
import SoundCategoryAccordion from './SoundCategoryAccordion';

interface SoundSelectSectionProps {
  selectedSoundIds: number[];
  onToggleSound: (soundId: number) => void;
}

const SoundSelectSection = ({ selectedSoundIds, onToggleSound }: SoundSelectSectionProps) => {
  const { data, isLoading, error } = useSoundLibraryData();
  const [keyword, setKeyword] = useState('');

  const categories = data?.categories ?? [];
  const sounds = data?.sounds ?? [];
  const selectedCount = selectedSoundIds.length;

  return (
    <section aria-labelledby="sound-select-title">
      <div>
        <h2 id="sound-select-title">소리 선택</h2>
        <span>{selectedCount}개 선택됨</span>
      </div>
      {isLoading && <p>소리 목록을 불러오는 중입니다.</p>}
      {error && <p role="alert">{error.message}</p>}
      <SearchBar value={keyword} onChange={setKeyword} />
      {categories.map((category) => (
        <SoundCategoryAccordion
          key={category}
          category={category}
          sounds={sounds.filter(
            (sound) =>
              sound.category === category && sound.name.includes(keyword),
          )}
          selectedSoundIds={selectedSoundIds}
          onToggleSound={onToggleSound}
        />
      ))}
    </section>
  );
};

export default SoundSelectSection;
