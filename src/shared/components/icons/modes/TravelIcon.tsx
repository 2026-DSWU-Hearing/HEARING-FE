import { faSuitcaseRolling } from '@fortawesome/free-solid-svg-icons';
import FaModeIcon from '@/shared/components/icons/modes/FaModeIcon';

interface TravelIconPropTypes {
  className?: string;
}

const TravelIcon = ({ className }: TravelIconPropTypes) => (
  <FaModeIcon icon={faSuitcaseRolling} className={className} />
);

export default TravelIcon;
