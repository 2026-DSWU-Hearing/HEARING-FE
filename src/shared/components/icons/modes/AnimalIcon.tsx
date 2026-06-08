import { faCow } from '@fortawesome/free-solid-svg-icons';
import FaModeIcon from '@/shared/components/icons/modes/FaModeIcon';

interface AnimalIconPropTypes {
  className?: string;
}

const AnimalIcon = ({ className }: AnimalIconPropTypes) => (
  <FaModeIcon icon={faCow} className={className} />
);

export default AnimalIcon;
