import { useId, useState } from 'react';

import ConfirmButtons from '@/shared/components/ConfirmButtons';
import TextInput from '@/shared/components/TextInput';
import { useEscapeKey } from '@/shared/hooks/useEscapeKey';

interface DeviceRegisterModalPropTypes {
  onClose: () => void;
  /** 트림된 닉네임을 전달한다 (빈 값이면 호출되지 않음) */
  onSubmit: (nickname: string) => void;
  /** 등록 요청 진행 중 여부. 연타 방지와 버튼 문구에 사용한다. */
  isPending?: boolean;
  /** 등록 실패 사유. 있으면 버튼 위에 표시한다. */
  errorMessage?: string;
}

const DEVICE_NAME_MAX_LENGTH = 10;

/**
 * 디바이스 등록 모달.
 * 기기 이름(닉네임)만 입력받는다. 기기 식별은 ESP32가 서버에 접속하며 처리하므로
 * 프론트가 보낼 정보는 이름뿐이다.
 * DeviceNameEditModal과 동일한 오버레이 골격(배경 클릭·ESC 닫기)을 차용한다.
 *
 * 등록 성공 여부는 호출부만 알 수 있으므로 모달을 닫는 책임도 호출부에 있다.
 * (실패 시 모달을 유지한 채 사유를 보여주기 위함)
 */
const DeviceRegisterModal = ({
  onClose,
  onSubmit,
  isPending = false,
  errorMessage,
}: DeviceRegisterModalPropTypes) => {
  const titleId = useId();
  const [nickname, setNickname] = useState('');

  useEscapeKey(true, onClose);

  const isOverLength = nickname.length > DEVICE_NAME_MAX_LENGTH;
  const isEmpty = nickname.trim().length === 0;
  // 글자수 초과는 입력값 자체의 문제이므로 입력 필드에 붙인다.
  // 등록 실패(errorMessage)는 요청의 문제라 버튼 위에 따로 표시해 서로 가리지 않게 한다.
  const lengthErrorMessage = isOverLength
    ? `기기 이름은 최대 ${DEVICE_NAME_MAX_LENGTH}글자까지만 가능합니다`
    : undefined;

  const handleSubmit = () => {
    const trimmedName = nickname.trim();
    if (!trimmedName || isOverLength || isPending) return;
    onSubmit(trimmedName);
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
          errorMessage={lengthErrorMessage}
          inputClassName="h-[2.4375rem] bg-neutral-700 py-xs px-base rounded-lg"
        />
        {errorMessage && (
          <p
            role="alert"
            className="whitespace-pre-line caption-xs-semibold text-state-alert"
          >
            {errorMessage}
          </p>
        )}
        <ConfirmButtons
          onConfirm={handleSubmit}
          onCancel={onClose}
          confirmText={isPending ? '등록 중...' : '등록'}
          cancelText="취소"
          confirmDisabled={isOverLength || isEmpty || isPending}
        />
      </div>
    </div>
  );
};

export default DeviceRegisterModal;
