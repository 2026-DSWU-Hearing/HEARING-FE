import { useConversationHistoryStore } from '@/pages/communication/stores/useConversationHistoryStore';
import { useFavoriteAnswerStore } from '@/pages/communication/stores/useFavoriteAnswerStore';

// 로그아웃 시 사용자에 종속된 전역 스토어를 한 번에 비운다.
//
// zustand 스토어는 모듈 스코프에 살아 있어서 로그아웃해도 메모리에 그대로 남는다.
// 쿼리 캐시(queryClient.clear())만 비우면 스토어는 남아, 다음 사용자가 로그인했을 때
// isInitialized가 true인 채라 initialize가 무시되고 이전 사용자의 데이터가 그대로 보인다.
//
// 사용자별 스토어를 새로 만들면 여기에 추가한다. 호출부(useLogout)는 손대지 않아도 된다.
export const resetAllStores = () => {
  useFavoriteAnswerStore.getState().reset();
  useConversationHistoryStore.getState().reset();
};
