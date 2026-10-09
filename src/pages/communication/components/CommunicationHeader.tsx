import CurrentLocation from '@/pages/communication/components/CurrentLocation';
import CommunicationMenu from '@/pages/communication/components/menu/CommunicationMenu';
import CommunicationMenuButton from '@/pages/communication/components/menu/CommunicationMenuButton';
import { useModal } from '@/shared/hooks/useModal';

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
  const menu = useModal();

  return (
    <header className="flex shrink-0 items-center justify-between px-base pb-sm pt-[2.75rem]">
      <CurrentLocation locationName={locationName} />

      {/* 버튼을 기준으로 모달 위치를 잡기 위한 래퍼. header 전체를 기준으로 삼으면
          header의 좌우 padding만큼 버튼과 모달 위치가 어긋난다. */}
      <div className="relative shrink-0">
        <CommunicationMenuButton isOpen={menu.isOpen} onClick={menu.open} />

        <CommunicationMenu
          isOpen={menu.isOpen}
          onClose={menu.close}
          onOpenHistory={onOpenHistory}
          onOpenFavoriteAnswer={onOpenFavoriteAnswer}
        />
      </div>
    </header>
  );
};

export default CommunicationHeader;
