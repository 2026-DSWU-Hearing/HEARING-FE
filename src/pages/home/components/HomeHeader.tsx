import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import SilentModeButton from '@/pages/home/components/mode/SilentModeButton';
import { usePatchDoNotDisturb } from '@/shared/hooks/usePatchDoNotDisturb';

const HomeHeader = () => {
  const { mutate: updateDoNotDisturb, isPending } = usePatchDoNotDisturb();
  const [isDoNotDisturb, setIsDoNotDisturb] = useState(false);

  const handleSilentToggle = () => {
    const nextIsDoNotDisturb = !isDoNotDisturb;

    setIsDoNotDisturb(nextIsDoNotDisturb);
    updateDoNotDisturb(nextIsDoNotDisturb, {
      onError: () => {
        setIsDoNotDisturb(isDoNotDisturb);
      },
    });
  };

  return (
    <header className="mt-[2.75rem] mb-[2.5rem] flex flex-col gap-[1.5rem]">
      {/* 상단 행: 제목 + 알림 아이콘 */}
      <div className="flex items-start justify-between">
        <h1 className="heading-5xl-semibold text-primary">소리 필터링</h1>
        <button type="button" aria-label="알림">
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
        <SilentModeButton
          isSilent={isDoNotDisturb}
          isDisabled={isPending}
          onToggle={handleSilentToggle}
        />
      </div>
    </header>
  );
};

export default HomeHeader;
