import { useId, useState } from 'react';

import ConfirmButtons from '@/shared/components/ConfirmButtons';
import TextInput from '@/shared/components/TextInput';
import { useEscapeKey } from '@/shared/hooks/useEscapeKey';

interface DeviceNameEditModalPropTypes {
  /** 현재 기기 이름 (입력 초기값) */
  currentName: string;
  onClose: () => void;
  /** 트림된 새 이름을 전달한다 (빈 값이면 호출되지 않음) */
  onSubmit: (name: string) => void;
}

const DEVICE_NAME_MAX_LENGTH = 10;

/**
 * 기기 이름 변경 모달.
 * ConfirmModal과 동일한 오버레이 골격(배경 클릭·ESC 닫기)을 차용하되,
 * 본문에 TextInput을 넣어 이름을 입력받는다.
 * 열릴 때마다 새로 마운트되도록 부모가 조건부 렌더하므로 currentName이 그대로 초기값이 된다.
 */
const DeviceNameEditModal = ({
  currentName,
  onClose,
  onSubmit,
}: DeviceNameEditModalPropTypes) => {
  const titleId = useId();
  const [name, setName] = useState(currentName);

  useEscapeKey(true, onClose);

  const isOverLength = name.length > DEVICE_NAME_MAX_LENGTH;
  const isEmpty = name.trim().length === 0;
  const errorMessage = isOverLength
    ? `기기 이름은 최대 ${DEVICE_NAME_MAX_LENGTH}글자까지만 가능합니다`
    : undefined;

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName || isOverLength) return;
    onSubmit(trimmedName);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/50"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex w-[20rem] flex-col gap-base rounded-2xl bg-neutral-800 p-lg shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="heading-lg-semibold text-white">
          기기 이름 변경
        </h2>
        <TextInput
          value={name}
          onChange={setName}
          placeholder="기기 이름을 입력하세요"
          maxLength={DEVICE_NAME_MAX_LENGTH}
          errorMessage={errorMessage}
          inputClassName="h-[2.4375rem] bg-neutral-700 py-xs px-base rounded-lg"
        />
        <ConfirmButtons
          onConfirm={handleSubmit}
          onCancel={onClose}
          confirmText="저장"
          cancelText="취소"
          confirmDisabled={isOverLength || isEmpty}
        />
      </div>
    </div>
  );
};

export default DeviceNameEditModal;
