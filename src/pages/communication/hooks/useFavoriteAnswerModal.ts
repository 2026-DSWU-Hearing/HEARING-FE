import { useEffect, useState } from 'react';

import {
  getNextAnswerId,
  useFavoriteAnswerStore,
} from '@/pages/communication/stores/useFavoriteAnswerStore';
import type { FavoriteAnswerTypes } from '@/pages/communication/types/communication-Types';

// 자주 쓰는 답변 모달의 상태/핸들러.
// 답변 목록은 prop으로 받지 않고 스토어를 직접 구독한다.
// prop + useState 초깃값으로 받으면 첫 렌더 시점의 값에 고정되어, 목록이 나중에
// 채워지는 경우(목데이터/API 로딩이 끝나기 전에 모달을 연 경우) 계속 빈 목록으로 남는다.
export const useFavoriteAnswerModal = () => {
  const answers = useFavoriteAnswerStore((state) => state.answers);
  const setAnswers = useFavoriteAnswerStore((state) => state.setAnswers);

  const [draftAnswers, setDraftAnswers] = useState<FavoriteAnswerTypes[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState('');

  // 스토어가 갱신되면 편집본에 반영한다.
  // 편집 중에는 덮어쓰지 않는다 - 사용자가 고치던 내용이 날아간다.
  useEffect(() => {
    if (isEditing) return;

    setDraftAnswers(answers);
  }, [answers, isEditing]);

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
      const addedAnswers = [
        ...draftAnswers,
        { id: getNextAnswerId(draftAnswers), content: trimmedDraft },
      ];

      setDraftAnswers(addedAnswers);

      if (!isEditing) {
        setAnswers(addedAnswers);
      }
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
