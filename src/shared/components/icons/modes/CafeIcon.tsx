import { faMugSaucer } from '@fortawesome/free-solid-svg-icons';
import FaModeIcon from '@/shared/components/icons/modes/FaModeIcon';

interface CafeIconPropTypes {
  className?: string;
}

const CafeIcon = ({ className }: CafeIconPropTypes) => (
  <FaModeIcon icon={faMugSaucer} className={className} />
);

export default CafeIcon;
