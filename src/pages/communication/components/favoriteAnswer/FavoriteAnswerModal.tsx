import { motion } from 'motion/react';

import { FAVORITE_ANSWER_MESSAGE } from '@/pages/communication/constants/favoriteAnswerMessages';
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
  useEscapeKey(true, onClose);

  const handleAnswerClick = (content: string) => {
    onSelect(content);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-[5.1875rem] top-0 z-30"
        onClick={onClose}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={FAVORITE_ANSWER_MESSAGE.TITLE}
        className="fixed inset-x-0 bottom-[5.1875rem] z-40 mx-auto flex h-[60dvh] w-full max-w-[430px] flex-col rounded-t-[20px] bg-[#252623] p-base"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
      >
        <div className="grid shrink-0 grid-cols-[4rem_1fr_4rem] items-center pb-base">
          <button
            type="button"
            onClick={onClose}
            className="body-base-regular justify-self-start text-neutral-300"
          >
            {FAVORITE_ANSWER_MESSAGE.CANCEL}
          </button>

          <h2 className="heading-base-semibold justify-self-center text-white">
            {FAVORITE_ANSWER_MESSAGE.TITLE}
          </h2>

          <span className="justify-self-end" />
        </div>

        <div className="hide-scrollbar flex flex-1 flex-col gap-sm overflow-y-auto">
          {answers.length === 0 ? (
            <p className="body-sm-regular mt-lg text-center text-tertiary">
              {FAVORITE_ANSWER_MESSAGE.EMPTY}
            </p>
          ) : (
            answers.map((answer) => (
              <button
                key={answer.id}
                type="button"
                onClick={() => handleAnswerClick(answer.content)}
                className="body-base-regular w-full shrink-0 rounded-lg bg-neutral-800 px-base py-sm text-left text-neutral-100 transition-colors active:bg-neutral-700"
              >
                {answer.content}
              </button>
            ))
          )}
        </div>
      </motion.div>
    </>
  );
};

export default FavoriteAnswerModal;
