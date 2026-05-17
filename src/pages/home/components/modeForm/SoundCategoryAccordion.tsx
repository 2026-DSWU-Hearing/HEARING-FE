import SelectableSoundRow from './SelectableSoundRow';

import type { Sound, SoundCategory } from '../../types/soundFiltering';

interface SoundCategoryAccordionProps {
  category: SoundCategory;
  sounds: Sound[];
  selectedSoundIds: string[];
  onToggleSound: (soundId: string) => void;
}

const SoundCategoryAccordion = ({
  category,
  sounds,
  selectedSoundIds,
  onToggleSound,
}: SoundCategoryAccordionProps) => {
  return (
    <details>
      <summary>{category}</summary>
      {sounds.map((sound) => (
        <SelectableSoundRow
          key={sound.id}
          sound={sound}
          isSelected={selectedSoundIds.includes(sound.id)}
          onToggleSound={onToggleSound}
        />
      ))}
    </details>
  );
};

export default SoundCategoryAccordion;
