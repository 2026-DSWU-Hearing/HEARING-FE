import { faSchoolFlag } from '@fortawesome/free-solid-svg-icons';
import FaModeIcon from '@/shared/components/icons/modes/FaModeIcon';

interface SchoolIconPropTypes {
  className?: string;
}

const SchoolIcon = ({ className }: SchoolIconPropTypes) => (
  <FaModeIcon icon={faSchoolFlag} className={className} />
);

export default SchoolIcon;
