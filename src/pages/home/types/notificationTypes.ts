// 알림 페이지에서 사용하는 알림 한 건의 타입.
// 현재는 UI 전용 mock 이라 표시용 문자열(relativeTime/absoluteTime)을 그대로 들고 있다.
// TODO(api): 실제 알림 목록 API 연동 시 서버는 detected_at(datetime) 등을 내려줄 가능성이 높다.
//            그 경우 datetime 원본을 받아 포맷 함수로 relativeTime/absoluteTime 을 계산하도록 바꾼다.
export interface NotificationItemTypes {
  id: number;
  // 소리명(아이콘 매핑 키로도 사용). 예: '아기 옹알이', '화재 경보'
  soundName: string;
  // 카테고리명(배지 색 매핑 키). 예: '생활음', '긴급'
  category: string;
  // 우측 상단 상대 시간 표시. 예: '1일 전'
  relativeTime: string;
  // 우측 하단 절대 시간 표시. 예: '26.04.09 13:01'
  absoluteTime: string;
}
