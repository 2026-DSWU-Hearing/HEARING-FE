import type { KeyboardEvent } from 'react';

import { useAutoGrowTextarea } from '@/shared/hooks/useAutoGrowTextarea';

import { FAVORITE_ANSWER_MESSAGE } from '@/pages/communication/constants/favoriteAnswerMessages';

interface FavoriteAnswerAddInputPropTypes {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const FavoriteAnswerAddInput = ({
  value,
  onChange,
  onSubmit,
}: FavoriteAnswerAddInputPropTypes) => {
  const { textareaRef, measureRef } = useAutoGrowTextarea(
    value,
    FAVORITE_ANSWER_MESSAGE.ADD_PLACEHOLDER,
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;

    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="relative flex min-h-[2.7125rem] w-full shrink-0 items-center rounded-lg border border-neutral-600 bg-state-active/20 px-sm py-xs">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={onSubmit}
        placeholder={FAVORITE_ANSWER_MESSAGE.ADD_PLACEHOLDER}
        aria-label={FAVORITE_ANSWER_MESSAGE.ADD}
        autoFocus
        className="body-lg-regular min-w-0 flex-1 resize-none overflow-hidden [overflow-wrap:anywhere] bg-transparent p-0 text-primary outline-none placeholder:text-neutral-500"
      />
      <span
        ref={measureRef}
        aria-hidden="true"
        className="body-lg-regular invisible absolute left-0 top-0 -z-10 whitespace-pre"
      />
    </div>
  );
};

export default FavoriteAnswerAddInput;
