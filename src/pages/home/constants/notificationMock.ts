import type { NotificationItemTypes } from '@/pages/home/types/notificationTypes';

// 알림 페이지 UI 확인용 mock 데이터.
// TODO(api): GET 알림 목록 API 연동 시 이 상수 대신 서버 응답으로 교체한다.
//            (빈 목록 화면 동작을 보려면 이 배열을 [] 로 바꿔 확인할 수 있다.)
export const NOTIFICATION_MOCK: NotificationItemTypes[] = [
  {
    id: 1,
    soundName: '아기 옹알이',
    category: '생활음',
    relativeTime: '1일 전',
    absoluteTime: '26.04.09 13:01',
  },
  {
    id: 2,
    soundName: '아기 옹알이',
    category: '생활음',
    relativeTime: '1일 전',
    absoluteTime: '26.04.09 13:01',
  },
  {
    id: 3,
    soundName: '화재 경보',
    category: '긴급',
    relativeTime: '1일 전',
    absoluteTime: '26.04.09 13:01',
  },
  {
    id: 4,
    soundName: '화재 경보',
    category: '긴급',
    relativeTime: '1일 전',
    absoluteTime: '26.04.09 13:01',
  },
  {
    id: 5,
    soundName: '아기 옹알이',
    category: '생활음',
    relativeTime: '1일 전',
    absoluteTime: '26.04.09 13:01',
  },
  {
    id: 6,
    soundName: '화재 경보',
    category: '긴급',
    relativeTime: '1일 전',
    absoluteTime: '26.04.09 13:01',
  },
  {
    id: 7,
    soundName: '아기 옹알이',
    category: '생활음',
    relativeTime: '1일 전',
    absoluteTime: '26.04.09 13:01',
  },
];
