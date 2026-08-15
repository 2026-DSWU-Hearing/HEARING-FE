import type { KeyboardEvent } from 'react';

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
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;

    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="flex h-[2.7125rem] w-full shrink-0 items-center rounded-lg border border-neutral-600 bg-state-active/20 px-sm py-xs">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={onSubmit}
        placeholder={FAVORITE_ANSWER_MESSAGE.ADD_PLACEHOLDER}
        aria-label={FAVORITE_ANSWER_MESSAGE.ADD}
        autoFocus
        className="body-lg-regular w-full bg-transparent text-primary outline-none placeholder:text-neutral-500"
      />
    </div>
  );
};

export default FavoriteAnswerAddInput;
