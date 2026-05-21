import ModeCard from '@/pages/home/components/mode/ModeCard';
import { useGetModes } from '@/pages/home/hooks/useGetModes';

const ModeList = () => {
  const { data, isLoading, isError } = useGetModes();

  if (isLoading) {
    return <div>불러오는 중...</div>;
  }

  if (isError) {
    return <div>모드 목록을 불러오지 못했습니다</div>;
  }

  return (
    <div className="flex flex-row justify-between">
      {data?.modes.map((mode) => (
        <ModeCard key={mode.mode_id} mode={mode} />
      ))}
    </div>
  );
};

export default ModeList;
