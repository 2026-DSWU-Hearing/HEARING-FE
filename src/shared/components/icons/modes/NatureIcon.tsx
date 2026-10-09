import { faCloudShowersHeavy } from '@fortawesome/free-solid-svg-icons';
import FaModeIcon from '@/shared/components/icons/modes/FaModeIcon';

interface NatureIconPropTypes {
  className?: string;
}

const NatureIcon = ({ className }: NatureIconPropTypes) => (
  <FaModeIcon icon={faCloudShowersHeavy} className={className} />
);

export default NatureIcon;
