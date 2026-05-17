import { useState } from 'react';

import AddSoundCard from './AddSoundCard';
import CategoryChips from './CategoryChips';
import SearchBar from './SearchBar';

import type { Sound, SoundCategory } from '../../types/soundFiltering';

interface AddSoundBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories: SoundCategory[] = ['긴급', '생활음', '길거리', '사람 소리'];

const sounds: Sound[] = [
  { id: 'baby-cry', name: '아기 울음소리', category: '생활음', iconLabel: '물방울' },
  { id: 'knock', name: '노크 소리', category: '생활음', iconLabel: '문' },
  { id: 'fire', name: '화재 경보', category: '긴급', iconLabel: '불' },
];

const AddSoundBottomSheet = ({ isOpen, onClose }: AddSoundBottomSheetProps) => {
  const [selectedCategory, setSelectedCategory] = useState<SoundCategory>('긴급');
  const [keyword, setKeyword] = useState('');

  if (!isOpen) {
    return null;
  }

  const filteredSounds = sounds.filter((sound) => {
    const matchesCategory = sound.category === selectedCategory;
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
        <button type="button">완료</button>
      </header>
      <SearchBar value={keyword} onChange={setKeyword} />
      <CategoryChips
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <div>
        {filteredSounds.map((sound) => (
          <AddSoundCard key={sound.id} sound={sound} />
        ))}
      </div>
    </aside>
  );
};

export default AddSoundBottomSheet;
