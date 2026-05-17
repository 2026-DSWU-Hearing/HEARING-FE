import AddSoundButton from './AddSoundButton';
import SoundCard from './SoundCard';

import type { Sound } from '../../types/soundFiltering';

interface SoundSectionProps {
  sounds: Sound[];
  handleBtnAddSound: () => void;
}

const SoundSection = ({ sounds, handleBtnAddSound }: SoundSectionProps) => {
  return (
    <section className="flex flex-col gap-1">
      {/* 소리 섹션 제목 부분 */}
      <div className="flex flex-row justify-between">
        <h2 className="text-xl">담은 소리</h2>
        <button type="button" className="text-sm">
          편집
        </button>
      </div>
      {/* 소리 카드 리스트 부분 */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {sounds.map((sound) => (
          <SoundCard key={sound.id} sound={sound} />
        ))}
      </div>
      <AddSoundButton onClick={handleBtnAddSound} />
    </section>
  );
};

export default SoundSection;
