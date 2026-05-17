import AddModeButton from './AddModeButton';
import ModeCard from './ModeCard';
import SilentModeButton from './SilentModeButton';

import type { Mode } from '../../types/soundFiltering';

interface ModeSectionProps {
  modes: Mode[];
}

const ModeSection = ({ modes }: ModeSectionProps) => {
  return (
    <section className="flex flex-col">
      <h2 className="sr-only">모드 선택</h2>
      <SilentModeButton />
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-3 gap-4 mt-4">
          {modes.map((mode) => (
            <ModeCard key={mode.id} mode={mode} />
          ))}
        </div>
        <AddModeButton />
      </div>
    </section>
  );
};

export default ModeSection;
