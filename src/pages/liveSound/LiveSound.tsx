import AlertModal from '@/shared/components/AlertModal';

import LiveSoundHeader from './components/LiveSoundHeader';
import LiveSoundAnimationArea from './components/LiveSoundAnimationArea';
import SoundRateBlock from './components/SoundRateBlock';
import { useLiveSoundStatus } from './hooks/useLiveSoundStatus';

const LiveSound = () => {
  const {
    status,
    isListening,
    statusLabel,
    soundRateList,
    alertMessage,
    handleListeningToggleClick,
    handleAlertClose,
  } = useLiveSoundStatus();

  return (
    <main className="flex min-h-dvh flex-col px-[1rem] pb-[9.5rem]">
      <LiveSoundHeader />
      <section className="flex flex-1 flex-col items-center">
        <LiveSoundAnimationArea
          isListening={isListening}
          isConnecting={status === 'connecting'}
          statusLabel={statusLabel}
          soundRateList={soundRateList}
          onListeningToggleClick={handleListeningToggleClick}
        />
        <SoundRateBlock
          isListening={isListening}
          soundRateList={soundRateList}
        />
      </section>
      <AlertModal
        isOpen={!!alertMessage}
        message={alertMessage}
        onClose={handleAlertClose}
      />
    </main>
  );
};

export default LiveSound;
