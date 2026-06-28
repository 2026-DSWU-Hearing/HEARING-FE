import { useId, useState } from 'react';

import ConfirmButtons from '@/shared/components/ConfirmButtons';
import TextInput from '@/shared/components/TextInput';
import { useEscapeKey } from '@/shared/hooks/useEscapeKey';

interface DeviceRegisterModalPropTypes {
  onClose: () => void;
  /** 트림된 닉네임을 전달한다 (빈 값이면 호출되지 않음) */
  onSubmit: (nickname: string) => void;
}

const DEVICE_NAME_MAX_LENGTH = 10;

/**
 * 디바이스 등록 모달.
 * 기기 이름(닉네임)만 입력받는다. mac_address는 등록 핸들러에서 임시 생성한다.
 * DeviceNameEditModal과 동일한 오버레이 골격(배경 클릭·ESC 닫기)을 차용한다.
 */
const DeviceRegisterModal = ({
  onClose,
  onSubmit,
}: DeviceRegisterModalPropTypes) => {
  const titleId = useId();
  const [nickname, setNickname] = useState('');

  useEscapeKey(true, onClose);

  const isOverLength = nickname.length > DEVICE_NAME_MAX_LENGTH;
  const isEmpty = nickname.trim().length === 0;
  const errorMessage = isOverLength
    ? `기기 이름은 최대 ${DEVICE_NAME_MAX_LENGTH}글자까지만 가능합니다`
    : undefined;

  const handleSubmit = () => {
    const trimmedName = nickname.trim();
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
          디바이스 등록
        </h2>
        <TextInput
          value={nickname}
          onChange={setNickname}
          placeholder="기기 이름을 입력하세요"
          maxLength={DEVICE_NAME_MAX_LENGTH}
          errorMessage={errorMessage}
          inputClassName="h-[2.4375rem] bg-neutral-700 py-xs px-base rounded-lg"
        />
        <ConfirmButtons
          onConfirm={handleSubmit}
          onCancel={onClose}
          confirmText="등록"
          cancelText="취소"
          confirmDisabled={isOverLength || isEmpty}
        />
      </div>
    </div>
  );
};

export default DeviceRegisterModal;
