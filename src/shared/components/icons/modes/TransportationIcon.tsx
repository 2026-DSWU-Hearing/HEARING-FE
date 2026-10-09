import { faTrainSubway } from '@fortawesome/free-solid-svg-icons';
import FaModeIcon from '@/shared/components/icons/modes/FaModeIcon';

interface TransportationIconPropTypes {
  className?: string;
}

const TransportationIcon = ({ className }: TransportationIconPropTypes) => (
  <FaModeIcon icon={faTrainSubway} className={className} />
);

export default TransportationIcon;
