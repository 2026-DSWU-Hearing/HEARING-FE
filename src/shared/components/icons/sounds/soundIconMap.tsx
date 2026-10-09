import type { FunctionComponent } from 'react';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import BoilIcon from '@/shared/components/icons/sounds/BoilIcon';
import ClassicIcon from '@/shared/components/icons/sounds/ClassicIcon';
import KnockIcon from '@/shared/components/icons/sounds/KnockIcon';
import PianoIcon from '@/shared/components/icons/sounds/PianoIcon';
import ScreamIcon from '@/shared/components/icons/sounds/ScreamIcon';
import SirenIcon from '@/shared/components/icons/sounds/SirenIcon';
import SnakeIcon from '@/shared/components/icons/sounds/SnakeIcon';
import {
  faBaby,
  faBell,
  faBellConcierge,
  faBroom,
  faBug,
  faBullhorn,
  faBurst,
  faCar,
  faHouseChimneyCrack,
  faCarOn,
  faCat,
  faCloudBolt,
  faCloudShowersHeavy,
  faComments,
  faComputerMouse,
  faCow,
  faDog,
  faDoorClosed,
  faDove,
  faDroplet,
  faDrum,
  faFaceSmileBeam,
  faFaceSadCry,
  faFaceTired,
  faFan,
  faFire,
  faHouseFire,
  faGavel,
  faGears,
  faGuitar,
  faHand,
  faHouse,
  faKey,
  faKitchenSet,
  faLeaf,
  faLungs,
  faMicrophone,
  faMotorcycle,
  faMusic,
  faPaw,
  faPeopleGroup,
  faPersonRays,
  faPlane,
  faPlug,
  faPrint,
  faRoad,
  faScrewdriverWrench,
  faShoePrints,
  faShower,
  faSmog,
  faSprayCan,
  faStaffSnake,
  faTowerBroadcast,
  faTrain,
  faTree,
  faTriangleExclamation,
  faTruckMedical,
  faUtensils,
  faBicycle,
  faVolcano,
  faVolumeHigh,
  faWater,
  faWind,
  faBowlFood,
  faHeadphones,
  faSignal,
} from '@fortawesome/free-solid-svg-icons';

// 소리 카테고리 키. 개별 소리 아이콘이 없을 때의 폴백 단위가 된다.
export type SoundCategoryKeyTypes =
  | 'ic_emergency'
  | 'ic_traffic'
  | 'ic_human'
  | 'ic_life'
  | 'ic_nature'
  | 'ic_animal'
  | 'ic_kitchen'
  | 'ic_music';

// 매핑/폴백 어디에도 걸리지 않을 때 쓰는 최종 기본 아이콘.
const DEFAULT_SOUND_ICON: IconDefinition = faVolumeHigh;

export interface SoundIconPropTypes {
  className?: string;
}

type SoundIconComponentTypes = FunctionComponent<SoundIconPropTypes>;

// 디자인 시안 SVG로 직접 그린 소리 아이콘. FontAwesome 매핑(SOUND_ICON_MAP)보다
// 우선 적용된다. 디자이너가 SVG를 줄 때마다 컴포넌트 파일 + 이 테이블에 한 줄씩 추가한다.
export const SOUND_SVG_ICON_MAP: Record<string, SoundIconComponentTypes> = {
  사이렌: SirenIcon,
  '끓는 소리': BoilIcon,
  클래식: ClassicIcon,
  피아노: PianoIcon,
  '노크 소리': KnockIcon,
  비명: ScreamIcon,
  뱀: SnakeIcon,
};

// 소리명에 대응하는 직접 그린 SVG 컴포넌트를 반환. 없으면 null (→ FontAwesome 폴백).
export const getSoundSvgIcon = (
  soundName: string,
): SoundIconComponentTypes | null => SOUND_SVG_ICON_MAP[soundName] ?? null;

// 한글 소리명 → FontAwesome 아이콘. (서버 SEED_CATALOG의 name 철자 그대로 사용)
// 새 소리 추가 시 이 테이블에 한 줄만 더하면 된다. (단일 확장 지점)
export const SOUND_ICON_MAP: Record<string, IconDefinition> = {
  // 긴급
  '화재 경보': faHouseFire,
  사이렌: faTowerBroadcast,
  경보음: faBell,
  응급차량: faTruckMedical,
  '폭발·파열음': faBurst,
  '충돌·파손음': faHouseChimneyCrack,

  // 교통
  '자동차 경고음': faCarOn,
  '급정거·마찰음': faRoad,
  경적: faBullhorn,
  기차: faTrain,
  '차량 주행음': faCar,
  오토바이: faMotorcycle,
  항공기: faPlane,
  엔진: faGears,
  '기타 이동수단': faBicycle,

  // 사람
  비명: faPersonRays,
  울음: faFaceSadCry,
  '호흡·기침': faLungs,
  신음: faFaceTired,
  음성: faComments,
  '아기 옹알이': faBaby,
  웃음: faFaceSmileBeam,
  노래: faMicrophone,
  군중: faPeopleGroup,
  발걸음: faShoePrints,

  // 생활음
  가전제품: faPlug,
  '욕실 물 소리': faShower,
  '물 튀는 소리': faDroplet,
  스프레이: faSprayCan,
  사무기기: faPrint,
  클릭음: faComputerMouse,
  '휙 소리': faWind,
  바스락: faLeaf,
  전자알림음: faBellConcierge,
  '전자 알림음': faSignal,
  '문 닫힘 소리': faDoorClosed,
  '노크 소리': faHand,
  '열쇠 소리': faKey,
  공구: faScrewdriverWrench,
  '실내 배경음': faHouse,
  타격음: faGavel,
  마찰음: faBroom,
  소음: faVolumeHigh,
  '냉난방·기계음': faFan,
  증기: faSmog,
  음악: faMusic,

  // 자연
  '바람·비': faCloudShowersHeavy,
  천둥: faCloudBolt,
  '나뭇잎 소리': faTree,
  화산분출음: faVolcano,
  '화산 분출음': faVolcano,
  물가: faWater,

  // 동물
  고양이: faCat,
  개: faDog,
  새: faDove,
  가축: faCow,
  뱀: faStaffSnake,
  벌레: faBug,
  '맹수·야생동물': faPaw,

  // 주방
  '끓는 소리': faFire,
  식기: faUtensils,
  '주방 도구': faKitchenSet,
  조리: faBowlFood,

  // 음악
  '대중 음악': faHeadphones,
  피아노: faMusic,
  현악기: faGuitar,
  드럼: faDrum,
  재즈: faMusic,
  클래식: faMusic,
};

// 카테고리 폴백 아이콘. 개별 소리 매핑이 없을 때 카테고리 단위로 떨어진다.
export const CATEGORY_ICON_MAP: Record<SoundCategoryKeyTypes, IconDefinition> =
  {
    ic_emergency: faTriangleExclamation,
    ic_traffic: faCar,
    ic_human: faPeopleGroup,
    ic_life: faHouse,
    ic_nature: faTree,
    ic_animal: faPaw,
    ic_kitchen: faUtensils,
    ic_music: faMusic,
  };

// 한글 카테고리명 → 카테고리 키. (CATEGORY_COLOR 키와 SEED_CATALOG 카테고리명 기준)
const KOREAN_CATEGORY_KEY_MAP: Record<string, SoundCategoryKeyTypes> = {
  긴급: 'ic_emergency',
  교통: 'ic_traffic',
  사람: 'ic_human',
  생활음: 'ic_life',
  자연: 'ic_nature',
  동물: 'ic_animal',
  주방: 'ic_kitchen',
  음악: 'ic_music',
};

// 카테고리명을 카테고리 키로 정규화. 정확히 일치하지 않아도 '생활'/'위험' 등
// 부분 일치 레거시 값까지 흡수해 폴백이 끊기지 않게 한다.
const normalizeCategoryKey = (
  categoryName: string,
): SoundCategoryKeyTypes | null => {
  const exactKey = KOREAN_CATEGORY_KEY_MAP[categoryName];
  if (exactKey) {
    return exactKey;
  }

  if (categoryName.includes('위험') || categoryName.includes('긴급')) {
    return 'ic_emergency';
  }
  if (categoryName.includes('생활')) {
    return 'ic_life';
  }

  return null;
};

// 소리명(+카테고리)으로 아이콘을 결정한다. 2단 폴백:
//   1) 개별 소리명 매핑   2) 카테고리 폴백   3) 기본 아이콘
// 어떤 값이 들어와도 항상 IconDefinition을 반환해 화면이 깨지지 않는다.
export const getSoundIcon = (
  soundName: string,
  categoryName?: string,
): IconDefinition => {
  const soundIcon = SOUND_ICON_MAP[soundName];
  if (soundIcon) {
    return soundIcon;
  }

  if (categoryName) {
    const categoryKey = normalizeCategoryKey(categoryName);
    if (categoryKey) {
      return CATEGORY_ICON_MAP[categoryKey];
    }
  }

  return DEFAULT_SOUND_ICON;
};
