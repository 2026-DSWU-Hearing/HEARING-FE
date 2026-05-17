import { useState } from 'react';

import ModeIconPicker from './ModeIconPicker';
import ModeNameField from './ModeNameField';
import PageHeader from './PageHeader';
import SoundSelectSection from './SoundSelectSection';

interface ModeFormProps {
  title: string;
  nameLabel: string;
  submitLabel: string;
  initialName?: string;
  showDeleteButton?: boolean;
}

const ModeForm = ({
  title,
  nameLabel,
  submitLabel,
  initialName = '',
  showDeleteButton = false,
}: ModeFormProps) => {
  const [modeName, setModeName] = useState(initialName);
  const [selectedIconId, setSelectedIconId] = useState('icon-10');
  const [selectedSoundIds, setSelectedSoundIds] = useState<number[]>([]);

  const toggleSound = (soundId: number) => {
    setSelectedSoundIds((currentSoundIds) =>
      currentSoundIds.includes(soundId)
        ? currentSoundIds.filter((id) => id !== soundId)
        : [...currentSoundIds, soundId],
    );
  };

  const handleSubmit = () => {
    // TODO: API 연동 시 구현
    console.log({ modeName, selectedIconId, selectedSoundIds });
  };

  return (
    <main>
      <PageHeader title={title} submitLabel={submitLabel} onSubmit={handleSubmit} />
      <ModeNameField
        label={nameLabel}
        value={modeName}
        onChange={setModeName}
      />
      <ModeIconPicker
        selectedIconId={selectedIconId}
        onSelectIcon={setSelectedIconId}
      />
      <SoundSelectSection
        selectedSoundIds={selectedSoundIds}
        onToggleSound={toggleSound}
      />
      {showDeleteButton && (
        <button type="button">모드 삭제하기</button>
      )}
    </main>
  );
};

export default ModeForm;
