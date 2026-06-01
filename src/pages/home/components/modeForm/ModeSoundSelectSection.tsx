import ModeSoundSelectBlock from '@/pages/home/components/modeForm/ModeSoundSelectBlock';
import { useModeFormContext } from '@/pages/home/components/modeForm/ModeFormContext';
import { useGetSounds } from '@/pages/home/hooks/useGetSounds';

const ModeSoundSelectSection = () => {
  const { data, isLoading, isError } = useGetSounds();
  const { selectedSoundIds, handleSoundToggle } = useModeFormContext();

  const sounds = data ?? [];

  return (
    <section aria-labelledby="sound-select-heading">
      <h2 id="sound-select-heading">소리 선택</h2>

      {isLoading && <p>소리 목록을 불러오는 중...</p>}
      {isError && <p>소리 목록을 불러오지 못했습니다</p>}

      <div>
        {sounds.map((sound) => (
          <ModeSoundSelectBlock
            key={sound.id}
            sound={sound}
            isSelected={selectedSoundIds.includes(sound.id)}
            onToggle={handleSoundToggle}
          />
        ))}
      </div>
    </section>
  );
};

export default ModeSoundSelectSection;
