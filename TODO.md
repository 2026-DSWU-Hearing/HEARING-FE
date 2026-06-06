# 오늘 할 일

# Home 부분

- [ ] (보류) context API 사용한 부분을 zustand로 바꾸는 게 좋을지 검토하기 → 검토 결과 현 시점 비권장. 페이지 간 상태 공유나 영속화(persist) 필요 시 재검토. (보고서: ~/.claude/plans/zustand-migration-review.md)
- [ ] (보류) home에서 모드 블럭 화살표 버튼 눌러서 모드 설정 들어갔을 때 모드 이름 수정 부분과 아이콘 수정에서 해당 모드 정보가 아니라 "실외"와 "바깥"이 뜨고 있음. → mock 데이터 한계(getModeDetail이 mode_id만 교체, name/icon 고정 반환). IS_MOCK=false 서버 연동 시 자동 해결. 서버 연동까지 보류.

# 푸시 알림

- [x] 중간 시연용: 설정 페이지에 "알림 권한 요청" 버튼 → 누르면 권한 요청 → FCM 토큰 발급 → 백엔드(`POST /users/me/fcm-token`)로 자동 전송까지 완료. (현재 백엔드 `DEV_AUTH_BYPASS=true`로 인증 헤더 없이 동작 중)

## 로그인 구현 후 해야 할 일 (FCM 인증 연동)

> 배경: 현재는 백엔드 `DEV_AUTH_BYPASS=true` 덕분에 인증 헤더 없이 토큰 등록이 됨. 로그인이 붙고 bypass가 false가 되면 인증 헤더 없는 요청은 401 → axios 인터셉터가 `/login`으로 리다이렉트함. 아래 작업으로 정식 인증 흐름으로 전환해야 함.

- [ ] **access token 저장 연결**: 로그인 성공 시 받은 access token을 `localStorage.setItem('token', ...)`에 저장. → `src/shared/apis/axios.ts`의 요청 인터셉터가 이미 `localStorage.token`을 읽어 `Authorization: Bearer`로 자동 부착하므로, 저장만 하면 FCM 토큰 등록 요청도 자동으로 인증됨.
- [ ] **`/login` 라우트 추가**: `axios.ts` 응답 인터셉터가 401 시 `window.location.href = '/login'`으로 보내는데 현재 해당 라우트가 없어 "No routes matched" 경고 발생. 로그인 페이지 라우트 등록 필요. (`src/routes/AppRouter.tsx`)
- [ ] **FCM 토큰 등록 시점 이동**: 설정 페이지 버튼 → 로그인/디바이스 연결 플로우 안으로 이동. "로그인 + 디바이스 연결 완료" 후 알림 허용 버튼을 띄우고, 허용 시 `requestFcmToken` → `postFcmToken` 호출. (현 `useFcmToken` 훅 그대로 재사용 가능)
- [ ] **토큰 갱신/만료 대응**: FCM 토큰은 변경될 수 있음. 로그인할 때마다 또는 앱 진입 시 토큰 재발급 후 서버에 재전송하는 정책 검토. 로그아웃 시 서버에서 토큰 제거(엔드포인트 백엔드와 협의).

- [ ] (보류) FCM foreground 알림 표시 - `title` 없는 메시지 대응. 현재 `useFcmToken.ts`의 `onForegroundMessage` 핸들러가 `if (... && title)` 조건이라 `notification.title`이 없으면 알림이 안 뜸. → 서버 연동 시 `data`-only 페이로드를 쓰면 `notification.title`이 비어 알림이 누락될 수 있음. `new Notification(title ?? '알림', ...)` 형태의 fallback 필요. 서버 페이로드 구조(`data` 키) 확정 후 background SW(`firebase-messaging-sw.js`)와 함께 반영.

# 커스텀 모달

- [ ] (보류) 모달(ConfirmModal/AlertModal) 키보드 접근성 - 포커스 트랩 적용. 모달이 열려도 Tab으로 뒤쪽 ModeForm까지 포커스가 빠져나감. 필요: ①초기 포커스(열릴 때 모달 내부로) ②포커스 트랩(Tab 순환을 모달 안에 가둠) ③닫을 때 포커스 복원. → useFocusTrap 훅 + ModalShell 공통 컴포넌트로 시도했으나 Tab이 여전히 배경까지 이동(모달이 Portal 미사용이라 DOM상 ModeForm과 형제 → 브라우저 기본 Tab 순서 유지됨이 원인 추정). 제대로 하려면 배경에 inert 속성 부여 또는 React Portal + 배경 aria-hidden 처리 필요. 추후 재작업.
