export interface QuickReplyTypes {
  reply_id: number;
  content: string;
}

export interface QuickReplyListTypes {
  quick_replies: QuickReplyTypes[];
}

export interface QuickReplyCreatedTypes extends QuickReplyTypes {
  created_at: string;
}
