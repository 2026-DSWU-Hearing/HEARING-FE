import { motion } from 'motion/react';

import FavoriteAnswerAddButton from '@/pages/communication/components/favoriteAnswer/FavoriteAnswerAddButton';
import FavoriteAnswerAddInput from '@/pages/communication/components/favoriteAnswer/FavoriteAnswerAddInput';
import { FAVORITE_ANSWER_MESSAGE } from '@/pages/communication/constants/favoriteAnswerMessages';
import { useFavoriteAnswerModal } from '@/pages/communication/hooks/useFavoriteAnswerModal';
import type { FavoriteAnswerTypes } from '@/pages/communication/types/communication-Types';
import { useEscapeKey } from '@/shared/hooks/useEscapeKey';

interface FavoriteAnswerModalPropTypes {
  answers: FavoriteAnswerTypes[];
  onClose: () => void;
  onSelect: (content: string) => void;
}

const FavoriteAnswerModal = ({
  answers,
  onClose,
  onSelect,
}: FavoriteAnswerModalPropTypes) => {
  const {
    isAdding,
    draft,
    handleDraftChange,
    handleStartAdding,
    handleCancelAdding,
    handleSubmitAdding,
  } = useFavoriteAnswerModal();

  const handleEscape = () => {
    if (isAdding) {
      handleCancelAdding();
      return;
    }

    onClose();
  };

  useEscapeKey(true, handleEscape);

  const handleAnswerClick = (content: string) => {
    onSelect(content);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={FAVORITE_ANSWER_MESSAGE.TITLE}
        className="fixed inset-x-0 bottom-0 z-10 mx-auto flex h-[37.25rem] w-full max-w-[430px] flex-col items-center gap-[0.625rem] rounded-t-2xl bg-neutral-800 px-lg pb-[7.4375rem] pt-xl"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
      >
        <div className="grid w-full shrink-0 grid-cols-[4rem_1fr_4rem] items-center pb-base">
          <button
            type="button"
            onClick={onClose}
            className="body-base-regular justify-self-start text-neutral-400"
          >
            {FAVORITE_ANSWER_MESSAGE.CANCEL}
          </button>

          <h2 className="heading-base-semibold justify-self-center text-primary">
            {FAVORITE_ANSWER_MESSAGE.TITLE}
          </h2>

          <span className="justify-self-end" />
        </div>

        <div className="hide-scrollbar flex w-full flex-1 flex-col gap-sm overflow-y-auto">
          {answers.length === 0 && !isAdding ? (
            <p className="body-sm-regular mt-lg text-center text-neutral-500">
              {FAVORITE_ANSWER_MESSAGE.EMPTY}
            </p>
          ) : (
            answers.map((answer) => (
              <button
                key={answer.id}
                type="button"
                onClick={() => handleAnswerClick(answer.content)}
                className="body-lg-regular flex h-[2.9375rem] w-full shrink-0 items-center rounded-lg bg-neutral-700 px-sm py-xs text-left text-primary transition-colors active:bg-neutral-600"
              >
                {answer.content}
              </button>
            ))
          )}

          {isAdding ? (
            <FavoriteAnswerAddInput
              value={draft}
              onChange={handleDraftChange}
              onSubmit={handleSubmitAdding}
            />
          ) : (
            <FavoriteAnswerAddButton onClick={handleStartAdding} />
          )}
        </div>
      </motion.div>
    </>
  );
};

export default FavoriteAnswerModal;
