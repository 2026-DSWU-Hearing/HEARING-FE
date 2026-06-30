# 오늘 할 일

# Home 부분

- [ ] (보류) context API 사용한 부분을 zustand로 바꾸는 게 좋을지 검토하기 → 검토 결과 현 시점 비권장. 페이지 간 상태 공유나 영속화(persist) 필요 시 재검토. (보고서: ~/.claude/plans/zustand-migration-review.md)
- [ ] **방해금지 버튼 추가** (home): 누르면 활성 모드/소리를 전부 비활성화하는 방식(방향 A). → **푸시 알림 쪽 추가 구현 없음**: 활성 모드가 없으면 백엔드 소리 필터링(`notification_service.py`)에서 매칭 안 돼 푸시 미발송. 우리 SW/onMessage 수신 코드 그대로. 단, 구현 전 합의할 점 ①방해금지 해제 시 이전 모드 복원 여부(UX) ②백엔드에 이미 있는 `do_not_disturb` 필드+`PATCH /users/me/do-not-disturb` API와 중복 → "모드 비활성화 방식 vs do_not_disturb 플래그 방식" 팀 합의 필요(백엔드는 플래그를 의도했을 수 있음) ③하드웨어 진동(위험 소리 자체 판단)은 별개 → 방해금지가 웹 푸시만 끄는지 진동까지 끄는지 정의.
- [ ] **방해금지 모드 state 유지(영속화)** → **로그인/사용자 정보(GET) 구현 후 진행** - 증상: 방해금지 ON 후 탭 이동/모달 열고 닫으면 다시 OFF로 초기화됨. - 원인: `isDoNotDisturb`가 `HomeModeProvider`의 로컬 `useState(false)`에만 있음(`src/pages/home/hooks/useHomeModeContext.tsx:28`). Provider가 `Home.tsx` 안에 있어 홈 언마운트 시 state 소실. 게다가 서버 `do_not_disturb` 값을 진입 시 읽어오는 GET이 현재 없음(쓰기 patch만 존재) → 항상 false로 시작. - 구현 방향(로그인 후): `users/me` GET을 TanStack Query `useQuery`로 가져와 서버를 source of truth로. 초기값을 서버 응답의 `do_not_disturb`로 동기화하고, `usePatchDoNotDisturb` 성공 시 해당 쿼리 캐시 갱신(invalidate 또는 setQueryData)으로 일관성 유지. 그러면 언마운트돼도 캐시에서 복원됨. - 의존: `GET /users/me` API 함수/훅 신설 필요(현재 없음). `UserTypes.do_not_disturb` 필드는 이미 존재(`src/shared/types/userTypes.ts:7`). 인증 헤더는 access token 저장 작업과 연동(아래 "로그인 구현 후" 섹션 참고).

## 로그인 구현 후 해야 할 일 (FCM 인증 연동)

> 배경: 현재는 백엔드 `DEV_AUTH_BYPASS=true` 덕분에 인증 헤더 없이 토큰 등록이 됨. 로그인이 붙고 bypass가 false가 되면 인증 헤더 없는 요청은 401 → axios 인터셉터가 `/login`으로 리다이렉트함. 아래 작업으로 정식 인증 흐름으로 전환해야 함.

- [x] **access token 저장 연결**: 로그인 성공 시 `setAuthTokens`가 `ACCESS_TOKEN_KEY('accessToken')`로 저장하고, `src/shared/apis/axios.ts` 요청 인터셉터가 `getAccessToken()`으로 읽어 `Authorization: Bearer`로 자동 부착함. (#72에서 axios가 `'token'` 키를 읽던 불일치 버그 수정 완료. WebSocket 인증도 같은 `getAccessToken()` 재사용.)
- [ ] **`/login` 라우트 추가**: `axios.ts` 응답 인터셉터가 401 시 `window.location.href = '/login'`으로 보내는데 현재 해당 라우트가 없어 "No routes matched" 경고 발생. 로그인 페이지 라우트 등록 필요. (`src/routes/AppRouter.tsx`)
- [ ] **FCM 토큰 등록 시점 이동**: 설정 페이지 버튼 → 로그인/디바이스 연결 플로우 안으로 이동. "로그인 + 디바이스 연결 완료" 후 알림 허용 버튼을 띄우고, 허용 시 `requestFcmToken` → `postFcmToken` 호출. (현 `useFcmToken` 훅 그대로 재사용 가능)
- [ ] **토큰 갱신/만료 대응**: FCM 토큰은 변경될 수 있음. 로그인할 때마다 또는 앱 진입 시 토큰 재발급 후 서버에 재전송하는 정책 검토. 로그아웃 시 서버에서 토큰 제거(엔드포인트 백엔드와 협의).

- [x] ~~(보류) FCM foreground 알림 표시~~ → **해소(#72)**: 앱이 켜져 있을 때(포그라운드)는 FCM 대신 WebSocket(`useDetectionSocket`) 인앱 토스트로 전환. FCM+WS 알림 중복 문제 해결. FCM 토큰 등록/백그라운드 SW(`firebase-messaging-sw.js`)는 그대로 유지(앱 꺼졌을 때 알림용).

# 실시간 소리 감지 알림 (WebSocket)

- [ ] **알림 탭 페이지 만들 때 고려할 것 — TanStack Query 캐시 갱신**: WS 감지 알림(`useDetectionSocket`) 수신 시 현재는 인앱 토스트만 띄움. 알림 내역/목록 페이지가 생기면, `onDetection` 콜백에서 알림 목록 관련 쿼리를 `invalidateQueries`(또는 `setQueryData`로 새 항목 추가)해 다른 화면도 최신화해야 함. 관련 목록 조회 API가 생긴 뒤 적용. (감지 결과 타입은 `src/shared/types/detectionTypes.ts`)
- [ ] **로그인 구현 완료 후 WS 자동 연결 동작 확인**: `useDetectionSocket`은 `App`이 `getAccessToken()`으로 읽은 토큰을 prop으로 받고 `[token]` 의존성으로 연결한다. 로그인 성공 시 `useGoogleAuth`의 `navigate('/')`가 `App` 리렌더를 유발해 토큰이 새로 주입되며 WS가 연결되는 구조(#72). 로그인 미완성이라 코드만 갖춰둔 상태 → 로그인 완성 후 "로그인 직후 WS가 실제로 붙는지" 한 번 검증할 것. (로그인이 `navigate` 대신 같은 페이지 유지 방식으로 바뀌면 트리거 재검토 필요)

# 커스텀 모달

- [ ] (보류) 모달(ConfirmModal/AlertModal) 키보드 접근성 - 포커스 트랩 적용. 모달이 열려도 Tab으로 뒤쪽 ModeForm까지 포커스가 빠져나감. 필요: ①초기 포커스(열릴 때 모달 내부로) ②포커스 트랩(Tab 순환을 모달 안에 가둠) ③닫을 때 포커스 복원. → useFocusTrap 훅 + ModalShell 공통 컴포넌트로 시도했으나 Tab이 여전히 배경까지 이동(모달이 Portal 미사용이라 DOM상 ModeForm과 형제 → 브라우저 기본 Tab 순서 유지됨이 원인 추정). 제대로 하려면 배경에 inert 속성 부여 또는 React Portal + 배경 aria-hidden 처리 필요. 추후 재작업.
