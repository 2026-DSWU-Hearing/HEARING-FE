export type BubbleDirectionTypes = 'left' | 'right';

export type BubbleInputTypes = 'text' | 'stt' | 'favorite_answer';

export interface ChatBubbleTypes {
  id: number;
  direction: BubbleDirectionTypes;
  inputType: BubbleInputTypes;
  content: string;
}

export interface ConversationTypes {
  id: number;
  title: string;
  locationName: string;
  startedAt: string;
  endedAt?: string;
  bubbles: ChatBubbleTypes[];
}

export interface ConversationHistoryTypes {
  id: number;
  title: string;
  locationName: string;
  startedAt: string;
  endedAt?: string;
}

export interface ConversationHistoryDetailTypes {
  id: number;
  title: string;
  locationName: string;
  startedAt: string;
  endedAt?: string;
  bubbles: ChatBubbleTypes[];
}

export interface FavoriteAnswerTypes {
  id: number;
  content: string;
}
