import { faBed } from '@fortawesome/free-solid-svg-icons';
import FaModeIcon from '@/shared/components/icons/modes/FaModeIcon';

interface SleepIconPropTypes {
  className?: string;
}

const SleepIcon = ({ className }: SleepIconPropTypes) => (
  <FaModeIcon icon={faBed} className={className} />
);

export default SleepIcon;
