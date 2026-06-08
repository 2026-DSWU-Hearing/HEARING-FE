import type { FunctionComponent } from 'react';
import AnimalIcon from '@/shared/components/icons/modes/AnimalIcon';
import CafeIcon from '@/shared/components/icons/modes/CafeIcon';
import CookingIcon from '@/shared/components/icons/modes/CookingIcon';
import EmergencyIcon from '@/shared/components/icons/modes/EmergencyIcon';
import ExerciseIcon from '@/shared/components/icons/modes/ExerciseIcon';
import GoingOutIcon from '@/shared/components/icons/modes/GoingOutIcon';
import HospitalIcon from '@/shared/components/icons/modes/HospitalIcon';
import MeetingIcon from '@/shared/components/icons/modes/MeetingIcon';
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
  | 'ic_meeting'
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
  ic_meeting: MeetingIcon,
  ic_school: SchoolIcon,
  ic_study: StudyIcon,
};

// 매핑에 없는 키(미지정/레거시 한글값 등)가 들어와도 항상 컴포넌트를 반환해 화면이 깨지지 않게 한다.
export const getModeIconComponent = (iconKey: string): ModeIconComponentTypes =>
  MODE_ICON_MAP[iconKey as ModeIconKeyTypes] ?? UnknownModeIcon;
