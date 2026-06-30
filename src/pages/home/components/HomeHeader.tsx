import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import DoNotDisturbButton from '@/pages/home/components/mode/DoNotDisturbButton';
import { useHomeModeContext } from '@/pages/home/hooks/useHomeModeContext';

const HomeHeader = () => {
  const navigate = useNavigate();
  const { isDoNotDisturb, isDoNotDisturbPending, handleDoNotDisturbToggle } =
    useHomeModeContext();

  const handleBellClick = () => {
    navigate('/notifications');
  };

  return (
    <header className="mb-[2.5rem] flex flex-col gap-[1.5rem]">
      {/* 상단 행: 제목 + 알림 아이콘 */}
      <div className="flex items-start justify-between">
        <h1 className="heading-5xl-semibold text-primary">소리 필터링</h1>
        <button type="button" aria-label="알림" onClick={handleBellClick}>
          <FontAwesomeIcon
            icon={faBell}
            className="h-[1.5rem] w-[1.5rem] text-primary"
          />
        </button>
      </div>

      {/* 하단 행: 인사 문구 + 방해금지 모드 버튼 */}
      <div className="flex items-end justify-between">
        <p className="heading-base-semibold text-secondary">
          리치님 반가워요
          <br />
          환경에 맞는 모드를 선택하세요
        </p>
        <DoNotDisturbButton
          isDoNotDisturb={isDoNotDisturb}
          isDisabled={isDoNotDisturbPending}
          onToggle={handleDoNotDisturbToggle}
        />
      </div>
    </header>
  );
};

export default HomeHeader;
