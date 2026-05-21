import { useReducer } from 'react';

interface ModeSoundStateTypes {
  isEditMode: boolean;
  isAddSoundModalOpen: boolean;
  selectedRemoveSoundIds: number[];
  disabledSoundIdsByMode: Record<number, number[]>;
}

type ModeSoundActionTypes =
  | { type: 'TOGGLE_EDIT_MODE' }
  | { type: 'CLOSE_EDIT_MODE' }
  | { type: 'OPEN_ADD_SOUND_MODAL' }
  | { type: 'CLOSE_ADD_SOUND_MODAL' }
  | { type: 'TOGGLE_REMOVE_SOUND'; soundId: number }
  | { type: 'RESET_REMOVE_SOUNDS' }
  | { type: 'TOGGLE_DISABLED_SOUND'; modeId: number; soundId: number };

const INITIAL_MODE_SOUND_STATE: ModeSoundStateTypes = {
  isEditMode: false,
  isAddSoundModalOpen: false,
  selectedRemoveSoundIds: [],
  disabledSoundIdsByMode: {},
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
    case 'TOGGLE_DISABLED_SOUND': {
      const disabledSoundIds = state.disabledSoundIdsByMode[action.modeId] ?? [];

      return {
        ...state,
        disabledSoundIdsByMode: {
          ...state.disabledSoundIdsByMode,
          [action.modeId]: toggleNumberInList(disabledSoundIds, action.soundId),
        },
      };
    }
    default:
      return state;
  }
};

export const useModeSoundState = () => {
  const [state, dispatch] = useReducer(
    modeSoundReducer,
    INITIAL_MODE_SOUND_STATE,
  );

  const toggleEditMode = () => {
    dispatch({ type: 'TOGGLE_EDIT_MODE' });
  };

  const closeEditMode = () => {
    dispatch({ type: 'CLOSE_EDIT_MODE' });
  };

  const openAddSoundModal = () => {
    dispatch({ type: 'OPEN_ADD_SOUND_MODAL' });
  };

  const closeAddSoundModal = () => {
    dispatch({ type: 'CLOSE_ADD_SOUND_MODAL' });
  };

  const toggleRemoveSound = (soundId: number) => {
    dispatch({ type: 'TOGGLE_REMOVE_SOUND', soundId });
  };

  const resetRemoveSounds = () => {
    dispatch({ type: 'RESET_REMOVE_SOUNDS' });
  };

  const toggleDisabledSound = (modeId: number, soundId: number) => {
    dispatch({ type: 'TOGGLE_DISABLED_SOUND', modeId, soundId });
  };

  return {
    state,
    toggleEditMode,
    closeEditMode,
    openAddSoundModal,
    closeAddSoundModal,
    toggleRemoveSound,
    resetRemoveSounds,
    toggleDisabledSound,
  };
};
