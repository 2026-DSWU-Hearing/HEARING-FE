import { useState } from 'react';
import type { KeyboardEvent } from 'react';

import { FAVORITE_ANSWER_MESSAGE } from '@/pages/communication/constants/favoriteAnswerMessages';
import CloseIcon from '@/shared/components/icons/CloseIcon';
import PencilIcon from '@/shared/components/icons/PencilIcon';
import { useAutoGrowTextarea } from '@/shared/hooks/useAutoGrowTextarea';

interface FavoriteAnswerEditItemPropTypes {
  content: string;
  onChange: (content: string) => void;
  onDelete: () => void;
}

const FavoriteAnswerEditItem = ({
  content,
  onChange,
  onDelete,
}: FavoriteAnswerEditItemPropTypes) => {
  const { textareaRef, measureRef } = useAutoGrowTextarea(content, '');
  const [isContentEditable, setIsContentEditable] = useState(false);

  const handlePencilClick = () => {
    setIsContentEditable(true);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;

    event.preventDefault();
    event.currentTarget.blur();
  };

  return (
    <div className="relative flex h-[2.9375rem] w-full shrink-0 items-center gap-xs overflow-hidden rounded-lg bg-neutral-700 px-sm py-xs">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => setIsContentEditable(false)}
        readOnly={!isContentEditable}
        aria-label={FAVORITE_ANSWER_MESSAGE.EDIT}
        rows={1}
        className="body-lg-regular max-w-full resize-none overflow-hidden bg-transparent p-0 text-primary outline-none"
      />

      <button
        type="button"
        onClick={handlePencilClick}
        aria-label={FAVORITE_ANSWER_MESSAGE.EDIT}
        className="shrink-0"
      >
        <PencilIcon className="h-[1.03306rem] w-[1.03306rem] text-primary-400" />
      </button>

      <button
        type="button"
        onClick={onDelete}
        aria-label={FAVORITE_ANSWER_MESSAGE.DELETE}
        className="ml-auto shrink-0"
      >
        <CloseIcon className="h-icon-md w-icon-md text-neutral-400" />
      </button>

      <span
        ref={measureRef}
        aria-hidden="true"
        className="body-lg-regular invisible absolute left-0 top-0 -z-10 whitespace-pre"
      />
    </div>
  );
};

export default FavoriteAnswerEditItem;
