import { useState } from 'react';

import ModeIconPicker from './ModeIconPicker';
import ModeNameField from './ModeNameField';
import PageHeader from './PageHeader';
import SoundSelectSection from './SoundSelectSection';

import type { ModeRequestBodyTypes } from '../../types/soundFiltering';

interface ModeFormPropTypes {
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
}: ModeFormPropTypes) => {
  const [modeName, setModeName] = useState(initialName);
  const [selectedIconId, setSelectedIconId] = useState('icon-10');
  const [selectedSoundIds, setSelectedSoundIds] = useState<number[]>([]);

  const handleToggleSound = (soundId: number) => {
    setSelectedSoundIds((currentSoundIds) =>
      currentSoundIds.includes(soundId)
        ? currentSoundIds.filter((id) => id !== soundId)
        : [...currentSoundIds, soundId],
    );
  };

  const handleSubmit = () => {
    const modeRequestBody: ModeRequestBodyTypes = {
      name: modeName,
      icon: selectedIconId,
      sound_ids: selectedSoundIds,
    };

    // TODO: API 연동 시 구현
    console.log(modeRequestBody);
  };

  return (
    <main>
      <PageHeader
        title={title}
        submitLabel={submitLabel}
        onSubmit={handleSubmit}
      />
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
        onToggleSound={handleToggleSound}
      />
      {showDeleteButton && <button type="button">모드 삭제하기</button>}
    </main>
  );
};

export default ModeForm;
