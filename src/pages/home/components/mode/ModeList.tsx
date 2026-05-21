import { useEffect } from 'react';
import AddBtn from '@/pages/home/components/AddBtn';
import ModeCard from '@/pages/home/components/mode/ModeCard';
import { useGetModes } from '@/pages/home/hooks/useGetModes';

interface ModeListPropTypes {
  selectedModeId: number | null;
  onModeSelect: (modeId: number) => void;
}

const ModeList = ({ selectedModeId, onModeSelect }: ModeListPropTypes) => {
  const { data, isLoading, isError } = useGetModes();

  useEffect(() => {
    if (!data?.modes.length || selectedModeId !== null) return;

    const activeMode = data.modes.find((mode) => mode.is_active);
    const defaultMode = activeMode ?? data.modes[0];

    onModeSelect(defaultMode.mode_id);
  }, [data?.modes, onModeSelect, selectedModeId]);

  if (isLoading) {
    return <div>불러오는 중...</div>;
  }

  if (isError) {
    return <div>모드 목록을 불러오지 못했습니다</div>;
  }

  return (
    <section className="mt-8">
      <div className="flex flex-row justify-between gap-3">
        {data?.modes.map((mode) => (
          <ModeCard
            key={mode.mode_id}
            mode={mode}
            isSelected={mode.mode_id === selectedModeId}
            onModeSelect={onModeSelect}
          />
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <AddBtn label="새 모드 추가하기" to="/modes/new" />
      </div>
    </section>
  );
};

export default ModeList;
