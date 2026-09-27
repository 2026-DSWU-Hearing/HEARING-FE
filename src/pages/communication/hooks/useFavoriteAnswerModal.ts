import { useRef, useState } from 'react';

import { FAVORITE_ANSWER_MESSAGE } from '@/pages/communication/constants/favoriteAnswerMessages';
import { useGetQuickReplies } from '@/pages/communication/hooks/useGetQuickReplies';
import { usePostQuickReply } from '@/pages/communication/hooks/usePostQuickReply';
import { useSaveQuickReplies } from '@/pages/communication/hooks/useSaveQuickReplies';
import type { FavoriteAnswerTypes } from '@/pages/communication/types/communication-Types';

const EMPTY_ANSWERS: FavoriteAnswerTypes[] = [];

const normalizeAnswers = (answers: FavoriteAnswerTypes[]) =>
  answers
    .map((answer) => ({ ...answer, content: answer.content.trim() }))
    .filter((answer) => answer.content.length > 0);

// 자주 쓰는 답변 모달의 상태/핸들러.
export const useFavoriteAnswerModal = () => {
  const { data: answers = EMPTY_ANSWERS, isError: isLoadError } =
    useGetQuickReplies();
  const { mutate: postQuickReply, isPending: isPosting } = usePostQuickReply();
  const { mutate: saveQuickReplies, isPending: isSavingAnswers } =
    useSaveQuickReplies();

  const [draftAnswers, setDraftAnswers] = useState<FavoriteAnswerTypes[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const tempIdRef = useRef(0);

  const createTempAnswer = (content: string): FavoriteAnswerTypes => {
    tempIdRef.current -= 1;

    return { id: tempIdRef.current, content };
  };

  const visibleAnswers = isEditing ? draftAnswers : answers;
  const isSaving = isPosting || isSavingAnswers;

  const isDirty =
    isEditing &&
    (draftAnswers.length !== answers.length ||
      draftAnswers.some(
        (draftAnswer, index) =>
          draftAnswer.id !== answers[index].id ||
          draftAnswer.content !== answers[index].content,
      ));

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

    if (trimmedDraft && isEditing) {
      setDraftAnswers((prev) => [...prev, createTempAnswer(trimmedDraft)]);
    }

    if (trimmedDraft && !isEditing) {
      postQuickReply(trimmedDraft, {
        onError: () => setErrorMessage(FAVORITE_ANSWER_MESSAGE.SAVE_FAILED),
      });
    }

    setDraft('');
    setIsAdding(false);
  };

  const handleStartEditing = () => {
    setDraftAnswers(answers);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setDraftAnswers([]);
    setIsEditing(false);
  };

  const handleComplete = () => {
    if (isSaving) return;

    const trimmedDraft = draft.trim();
    const baseAnswers = isEditing ? draftAnswers : answers;
    const nextAnswers = normalizeAnswers(
      trimmedDraft
        ? [...baseAnswers, createTempAnswer(trimmedDraft)]
        : baseAnswers,
    );

    saveQuickReplies(
      { previousAnswers: answers, nextAnswers },
      {
        onSuccess: () => {
          setDraftAnswers([]);
          setDraft('');
          setIsAdding(false);
          setIsEditing(false);
        },
        onError: () => setErrorMessage(FAVORITE_ANSWER_MESSAGE.SAVE_FAILED),
      },
    );
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

  const handleCloseError = () => {
    setErrorMessage('');
  };

  return {
    draftAnswers: visibleAnswers,
    isAdding,
    draft,
    isDraftTyping: draft.trim().length > 0,
    isEditing,
    isDirty,
    isSaving,
    isLoadError,
    errorMessage,
    handleDraftChange: setDraft,
    handleStartAdding,
    handleCancelAdding,
    handleSubmitAdding,
    handleStartEditing,
    handleCancelEditing,
    handleComplete,
    handleAnswerChange,
    handleDeleteAnswer,
    handleCloseError,
  };
};
