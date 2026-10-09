import { faHospital } from '@fortawesome/free-solid-svg-icons';
import FaModeIcon from '@/shared/components/icons/modes/FaModeIcon';

interface HospitalIconPropTypes {
  className?: string;
}

const HospitalIcon = ({ className }: HospitalIconPropTypes) => (
  <FaModeIcon icon={faHospital} className={className} />
);

export default HospitalIcon;
