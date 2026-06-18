import { faDumbbell } from '@fortawesome/free-solid-svg-icons';
import FaModeIcon from '@/shared/components/icons/modes/FaModeIcon';

interface ExerciseIconPropTypes {
  className?: string;
}

const ExerciseIcon = ({ className }: ExerciseIconPropTypes) => (
  <FaModeIcon icon={faDumbbell} className={className} />
);

export default ExerciseIcon;
