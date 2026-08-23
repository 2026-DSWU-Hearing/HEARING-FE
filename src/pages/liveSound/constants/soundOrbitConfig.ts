// 감지된 소리 아이콘이 도는 궤도 설정. 배열 인덱스 = 궤도 슬롯 번호(0이 가장 안쪽).
//
// rate를 반지름에 연속 매핑하지 않고 "슬롯 기반 이산 3단"으로 고정한 이유:
// 서버가 매 초 스냅샷을 통째로 교체하는데 confidence는 초마다 흔들려서,
// 연속 매핑하면 궤도와 크기가 매 초 요동친다. 슬롯은 훨씬 안정적이다.
//
// 크기는 기존 링(LiveSoundAnimation)과 동일하게 min(maxRem, ratio) 형식으로 반응형 처리한다.
// ratio는 컨테이너 너비 기준이며, 기존 링(배경원 48% / 중간 71.4% / 바깥 96%)
// "사이의 빈 틈"에 아이콘을 놓아 링 글로우와 겹쳐 안 보이는 일이 없게 했다.
// 가장 바깥 궤도(93%)는 아이콘 반지름만큼만 컨테이너를 넘는데, 부모가 좌우 여백을 갖고
// 잘라내지도 않아 온전히 보인다.
export const SOUND_ORBIT_CONFIG_LIST = [
  {
    // 0번 슬롯: 가장 안쪽 + 가장 큼 + 가장 밝음. (중앙 귀 아이콘은 24.6%라 겹치지 않는다.)
    orbitSize: 'min(13.4rem, 60%)',
    iconSize: 'min(3.75rem, 16.8%)',
    startAngle: 0,
    orbitDuration: '30s',
    bobDuration: '3.2s',
    isReverse: false,
    colorClassName: 'text-primary-50',
    glowFilter: 'drop-shadow(0 0 12px rgba(255, 226, 110, 0.85))',
  },
  {
    // 1번 슬롯: 중간 궤도. 이웃 궤도와 반대로 돌려 두 아이콘이 오래 붙어 있지 않게 한다.
    orbitSize: 'min(18.7rem, 83.7%)',
    iconSize: 'min(3.25rem, 14.5%)',
    startAngle: 140,
    orbitDuration: '35s',
    bobDuration: '4.1s',
    isReverse: true,
    colorClassName: 'text-primary-300',
    glowFilter: 'drop-shadow(0 0 9px rgba(255, 226, 110, 0.6))',
  },
  {
    // 2번 슬롯: 가장 바깥 + 가장 작고 어둡다.
    orbitSize: 'min(21rem, 93%)',
    iconSize: 'min(2.75rem, 12.2%)',
    startAngle: 250,
    orbitDuration: '40s',
    bobDuration: '4.8s',
    isReverse: false,
    colorClassName: 'text-primary-500',
    glowFilter: 'drop-shadow(0 0 7px rgba(242, 178, 4, 0.45))',
  },
] as const;

// 궤도에 동시에 띄울 최대 아이콘 수. 서버도 매 초 최대 3개를 보내므로 사실상 전부 표시된다.
export const MAX_ORBIT_ICON_COUNT = SOUND_ORBIT_CONFIG_LIST.length;

// 아이콘이 궤도에 나타날 때의 페이드인 시간(초).
export const ORBIT_ICON_ENTER_DURATION_SECOND = 0.45;

// 아이콘이 궤도에서 사라질 때의 페이드아웃 시간(초).
// 진입보다 훨씬 길게 잡은 것이 깜빡임 방지 장치다. 서버가 매 초 목록을 통째로
// 교체하다 보니 같은 소리가 한 스냅샷만 빠졌다 곧바로 돌아오는 일이 잦은데,
// 천천히 사라지는 동안 다시 등장하면 퇴장이 취소돼 원래 밝기로 되돌아간다.
export const ORBIT_ICON_EXIT_DURATION_SECOND = 2.5;
