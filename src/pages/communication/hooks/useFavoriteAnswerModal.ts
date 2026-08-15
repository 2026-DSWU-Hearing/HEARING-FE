import { useState } from 'react';

import { useFavoriteAnswerStore } from '@/pages/communication/stores/useFavoriteAnswerStore';

export const useFavoriteAnswerModal = () => {
  const addAnswer = useFavoriteAnswerStore((state) => state.addAnswer);

  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const handleStartAdding = () => {
    setDraft('');
    setIsAdding(true);
  };

  const handleCancelAdding = () => {
    setDraft('');
    setIsAdding(false);
  };

  const handleSubmitAdding = () => {
    const trimmedDraft = draft.trim();

    if (trimmedDraft) {
      addAnswer(trimmedDraft);
    }

    setDraft('');
    setIsAdding(false);
  };

  return {
    isAdding,
    draft,
    handleDraftChange: setDraft,
    handleStartAdding,
    handleCancelAdding,
    handleSubmitAdding,
  };
};
