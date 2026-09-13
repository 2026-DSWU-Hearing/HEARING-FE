import type {
  BubbleDirectionTypes,
  BubbleInputTypes,
} from '@/pages/communication/types/communicationTypes';

export interface ConversationBubbleRequestTypes {
  direction: BubbleDirectionTypes;
  inputType: BubbleInputTypes;
  content: string;
}
export interface ConversationBubbleResponseTypes extends ConversationBubbleRequestTypes {
  bubble_id: number;
  created_at: string;
}
export interface ConversationCreatedTypes {
  conversation_id: number;
  created_at: string;
}
// 제목/요약은 대화 종료 시 서버가 AI로 생성한다. 종료 전에는 아직 없다.
export interface ConversationListItemTypes extends ConversationCreatedTypes {
  title?: string | null;
  summary?: string | null;
}
export interface ConversationDetailTypes extends ConversationListItemTypes {
  bubbles: ConversationBubbleResponseTypes[];
}
export interface ConversationListTypes {
  conversations: ConversationListItemTypes[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
}
// 버블은 대화 중에 하나씩 보내지 않고 종료할 때 통째로 올린다.
// 중간 저장은 네트워크가 끊기면 어차피 유실되고, 기록은 localStorage가 이미 들고 있다.
export interface ConversationEndRequestTypes {
  bubbles: ConversationBubbleRequestTypes[];
}
// 종료 응답으로 서버가 생성한 제목/요약이 함께 내려온다.
export interface ConversationEndTypes {
  conversation_id: number;
  title: string;
  summary: string;
}
export interface ConversationLocationTypes {
  latitude: number | null;
  longitude: number | null;
}
