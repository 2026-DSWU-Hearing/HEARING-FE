import { useState } from 'react';

import { MAX_ORBIT_ICON_COUNT } from '../constants/soundOrbitConfig';
import type {
  OrbitSoundTypes,
  SoundRateTypes,
} from '../types/soundRateTypes';

// 비어 있는 가장 안쪽 궤도 번호를 찾는다. 앞 슬롯이 비면 그 자리부터 다시 채워
// 아이콘이 늘 안쪽부터 순서대로 놓이게 한다.
const findEmptySlotIndex = (usedSlotIndexSet: Set<number>) => {
  for (let slotIndex = 0; slotIndex < MAX_ORBIT_ICON_COUNT; slotIndex += 1) {
    if (!usedSlotIndexSet.has(slotIndex)) {
      return slotIndex;
    }
  }

  return null;
};

// 이전 궤도 배치와 새 스냅샷을 합쳐 다음 배치를 만든다.
// 이미 궤도에 있는 소리는 자기 슬롯을 그대로 지키고, 신규 소리는 rate가 높은 것부터
// 남은 안쪽 궤도를 차지한다.
const mergeOrbitSoundList = (
  previousList: OrbitSoundTypes[],
  soundRateList: SoundRateTypes[],
): OrbitSoundTypes[] => {
  const currentSoundById = new Map(
    soundRateList.map((sound) => [sound.id, sound]),
  );

  // 이번 스냅샷에서 빠진 소리는 목록에서 제거한다. 사라지는 모습은 훅이 붙잡지 않고
  // FloatingSoundIcons의 긴 exit 애니메이션이 대신 처리한다.
  // 남은 소리는 rate만 최신 값으로 갱신해 크기와 밝기가 부드럽게 따라가게 한다.
  const keptList = previousList
    .filter(({ id }) => currentSoundById.has(id))
    .map((orbitSound) => ({
      ...(currentSoundById.get(orbitSound.id) as SoundRateTypes),
      slotIndex: orbitSound.slotIndex,
    }));

  const keptIdSet = new Set(keptList.map(({ id }) => id));
  const usedSlotIndexSet = new Set(keptList.map(({ slotIndex }) => slotIndex));

  const newList = soundRateList
    .filter(({ id }) => !keptIdSet.has(id))
    .sort((first, second) => second.rate - first.rate)
    .reduce<OrbitSoundTypes[]>((assignedList, sound) => {
      const slotIndex = findEmptySlotIndex(usedSlotIndexSet);
      if (slotIndex === null) {
        return assignedList;
      }

      usedSlotIndexSet.add(slotIndex);
      return [...assignedList, { ...sound, slotIndex }];
    }, []);

  return [...keptList, ...newList];
};

// 두 배치가 같은 소리를 같은 궤도에 같은 rate로 담고 있는지 비교한다.
// 스냅샷이 와도 내용이 같으면 이전 배열을 그대로 써서 불필요한 리렌더를 막는다.
const isSameOrbitSoundList = (
  previousList: OrbitSoundTypes[],
  nextList: OrbitSoundTypes[],
) =>
  previousList.length === nextList.length &&
  previousList.every(
    (sound, index) =>
      sound.id === nextList[index].id &&
      sound.rate === nextList[index].rate &&
      sound.slotIndex === nextList[index].slotIndex,
  );

// 서버 스냅샷을 그대로 궤도에 그리면 아이콘이 매 초 궤도를 갈아탄다.
// 한 번 배정된 궤도(slotIndex)를 그 소리가 사라질 때까지 고정한다.
// confidence가 78%↔74%로 흔들려 순위가 뒤집힐 때마다 아이콘이 궤도를 옮기면
// 화면에서 순간이동하는 것처럼 보이기 때문이다. 빈 궤도를 채울 때만 rate 순으로
// 넣으므로 "rate가 높을수록 안쪽"이라는 의도는 그대로 유지된다.
//
// 궤도를 배열 위치가 아니라 slotIndex로 들고 다니는 이유: 퇴장 애니메이션이 도는 동안
// AnimatePresence가 사라진 아이콘을 계속 렌더하는데, 배열 위치로 궤도를 정하면
// 앞 아이콘이 빠질 때 뒤 아이콘의 궤도가 당겨져 순간이동한다.
//
// 스냅샷에서 잠깐 빠졌다 돌아오는 소리의 깜빡임은 여기서 유예 타이머로 붙잡지 않고
// FloatingSoundIcons의 exit 애니메이션에 맡긴다. 사라지는 중에 다시 등장하면
// AnimatePresence가 퇴장을 취소하고 되돌려주기 때문에, 훅이 시간을 다룰 필요가 없다.
export const useOrbitSoundList = (
  soundRateList: SoundRateTypes[],
  isListening: boolean,
): OrbitSoundTypes[] => {
  const [orbitSoundList, setOrbitSoundList] = useState<OrbitSoundTypes[]>([]);
  const [lastSoundRateList, setLastSoundRateList] = useState(soundRateList);
  const [wasListening, setWasListening] = useState(isListening);

  // 입력이 바뀌었을 때 렌더 중에 파생 상태를 갱신한다. React가 이 렌더 결과를 버리고
  // 곧바로 새 값으로 다시 렌더하므로, effect로 도는 것보다 리렌더가 한 번 적고
  // 아이콘이 한 프레임 늦게 반영되는 일도 없다.
  if (soundRateList !== lastSoundRateList || isListening !== wasListening) {
    setLastSoundRateList(soundRateList);
    setWasListening(isListening);

    // 감지를 멈추면 즉시 비운다. 중지는 명시적인 사용자 행동이라
    // 하단 목록(SoundRateBlock)과 동시에 사라지는 편이 자연스럽다.
    const nextList = isListening
      ? mergeOrbitSoundList(orbitSoundList, soundRateList)
      : [];

    if (!isSameOrbitSoundList(orbitSoundList, nextList)) {
      setOrbitSoundList(nextList);
      return nextList;
    }
  }

  return orbitSoundList;
};
