import { faSuitcase } from '@fortawesome/free-solid-svg-icons';
import FaModeIcon from '@/shared/components/icons/modes/FaModeIcon';

interface WorkplaceIconPropTypes {
  className?: string;
}

const WorkplaceIcon = ({ className }: WorkplaceIconPropTypes) => (
  <FaModeIcon icon={faSuitcase} className={className} />
);

export default WorkplaceIcon;
