# Hear:ing 프로젝트 — Claude 컨텍스트

## 프로젝트 개요

청각장애인 대상 서비스. 하드웨어(ESP32) + 서버 + 웹앱 구성.
졸업 프로젝트로 9월 초 MVP 완성 목표, 10월 종료.

### 내 담당

- 프론트엔드 (소리 필터링 페이지 + 설정 페이지)

### 기술 스택

- Frontend: React + Vite + pnpm + Tailwind CSS + TanStack Query
- Backend: FastAPI (Python), AWS 클라우드 배포 예정
- AI: YAMNet (서버에서 소리 분류)
- Hardware: ESP32 (마이크 + 진동 모터, 넥밴드 형태)
- 통신: wifi + HTTP + WebSocket (프론트 ↔ 서버)

---

## 폴더 구조

```
src/
├── features/
├── layout/
│   └── Navigation.tsx
├── pages/
│   ├── home/          # 소리 필터링 페이지 (내 담당)
│   │   ├── apis/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   ├── communication/ # 양방향 소통
│   ├── livesound/     # 실시간 소리 감지
│   └── setting/       # 설정 (내 담당)
├── routes/
└── shared/
    ├── apis/
    ├── assets/
    ├── components/
    ├── constants/
    ├── hooks/
    ├── styles/
    ├── types/
    └── utils/
```

---

## 코딩 컨벤션

### 네이밍

- 컴포넌트 / class: `PascalCase`
- 폴더명, 파일명(컴포넌트 제외), 변수, 함수, 파라미터: `camelCase`
- 상수: `BIG_SNAKE_CASE`

### 변수 / 함수

- 전역 변수 지양
- 구조 분해 할당 적극 활용
- 문자열 조합은 템플릿 리터럴 사용
- 줄임말 사용 금지 (의미 명확하게)
- 함수는 화살표 함수 사용
- 이벤트 핸들러: `handle + 기능 + 이벤트` (예: `handleBtnClick`, `handleTabChange`)
- boolean 변수: `is + 상태` (예: `isLogined`), 필요시 `can / should / has`
- API 함수: `HTTP 메서드 + 명사` (예: `getUser`, `postSound`)
- `var` 사용 금지, `const` 기본 / 필요시 `let`

### TypeScript

- 모든 타입명 뒤에 `-Types` 접미사
- Props 타입: `컴포넌트명 + PropTypes`
- object 구조 → `interface`, 단일 변수 → `type`
- 컴포넌트 인자 타입은 컴포넌트 바로 위에 선언

### 디자인 패턴

- Custom Hook
- Reducer
- Context Provider
- Error Boundary
- Controlled Components
- Lazy Loading

---

## Home 페이지 상태 관리 구조

### 클라이언트 상태

- `selectedModeId: number | null` — 현재 선택된 모드 ID
- `isSoundModalOpen: boolean` — 소리 추가 모달 열림 여부
- 위치: `HomeModeProvider` (Context)에서 관리

### 서버 상태 (TanStack Query)

- `useGetModes()` — 모드 목록 fetch
- `useGetSoundsByMode(selectedModeId)` — 선택된 모드의 소리 목록 fetch

### 컴포넌트 구조

```
Home.tsx (HomeModeProvider로 감쌈)
├── HomeHeader
├── ModeList
│   └── ModeCard (isSelected prop으로 선택 스타일)
└── SoundSection (selectedModeId 기반으로 소리 fetch)
    └── SoundBlock
SoundAddModal (isSoundModalOpen 상태로 조건부 렌더)
```

### 결정된 사항

- `selectedModeId`는 `ModeList`와 `SoundSection` 양쪽에서 필요하므로 Context로 관리
- Provider 밖에서 `useHomeModeContext()` 호출 시 명시적 에러 throw
- `contextValue`는 `useMemo`로 감싸서 불필요한 리렌더 방지
- 초기 모드 자동 선택 로직 필요 (modes fetch 완료 후 첫 번째 모드 자동 선택)

---

## 주요 기능 흐름

1. 하드웨어(ESP32)에서 소리 감지
2. 위험한 소리 → 즉각 진동 (하드웨어 자체 판단)
3. 그 외 소리 → 서버로 전송 → YAMNet으로 분류
4. 분류 결과: 하드웨어에 진동 신호 + 웹앱에 푸시 알림
5. 반응하는 소리는 웹앱에서 사용자가 설정한 모드 + 소리 필터링 기준으로만 동작

---

## 코드 리뷰 시 주의사항

- 설명할 때는 라인별로 왜 이렇게 짰는지 이유까지 설명해줄 것
- 구조 개선 포인트가 있으면 같이 알려줄 것
- 코드 전체를 이해하면서 진행하는 것이 목표
