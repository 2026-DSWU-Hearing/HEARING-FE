import { useCallback, useReducer } from 'react';

interface ModeSoundStateTypes {
  isEditMode: boolean;
  isAddSoundModalOpen: boolean;
  selectedRemoveSoundIds: number[];
}

type ModeSoundActionTypes =
  | { type: 'TOGGLE_EDIT_MODE' }
  | { type: 'CLOSE_EDIT_MODE' }
  | { type: 'OPEN_ADD_SOUND_MODAL' }
  | { type: 'CLOSE_ADD_SOUND_MODAL' }
  | { type: 'TOGGLE_REMOVE_SOUND'; soundId: number }
  | { type: 'RESET_REMOVE_SOUNDS' };

const INITIAL_MODE_SOUND_STATE: ModeSoundStateTypes = {
  isEditMode: false,
  isAddSoundModalOpen: false,
  selectedRemoveSoundIds: [],
};

const toggleNumberInList = (numbers: number[], targetNumber: number) => {
  if (numbers.includes(targetNumber)) {
    return numbers.filter((number) => number !== targetNumber);
  }

  return [...numbers, targetNumber];
};

const modeSoundReducer = (
  state: ModeSoundStateTypes,
  action: ModeSoundActionTypes,
): ModeSoundStateTypes => {
  // 편집 모드, 모달, 선택 초기화처럼 서로 연결된 UI 상태를 한곳에서 관리한다.
  switch (action.type) {
    case 'TOGGLE_EDIT_MODE':
      return {
        ...state,
        isEditMode: !state.isEditMode,
        selectedRemoveSoundIds: [],
      };
    case 'CLOSE_EDIT_MODE':
      return {
        ...state,
        isEditMode: false,
        selectedRemoveSoundIds: [],
      };
    case 'OPEN_ADD_SOUND_MODAL':
      return {
        ...state,
        isAddSoundModalOpen: true,
      };
    case 'CLOSE_ADD_SOUND_MODAL':
      return {
        ...state,
        isAddSoundModalOpen: false,
      };
    case 'TOGGLE_REMOVE_SOUND':
      return {
        ...state,
        selectedRemoveSoundIds: toggleNumberInList(
          state.selectedRemoveSoundIds,
          action.soundId,
        ),
      };
    case 'RESET_REMOVE_SOUNDS':
      return {
        ...state,
        selectedRemoveSoundIds: [],
      };
    default:
      return state;
  }
};

// 편집 모드, 모달 열림 상태, 삭제 선택 목록 같은 UI 상태를 관리하는 훅
export const useModeSoundState = () => {
  const [state, dispatch] = useReducer(
    modeSoundReducer,
    INITIAL_MODE_SOUND_STATE,
  );

  const toggleEditMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_EDIT_MODE' });
  }, []);

  const closeEditMode = useCallback(() => {
    dispatch({ type: 'CLOSE_EDIT_MODE' });
  }, []);

  const openAddSoundModal = useCallback(() => {
    dispatch({ type: 'OPEN_ADD_SOUND_MODAL' });
  }, []);

  const closeAddSoundModal = useCallback(() => {
    dispatch({ type: 'CLOSE_ADD_SOUND_MODAL' });
  }, []);

  const toggleRemoveSound = useCallback((soundId: number) => {
    dispatch({ type: 'TOGGLE_REMOVE_SOUND', soundId });
  }, []);

  const resetRemoveSounds = useCallback(() => {
    dispatch({ type: 'RESET_REMOVE_SOUNDS' });
  }, []);

  return {
    state,
    toggleEditMode,
    closeEditMode,
    openAddSoundModal,
    closeAddSoundModal,
    toggleRemoveSound,
    resetRemoveSounds,
  };
};
