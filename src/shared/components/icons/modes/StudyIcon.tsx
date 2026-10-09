import { faBook } from '@fortawesome/free-solid-svg-icons';
import FaModeIcon from '@/shared/components/icons/modes/FaModeIcon';

interface StudyIconPropTypes {
  className?: string;
}

const StudyIcon = ({ className }: StudyIconPropTypes) => (
  <FaModeIcon icon={faBook} className={className} />
);

export default StudyIcon;
