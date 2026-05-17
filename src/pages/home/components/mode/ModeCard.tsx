import { Link } from 'react-router-dom';
import type { Mode } from '../../types/soundFiltering';

interface ModeCardProps {
  mode: Mode;
}

const ModeCard = ({ mode }: ModeCardProps) => {
  return (
    <Link to={`/modes/${mode.id}/settings`}>
      <div className="flex flex-col bg-gray-300 rounded-lg p-4">
        <div className="flex flex-row gap-15">
          <div aria-hidden="true">{mode.iconLabel}</div>
          <div aria-hidden="true">{'>'}</div>
        </div>
        <div className="flex flex-row-reverse">{mode.name}</div>
      </div>
    </Link>
  );
};

export default ModeCard;
