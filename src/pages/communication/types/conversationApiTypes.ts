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
export interface ConversationListItemTypes extends ConversationCreatedTypes {
  title?: string | null;
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
export interface ConversationEndTypes {
  conversation_id: number;
}
export interface ConversationLocationTypes {
  latitude: number | null;
  longitude: number | null;
}
