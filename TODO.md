# 오늘 할 일

## ui 관련

- [ x ] 카테고리 블럭 패딩 xxxs인가로 바꾸기
- [ x ] 저장 버튼 노란색으로 ( 모드 수정하기 )
- [ ] 바탐모달 열리고 뒤에 뜨는 검정 배경색 맞는지 확인하기
- [ ] 바탐모달에 스크롤 생기면 공간 차지해서 카드 크기 줄어드는 거 해결하기
- [ ] input 컴포넌트 수정
- [ ] 전체적으로 디자인이랑 값 다 맞는지 확인하기
- [ ] 애니메이션 넣기 (바탐 모달 같은 것들)
- [ ] 방해금지 모드 버튼 - 그리고 카테고리 블럭 색상까지

# Home 부분

- [ ] (보류) context API 사용한 부분을 zustand로 바꾸는 게 좋을지 검토하기 → 검토 결과 현 시점 비권장. 페이지 간 상태 공유나 영속화(persist) 필요 시 재검토. (보고서: ~/.claude/plans/zustand-migration-review.md)

- [ ] **방해금지 버튼 추가** (home): 누르면 활성 모드/소리를 전부 비활성화하는 방식(방향 A). → **푸시 알림 쪽 추가 구현 없음**: 활성 모드가 없으면 백엔드 소리 필터링(`notification_service.py`)에서 매칭 안 돼 푸시 미발송. 우리 SW/onMessage 수신 코드 그대로. 단, 구현 전 합의할 점 ①방해금지 해제 시 이전 모드 복원 여부(UX) ②백엔드에 이미 있는 `do_not_disturb` 필드+`PATCH /users/me/do-not-disturb` API와 중복 → "모드 비활성화 방식 vs do_not_disturb 플래그 방식" 팀 합의 필요(백엔드는 플래그를 의도했을 수 있음) ③하드웨어 진동(위험 소리 자체 판단)은 별개 → 방해금지가 웹 푸시만 끄는지 진동까지 끄는지 정의.

# 푸시 알림

- [x] 중간 시연용: 설정 페이지에 "알림 권한 요청" 버튼 → 누르면 권한 요청 → FCM 토큰 발급 → 백엔드(`POST /users/me/fcm-token`)로 자동 전송까지 완료. (현재 백엔드 `DEV_AUTH_BYPASS=true`로 인증 헤더 없이 동작 중)

## 로그인 구현 후 해야 할 일 (FCM 인증 연동)

> 배경: 현재는 백엔드 `DEV_AUTH_BYPASS=true` 덕분에 인증 헤더 없이 토큰 등록이 됨. 로그인이 붙고 bypass가 false가 되면 인증 헤더 없는 요청은 401 → axios 인터셉터가 `/login`으로 리다이렉트함. 아래 작업으로 정식 인증 흐름으로 전환해야 함.

- [ ] **access token 저장 연결**: 로그인 성공 시 받은 access token을 `localStorage.setItem('token', ...)`에 저장. → `src/shared/apis/axios.ts`의 요청 인터셉터가 이미 `localStorage.token`을 읽어 `Authorization: Bearer`로 자동 부착하므로, 저장만 하면 FCM 토큰 등록 요청도 자동으로 인증됨.
- [ ] **`/login` 라우트 추가**: `axios.ts` 응답 인터셉터가 401 시 `window.location.href = '/login'`으로 보내는데 현재 해당 라우트가 없어 "No routes matched" 경고 발생. 로그인 페이지 라우트 등록 필요. (`src/routes/AppRouter.tsx`)
- [ ] **FCM 토큰 등록 시점 이동**: 설정 페이지 버튼 → 로그인/디바이스 연결 플로우 안으로 이동. "로그인 + 디바이스 연결 완료" 후 알림 허용 버튼을 띄우고, 허용 시 `requestFcmToken` → `postFcmToken` 호출. (현 `useFcmToken` 훅 그대로 재사용 가능)
- [ ] **토큰 갱신/만료 대응**: FCM 토큰은 변경될 수 있음. 로그인할 때마다 또는 앱 진입 시 토큰 재발급 후 서버에 재전송하는 정책 검토. 로그아웃 시 서버에서 토큰 제거(엔드포인트 백엔드와 협의).

- [ ] (보류) FCM foreground 알림 표시 - `title` 없는 메시지 대응. 현재 `useFcmToken.ts`의 `onForegroundMessage` 핸들러가 `if (... && title)` 조건이라 `notification.title`이 없으면 알림이 안 뜸. → 서버 연동 시 `data`-only 페이로드를 쓰면 `notification.title`이 비어 알림이 누락될 수 있음. `new Notification(title ?? '알림', ...)` 형태의 fallback 필요. 서버 페이로드 구조(`data` 키) 확정 후 background SW(`firebase-messaging-sw.js`)와 함께 반영.

### PR #35 코드 리뷰 보류 항목 (Gemini/CodeRabbit)

- [ ] (보류) **토큰 서버 전송 실패 사용자 피드백 + useMutation 전환**: 현재 `useFcmToken.ts`에서 `postFcmToken` 실패 시 `console.error`만 함 → 사용자는 등록 실패를 인지 못함. 토스트/Alert로 피드백 필요. 동시에 프로젝트 컨벤션상 서버 상태는 TanStack Query를 써야 하므로 `useMutation(postFcmToken)`으로 래핑해 로딩/에러 상태 관리. (토스트 UI 정비 + 두 작업 함께 진행 권장)
- [ ] (보류) **foreground 알림 리스너 전역화**: `onForegroundMessage` 리스너가 `useFcmToken`(Setting 페이지 전용) 안에 있어, 설정 페이지를 벗어나면 다른 페이지(홈 등)에서 foreground 알림을 못 받음. → 리스너 등록을 `App.tsx` 또는 전역 Provider로 이동. FCM 초기화 시점 설계와 얽히므로 로그인/디바이스 연결 플로우 정비 시 함께.
- [ ] (보류, 낮음) **firebase-messaging-sw.js config 환경별 분리**: 현재 SW에 Firebase config 하드코딩. 환경(dev/staging/prod)별 다른 Firebase 프로젝트를 쓰게 되면, SW 등록 URL에 쿼리스트링으로 config를 전달하고 SW 내부에서 파싱하는 방식 고려. 현재는 프로젝트 1개라 불필요(공개값이라 보안 이슈도 아님). 환경 분리 시점에 재검토.

# 커스텀 모달

- [ ] (보류) 모달(ConfirmModal/AlertModal) 키보드 접근성 - 포커스 트랩 적용. 모달이 열려도 Tab으로 뒤쪽 ModeForm까지 포커스가 빠져나감. 필요: ①초기 포커스(열릴 때 모달 내부로) ②포커스 트랩(Tab 순환을 모달 안에 가둠) ③닫을 때 포커스 복원. → useFocusTrap 훅 + ModalShell 공통 컴포넌트로 시도했으나 Tab이 여전히 배경까지 이동(모달이 Portal 미사용이라 DOM상 ModeForm과 형제 → 브라우저 기본 Tab 순서 유지됨이 원인 추정). 제대로 하려면 배경에 inert 속성 부여 또는 React Portal + 배경 aria-hidden 처리 필요. 추후 재작업.
