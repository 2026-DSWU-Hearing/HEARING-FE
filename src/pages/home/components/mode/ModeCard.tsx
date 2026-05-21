import { useGetModes } from '@/pages/home/hooks/useGetModes';

const ModeCard = () => {
  const { data, isLoading, isError } = useGetModes();

  if (isLoading) {
    {
      /* 이후 로딩 스피너로 변경 */
    }
    return <div>불러오는 중...</div>;
  }

  if (isError) {
    {
      /* 이후 에러 페이지로 변경 */
    }
    return <div>모드 목록을 불러오지 못했습니다</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {data?.modes.map((mode) => (
        <div
          key={mode.mode_id}
          className={`flex cursor-pointer flex-col gap-4 rounded-lg ${
            mode.is_active
              ? 'bg-amber-500 ring-2 ring-amber-600'
              : 'bg-gray-300'
          }`}
        >
          <span>{mode.icon}</span>
          <span>{mode.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ModeCard;
