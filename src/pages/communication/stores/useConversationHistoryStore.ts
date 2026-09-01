import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ConversationHistoryDetailTypes } from '@/pages/communication/types/communication-Types';

interface ConversationHistoryState {
  histories: ConversationHistoryDetailTypes[];
  isInitialized: boolean;
  initialize: (histories: ConversationHistoryDetailTypes[]) => void;
  addHistory: (history: ConversationHistoryDetailTypes) => void;
  deleteHistory: (id: number) => void;
  reset: () => void;
}

// 브라우저 localStorage에 저장할 때 쓰는 키. 값을 바꾸면 기존 기록은 보이지 않는다.
const STORAGE_KEY = 'hearing-conversation-histories';

// 저장되는 대화의 id. 목데이터 id(1, 2, 3...)와 절대 겹치지 않도록 타임스탬프를 쓴다.
// 같은 밀리초에 두 개를 저장할 일은 없다(대화 종료 버튼을 눌러야 생긴다).
export const createConversationHistoryId = () => Date.now();

// 대화 기록 스토어.
// 백엔드가 없어서 종료한 대화를 localStorage에 쌓아두고 기록 화면에서 그대로 읽는다.
// 저장 API가 생기면 addHistory를 호출하는 자리에서 API를 함께 부르고,
// initialize를 목데이터 대신 서버 응답으로 채우면 된다.
export const useConversationHistoryStore = create<ConversationHistoryState>()(
  persist(
    (set) => ({
      histories: [],
      isInitialized: false,

      // 목데이터 예시 기록을 앱 최초 실행 때 한 번만 뒤에 덧붙인다.
      // 덮어쓰지 않는 이유: 기록 화면에 들어가기 전에 저장한 대화가 이미 있을 수 있다.
      initialize: (histories) =>
        set((state) =>
          state.isInitialized
            ? state
            : {
                histories: [...state.histories, ...histories],
                isInitialized: true,
              },
        ),

      // 최신 대화가 위로 오도록 앞에 붙인다.
      addHistory: (history) =>
        set((state) => ({ histories: [history, ...state.histories] })),

      deleteHistory: (id) =>
        set((state) => ({
          histories: state.histories.filter((history) => history.id !== id),
        })),

      // 로그아웃 시 호출한다. 대화 내용은 개인정보라 다음 사용자에게 남으면 안 된다.
      // isInitialized까지 되돌려야 다음 사용자 로그인 때 initialize가 다시 동작한다.
      // persist가 set을 그대로 저장소에 반영하므로 localStorage에 남아 있던 값도 함께 비워진다.
      reset: () => set({ histories: [], isInitialized: false }),
    }),
    { name: STORAGE_KEY, version: 1 },
  ),
);
