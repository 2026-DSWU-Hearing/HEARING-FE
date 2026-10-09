import { useState } from 'react';

import {
  PRIMARY_SOUND_SWITCH_MARGIN,
  PRIMARY_SOUND_SWITCH_STREAK,
} from '../constants/liveSoundDisplayConfig';
import type { SoundRateTypes } from '../types/soundRateTypes';

// SoundRateTypes.rate는 0~100이고 마진 상수는 0~1(confidence) 기준이라 맞춰준다.
const RATE_SCALE = 100;
const SWITCH_MARGIN_RATE = PRIMARY_SOUND_SWITCH_MARGIN * RATE_SCALE;

const findHighestRateSound = (
  soundRateList: SoundRateTypes[],
): SoundRateTypes | null =>
  soundRateList.reduce<SoundRateTypes | null>(
    (highest, sound) =>
      !highest || sound.rate > highest.rate ? sound : highest,
    null,
  );

interface PrimarySoundStateTypes {
  primarySound: SoundRateTypes | null;
  // 지금 도전 중인 소리와 그 연속 횟수. 도전자가 바뀌면 처음부터 다시 센다.
  challengerId: string | null;
  challengeStreak: number;
}

const INITIAL_STATE: PrimarySoundStateTypes = {
  primarySound: null,
  challengerId: null,
  challengeStreak: 0,
};

// 다음 1순위를 계산한다. 교체 조건은 두 가지를 모두 만족할 때다.
//   1) 현재 1순위보다 SWITCH_MARGIN_RATE 이상 높고
//   2) 그 상태가 PRIMARY_SOUND_SWITCH_STREAK회 연속으로 유지됐을 때
const getNextState = (
  state: PrimarySoundStateTypes,
  soundRateList: SoundRateTypes[],
): PrimarySoundStateTypes => {
  const highestSound = findHighestRateSound(soundRateList);

  // 아무 소리도 안 들리면 중앙 아이콘도 대기 상태로 돌아간다.
  if (!highestSound) return INITIAL_STATE;

  const { primarySound } = state;

  // 첫 소리이거나, 현재 1순위가 이번 스냅샷에서 사라진 경우.
  // 사라진 소리를 계속 붙들고 있으면 화면이 거짓말을 하게 되므로 즉시 넘긴다.
  const isCurrentSoundGone =
    !primarySound || !soundRateList.some(({ id }) => id === primarySound.id);
  if (isCurrentSoundGone) {
    return {
      primarySound: highestSound,
      challengerId: null,
      challengeStreak: 0,
    };
  }

  // 1순위가 그대로면 rate만 최신으로 갱신하고 도전 기록을 지운다.
  if (highestSound.id === primarySound.id) {
    return {
      primarySound: highestSound,
      challengerId: null,
      challengeStreak: 0,
    };
  }

  // 마진에 못 미치는 도전은 없던 일로 한다. 아슬아슬하게 앞서는 정도로는 안 바뀐다.
  const currentRate =
    soundRateList.find(({ id }) => id === primarySound.id)?.rate ?? 0;
  if (highestSound.rate - currentRate < SWITCH_MARGIN_RATE) {
    return { ...state, challengerId: null, challengeStreak: 0 };
  }

  // 같은 도전자가 연속으로 이겼는지 센다. 도전자가 바뀌면 1부터 다시 센다.
  const nextStreak =
    state.challengerId === highestSound.id ? state.challengeStreak + 1 : 1;

  if (nextStreak >= PRIMARY_SOUND_SWITCH_STREAK) {
    return {
      primarySound: highestSound,
      challengerId: null,
      challengeStreak: 0,
    };
  }

  return {
    ...state,
    challengerId: highestSound.id,
    challengeStreak: nextStreak,
  };
};

// 중앙에 크게 띄울 "지금 가장 뚜렷한 소리" 하나를 고른다.
// 서버가 보낸 소리를 거르지 않고 그중 최댓값을 고른다(어느 것도 빼지 않는다).
//
// 서버가 매 초 스냅샷을 통째로 교체하는데 confidence는 초마다 흔들려서,
// 최댓값을 그대로 쓰면 중앙 아이콘이 1초마다 바뀌어 깜빡이는 것처럼 보인다.
// 마진 + 연속 횟수라는 두 겹의 조건을 걸어 "확실히 더 큰 소리가 계속될 때만" 바꾼다.
//
// 파생 상태를 effect가 아니라 렌더 중에 갱신한다. React가 이 렌더 결과를 버리고
// 곧바로 새 값으로 다시 렌더하므로 리렌더가 한 번 적고, 아이콘이 한 프레임 늦게
// 반영되는 일도 없다. (삭제된 useOrbitSoundList가 쓰던 패턴을 그대로 가져왔다.)
export const usePrimarySound = (
  soundRateList: SoundRateTypes[],
  isListening: boolean,
): SoundRateTypes | null => {
  const [state, setState] = useState<PrimarySoundStateTypes>(INITIAL_STATE);
  // 첫 렌더에도 반드시 한 번 계산되도록 "아직 아무것도 못 본 상태"에서 시작한다.
  // soundRateList로 초기화하면 첫 렌더가 "변경 없음"으로 판정돼, 이미 감지 결과가
  // 있는 채로 마운트될 때(탭 복귀·부모 리마운트) 중앙 아이콘이 비어 있게 된다.
  const [lastSoundRateList, setLastSoundRateList] = useState<
    SoundRateTypes[] | null
  >(null);
  const [wasListening, setWasListening] = useState(isListening);

  if (soundRateList !== lastSoundRateList || isListening !== wasListening) {
    setLastSoundRateList(soundRateList);
    setWasListening(isListening);

    // 감지를 멈추면 즉시 비운다. 중지는 명시적인 사용자 행동이라
    // 하단 목록과 동시에 사라지는 편이 자연스럽다.
    const nextState = isListening
      ? getNextState(state, soundRateList)
      : INITIAL_STATE;

    // 1순위가 그대로여도 도전 기록(streak)은 이어져야 하므로 항상 갱신한다.
    // 1순위가 안 바뀌었다면 반환값이 같아 화면은 다시 그려지지 않는다.
    setState(nextState);
    return nextState.primarySound;
  }

  return state.primarySound;
};
