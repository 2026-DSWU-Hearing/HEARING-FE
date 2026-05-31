import CurrentLocation from '@/pages/communication/components/CurrentLocation';
import FavoriteAnswerButton from '@/pages/communication/components/favoriteAnswer/FavoriteAnswerButton';
import HistoryButton from '@/pages/communication/components/history/HistoryButton';

interface CommunicationHeaderPropTypes {
  locationName: string;
  onOpenHistory: () => void;
  onOpenFavoriteAnswer: () => void;
}

const CommunicationHeader = ({
  locationName,
  onOpenHistory,
  onOpenFavoriteAnswer,
}: CommunicationHeaderPropTypes) => {
  return (
    <header className="flex items-center justify-between px-4 py-3">
      <HistoryButton onClick={onOpenHistory} />

      <CurrentLocation locationName={locationName} />

      <FavoriteAnswerButton onClick={onOpenFavoriteAnswer} />
    </header>
  );
};

export default CommunicationHeader;
