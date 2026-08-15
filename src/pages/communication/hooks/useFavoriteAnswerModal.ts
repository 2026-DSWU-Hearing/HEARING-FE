import { useState } from 'react';

import { useFavoriteAnswerStore } from '@/pages/communication/stores/useFavoriteAnswerStore';
import type { FavoriteAnswerTypes } from '@/pages/communication/types/communication-Types';

export const useFavoriteAnswerModal = (answers: FavoriteAnswerTypes[]) => {
  const addAnswer = useFavoriteAnswerStore((state) => state.addAnswer);
  const setAnswers = useFavoriteAnswerStore((state) => state.setAnswers);

  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingAnswers, setEditingAnswers] = useState<FavoriteAnswerTypes[]>(
    [],
  );

  const isDirty =
    editingAnswers.length !== answers.length ||
    editingAnswers.some(
      (editingAnswer, index) =>
        editingAnswer.id !== answers[index].id ||
        editingAnswer.content !== answers[index].content,
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
      addAnswer(trimmedDraft);
    }

    setDraft('');
    setIsAdding(false);
  };

  const handleStartEditing = () => {
    setEditingAnswers(answers);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setEditingAnswers([]);
    setIsEditing(false);
  };

  const handleCompleteEditing = () => {
    setAnswers(
      editingAnswers
        .map((editingAnswer) => ({
          ...editingAnswer,
          content: editingAnswer.content.trim(),
        }))
        .filter((editingAnswer) => editingAnswer.content.length > 0),
    );
    setEditingAnswers([]);
    setIsEditing(false);
  };

  const handleEditingAnswerChange = (id: number, content: string) => {
    setEditingAnswers((prev) =>
      prev.map((editingAnswer) =>
        editingAnswer.id === id ? { ...editingAnswer, content } : editingAnswer,
      ),
    );
  };

  const handleDeleteEditingAnswer = (id: number) => {
    setEditingAnswers((prev) =>
      prev.filter((editingAnswer) => editingAnswer.id !== id),
    );
  };

  return {
    isAdding,
    draft,
    isEditing,
    editingAnswers,
    isDirty,
    handleDraftChange: setDraft,
    handleStartAdding,
    handleCancelAdding,
    handleSubmitAdding,
    handleStartEditing,
    handleCancelEditing,
    handleCompleteEditing,
    handleEditingAnswerChange,
    handleDeleteEditingAnswer,
  };
};
