export type AgreementId = 'service' | 'privacy' | 'sensitive' | 'notification';

export interface AgreementItemTypes {
  id: AgreementId;
  label: string;
  isRequired: boolean;
  detailPath: string;
  detailTitle: string;
  detailContent: string;
}

export const AGREEMENT_ITEMS: AgreementItemTypes[] = [
  {
    id: 'service',
    label: '서비스 이용약관 동의',
    isRequired: true,
    detailPath: '/onboarding/terms/service',
    detailTitle: '서비스 이용약관 동의',
    detailContent: '서비스 이용약관 내용',
  },
  {
    id: 'privacy',
    label: '개인정보 수집 및 이용 동의',
    isRequired: true,
    detailPath: '/onboarding/terms/privacy',
    detailTitle: '개인정보 수집 및 이용 동의',
    detailContent: '개인정보 수집 및 이용 동의 내용',
  },
  {
    id: 'sensitive',
    label: '민감정보 수집 및 이용 동의',
    isRequired: true,
    detailPath: '/onboarding/terms/sensitive',
    detailTitle: '민감정보 수집 및 이용 동의',
    detailContent: '민감정보 수집 및 이용 동의 내용',
  },
  {
    id: 'notification',
    label: '소리 필터 및 모드 알림 수신 동의',
    isRequired: false,
    detailPath: '/onboarding/terms/notification',
    detailTitle: '소리 필터 및 모드 알림 수신 동의',
    detailContent: '소리 필터 및 모드 알림 수신 동의 내용',
  },
];
