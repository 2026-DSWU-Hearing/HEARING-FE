import { useEffect, useState } from 'react';

import { useSoundLibraryData } from '../../hooks/useSoundLibraryData';
import AddSoundCard from './AddSoundCard';
import CategoryChips from './CategoryChips';
import SearchBar from './SearchBar';

import type { SoundCategory } from '../../types/soundFiltering';

interface AddSoundBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSoundBottomSheet = ({ isOpen, onClose }: AddSoundBottomSheetProps) => {
  const { data, isLoading, error } = useSoundLibraryData();
  const [selectedCategory, setSelectedCategory] = useState<SoundCategory | null>(null);
  const [keyword, setKeyword] = useState('');
  const [selectedSoundIds, setSelectedSoundIds] = useState<number[]>([]);

  const categories = data?.categories ?? [];
  const sounds = data?.sounds ?? [];
  const activeCategory = selectedCategory ?? categories[0] ?? null;

  useEffect(() => {
    if (!isOpen) {
      setSelectedSoundIds([]);
      setKeyword('');
      setSelectedCategory(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const toggleSound = (soundId: number) => {
    setSelectedSoundIds((currentSoundIds) =>
      currentSoundIds.includes(soundId)
        ? currentSoundIds.filter((id) => id !== soundId)
        : [...currentSoundIds, soundId],
    );
  };

  const filteredSounds = sounds.filter((sound) => {
    const matchesCategory = activeCategory ? sound.category === activeCategory : true;
    const matchesKeyword = sound.name.includes(keyword);

    return matchesCategory && matchesKeyword;
  });

  return (
    <aside aria-labelledby="add-sound-title">
      <header>
        <button type="button" onClick={onClose} aria-label="닫기">
          x
        </button>
        <h2 id="add-sound-title">소리 추가하기</h2>
        <button type="button" onClick={onClose}>완료</button>
      </header>
      {isLoading && <p>소리 목록을 불러오는 중입니다.</p>}
      {error && <p role="alert">{error.message}</p>}
      <SearchBar value={keyword} onChange={setKeyword} />
      {activeCategory && (
        <CategoryChips
          categories={categories}
          selectedCategory={activeCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}
      <div>
        {filteredSounds.map((sound) => (
          <AddSoundCard
            key={sound.id}
            sound={sound}
            isSelected={selectedSoundIds.includes(sound.id)}
            onToggle={toggleSound}
          />
        ))}
      </div>
    </aside>
  );
};

export default AddSoundBottomSheet;
