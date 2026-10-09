import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import FaModeIcon from '@/shared/components/icons/modes/FaModeIcon';

interface GoingOutIconPropTypes {
  className?: string;
}

const GoingOutIcon = ({ className }: GoingOutIconPropTypes) => (
  <FaModeIcon icon={faArrowRightFromBracket} className={className} />
);

export default GoingOutIcon;
