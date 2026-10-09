import type { FunctionComponent } from 'react';
import AnimalIcon from '@/shared/components/icons/modes/AnimalIcon';
import CafeIcon from '@/shared/components/icons/modes/CafeIcon';
import CookingIcon from '@/shared/components/icons/modes/CookingIcon';
import EmergencyIcon from '@/shared/components/icons/modes/EmergencyIcon';
import ExerciseIcon from '@/shared/components/icons/modes/ExerciseIcon';
import GoingOutIcon from '@/shared/components/icons/modes/GoingOutIcon';
import HospitalIcon from '@/shared/components/icons/modes/HospitalIcon';
import HomeIcon from '@/shared/components/icons/modes/HomeIcon';
import NatureIcon from '@/shared/components/icons/modes/NatureIcon';
import SchoolIcon from '@/shared/components/icons/modes/SchoolIcon';
import SleepIcon from '@/shared/components/icons/modes/SleepIcon';
import StudyIcon from '@/shared/components/icons/modes/StudyIcon';
import TransportationIcon from '@/shared/components/icons/modes/TransportationIcon';
import TravelIcon from '@/shared/components/icons/modes/TravelIcon';
import UnknownModeIcon from '@/shared/components/icons/modes/UnknownModeIcon';
import WorkplaceIcon from '@/shared/components/icons/modes/WorkplaceIcon';

// 서버가 모드의 icon 필드로 내려주는 키 (GET /api/v1/modes/icons 의 icon_key)
export type ModeIconKeyTypes =
  | 'ic_workplace'
  | 'ic_exercise'
  | 'ic_cooking'
  | 'ic_nature'
  | 'ic_travel'
  | 'ic_emergency'
  | 'ic_animal'
  | 'ic_cafe'
  | 'ic_hospital'
  | 'ic_transportation'
  | 'ic_goingOut'
  | 'ic_sleep'
  | 'ic_home'
  | 'ic_school'
  | 'ic_study';

export interface ModeIconPropTypes {
  className?: string;
}

type ModeIconComponentTypes = FunctionComponent<ModeIconPropTypes>;

// 새 모드 생성 폼의 기본 선택값.
export const DEFAULT_MODE_ICON_KEY: ModeIconKeyTypes = 'ic_workplace';

// icon_key → 아이콘 컴포넌트 매핑. 실제 SVG로 교체할 때는 각 컴포넌트 파일만 고치면 되고,
// 새 키 추가 시에만 이 테이블과 ModeIconKeyTypes union에 한 줄씩 더한다. (단일 확장 지점)
export const MODE_ICON_MAP: Record<ModeIconKeyTypes, ModeIconComponentTypes> = {
  ic_workplace: WorkplaceIcon,
  ic_exercise: ExerciseIcon,
  ic_cooking: CookingIcon,
  ic_nature: NatureIcon,
  ic_travel: TravelIcon,
  ic_emergency: EmergencyIcon,
  ic_animal: AnimalIcon,
  ic_cafe: CafeIcon,
  ic_hospital: HospitalIcon,
  ic_transportation: TransportationIcon,
  ic_goingOut: GoingOutIcon,
  ic_sleep: SleepIcon,
  ic_home: HomeIcon,
  ic_school: SchoolIcon,
  ic_study: StudyIcon,
};

const KOREAN_MODE_ICON_KEY_MAP: Record<string, ModeIconKeyTypes> = {
  직장: 'ic_workplace',
  운동: 'ic_exercise',
  요리: 'ic_cooking',
  자연: 'ic_nature',
  여행: 'ic_travel',
  긴급: 'ic_emergency',
  동물: 'ic_animal',
  카페: 'ic_cafe',
  병원: 'ic_hospital',
  교통: 'ic_transportation',
  외출: 'ic_goingOut',
  수면: 'ic_sleep',
  가정: 'ic_home',
  학교: 'ic_school',
  공부: 'ic_study',
};

export const normalizeModeIconKey = (
  iconKey: string,
): ModeIconKeyTypes | null => {
  if (Object.prototype.hasOwnProperty.call(MODE_ICON_MAP, iconKey)) {
    return iconKey as ModeIconKeyTypes;
  }

  return KOREAN_MODE_ICON_KEY_MAP[iconKey] ?? null;
};

// 매핑에 없는 키(미지정/레거시 한글값 등)가 들어와도 항상 컴포넌트를 반환해 화면이 깨지지 않게 한다.
export const getModeIconComponent = (
  iconKey: string,
): ModeIconComponentTypes => {
  const normalizedIconKey = normalizeModeIconKey(iconKey);

  return normalizedIconKey ? MODE_ICON_MAP[normalizedIconKey] : UnknownModeIcon;
};
