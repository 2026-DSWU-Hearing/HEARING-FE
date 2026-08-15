import { useState } from 'react';

import {
  getNextAnswerId,
  useFavoriteAnswerStore,
} from '@/pages/communication/stores/useFavoriteAnswerStore';
import type { FavoriteAnswerTypes } from '@/pages/communication/types/communication-Types';

export const useFavoriteAnswerModal = (answers: FavoriteAnswerTypes[]) => {
  const setAnswers = useFavoriteAnswerStore((state) => state.setAnswers);

  const [draftAnswers, setDraftAnswers] =
    useState<FavoriteAnswerTypes[]>(answers);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const isDirty =
    draftAnswers.length !== answers.length ||
    draftAnswers.some(
      (draftAnswer, index) =>
        draftAnswer.id !== answers[index].id ||
        draftAnswer.content !== answers[index].content,
    );

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
      setDraftAnswers((prev) => [
        ...prev,
        { id: getNextAnswerId(prev), content: trimmedDraft },
      ]);
    }

    setDraft('');
    setIsAdding(false);
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setDraftAnswers(answers);
    setIsEditing(false);
  };

  const handleComplete = () => {
    const trimmedDraft = draft.trim();
    const pendingAnswers = trimmedDraft
      ? [
          ...draftAnswers,
          { id: getNextAnswerId(draftAnswers), content: trimmedDraft },
        ]
      : draftAnswers;

    const completedAnswers = pendingAnswers
      .map((pendingAnswer) => ({
        ...pendingAnswer,
        content: pendingAnswer.content.trim(),
      }))
      .filter((pendingAnswer) => pendingAnswer.content.length > 0);

    setAnswers(completedAnswers);
    setDraftAnswers(completedAnswers);
    setDraft('');
    setIsAdding(false);
    setIsEditing(false);
  };

  const handleAnswerChange = (id: number, content: string) => {
    setDraftAnswers((prev) =>
      prev.map((draftAnswer) =>
        draftAnswer.id === id ? { ...draftAnswer, content } : draftAnswer,
      ),
    );
  };

  const handleDeleteAnswer = (id: number) => {
    setDraftAnswers((prev) =>
      prev.filter((draftAnswer) => draftAnswer.id !== id),
    );
  };

  return {
    draftAnswers,
    isAdding,
    draft,
    isDraftTyping: draft.trim().length > 0,
    isEditing,
    isDirty,
    handleDraftChange: setDraft,
    handleStartAdding,
    handleCancelAdding,
    handleSubmitAdding,
    handleStartEditing,
    handleCancelEditing,
    handleComplete,
    handleAnswerChange,
    handleDeleteAnswer,
  };
};
