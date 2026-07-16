import LiveSoundHeader from './components/LiveSoundHeader';
import LiveSoundAnimationArea from './components/LiveSoundAnimationArea';
import SoundRateBlock from './components/SoundRateBlock';
import { useLiveSoundStatus } from './hooks/useLiveSoundStatus';

const LiveSound = () => {
  const {
    isListening,
    statusLabel,
    soundRateList,
    handleListeningToggleClick,
  } = useLiveSoundStatus();

  return (
    <main className="flex min-h-dvh flex-col px-[1rem] pb-[9.5rem]">
      <LiveSoundHeader />
      <section className="flex flex-1 flex-col items-center">
        <LiveSoundAnimationArea
          isListening={isListening}
          statusLabel={statusLabel}
          onListeningToggleClick={handleListeningToggleClick}
        />
        <SoundRateBlock
          isListening={isListening}
          soundRateList={soundRateList}
        />
      </section>
    </main>
  );
};

export default LiveSound;
