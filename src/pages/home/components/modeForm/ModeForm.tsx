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

  return (
    <main>
      <PageHeader title={title} submitLabel={submitLabel} />
      <ModeNameField label={nameLabel} value={modeName} onChange={setModeName} />
      <ModeIconPicker selectedIconId={selectedIconId} onSelectIcon={setSelectedIconId} />
      {showDeleteButton ? (
        <button type="button">모드 삭제하기</button>
      ) : (
        <SoundSelectSection />
      )}
    </main>
  );
};

export default ModeForm;
