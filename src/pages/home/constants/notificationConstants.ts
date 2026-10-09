// 일반 useQuery 데이터와 구조가 다른 InfiniteData 전용 키.
// 개발 중 HMR로 이전 캐시가 남더라도 { pages, pageParams } 형태가 충돌하지 않게 분리한다.
export const NOTIFICATION_QUERY_KEY = ['notifications', 'infinite'] as const;
export const NOTIFICATION_PAGE_SIZE = 20;
export const NOTIFICATION_DELETE_CHUNK_SIZE = 100;
export const NOTIFICATION_TIME_REFRESH_INTERVAL = 60_000;
