# Projct: Hear:ing (청각장애인 대상 pwa 웹앱)

## Critical Rules (절대 규칙)

- .env 등 시크릿 파일 절대 커밋 금지
- main 브랜치에 직접 push 금지 - 반드시 PR을 통해 머지

## Architecture (아키 텍쳐)

```
project-root
├── public
│   └── icons
└── src
    ├── layout # 🧱 공통 레이아웃 컴포넌트 (Header, Footer 등)
    │   └── 📄 Navigation.tsx
    ├── pages # 📄 라우팅 페이지 디렉토리
    │   ├── communication # 🗣️ 양방향 소통 페이지
    │   ├── home # 🏠 소리 필터링 페이지
    │   │   ├── apis
    │   │   ├── components
    │   │   ├── constants
    │   │   ├── hooks
    │   │   ├── types
    │   │   └── utils
    │   ├── livesound # 👂🏻 실시간 소리 감지 페이지
    │   └── setting # 👤 설정 페이지
    ├── routes # 🗺️ 라우팅 설정
    └── shared # ♻️ 전역 공통 코드
        ├── apis # 공통 API 함수
        ├── assets # 정적 리소스 (이미지, 아이콘 등)
        ├── components # 재사용 가능한 공통 컴포넌트
        ├── constants # 공통 상수
        ├── hooks # 공통 커스텀 훅
        ├── styles # 전역 스타일 및 테마
        ├── types # 공통 타입 정의
        └── utils # 공통 유틸 함수
```

## Tech Stack (기술 스택)

- Frontend: React + Vite + TypeScript + pnpm + Tailwind CSS + TanStack Query + zustand
- Backend: FastAPI (Python), AWS 클라우드 배포 예정
- AI: YAMNet (서버에서 소리 분류)
- DB: PostgreSQL + Redis
- Hardware: ESP32 (마이크 + 진동 모터, 넥밴드 형태)
- 통신: wifi + HTTP + WebSocket (프론트 ↔ 서버)

## Build & Test Commands (빌드 / 테스트)

```bash
pnpm install # 의존성 설치
pnpm run dev # start web
```

## Domain Context (도메인 컨텍스트)

1. 하드웨어(ESP32)에서 소리 감지
2. 위험한 소리 → 즉각 진동 (하드웨어 자체 판단)
3. 그 외 소리 → 서버로 전송 → YAMNet으로 분류
4. 분류 결과: 하드웨어에 진동 신호 + 웹앱에 푸시 알림
5. 반응하는 소리는 웹앱에서 사용자가 설정한 모드 + 소리 필터링 기준으로만 동작

## 프로젝트 문서

- 코딩 컨벤션: @docs/conventions.md
- API 문서: @docs/api-spec.md
- mermaid architecture: @docs/architecture.md
