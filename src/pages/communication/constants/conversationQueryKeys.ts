export const CONVERSATION_QUERY_KEY = ['conversations'] as const;

export const CONVERSATION_LIST_QUERY_KEY = [
  ...CONVERSATION_QUERY_KEY,
  'infinite',
] as const;

export const CONVERSATION_DETAIL_QUERY_KEY = (conversationId: number) =>
  [...CONVERSATION_QUERY_KEY, 'detail', conversationId] as const;

export const CONVERSATION_PAGE_SIZE = 20;

export const CURRENT_LOCATION_QUERY_KEY = ['currentLocation'] as const;

export const LOCATION_NAME_QUERY_KEY = (latitude: number, longitude: number) =>
  ['locationName', latitude, longitude] as const;
