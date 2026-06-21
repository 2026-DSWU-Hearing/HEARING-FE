# 오늘 할 일

## 설정 페이지 컴포넌트 만들기

- [ ] 나의 디바이스 부분 컴포넌트
- [ ] 진동 강도 설정 부분 컴포넌트

# 리팩토링

- [ ] **ModeHeader를 TopNavigation으로 통합 후 삭제**: 두 헤더가 거의 동일 → `TopNavigation`(`src/layout/TopNavigation.tsx`)으로 일원화. props 1:1 매핑 가능: `actionLabel`→`rightText`, `onActionClick`→`onRightClick`, `isActionDisabled`→`isRightDisabled`, 주황 활성색은 `rightVariant="active"`. `TopNavigation`은 이미 grid(`grid-cols-[48px_1fr_64px]`, 제목 중앙)로 통일해둠.
  - **⚠️ 핵심 함정: 패딩 이중 적용.** `ModeForm.tsx:51`의 래퍼 `div`가 `pt-[2.75rem] px-[1.03rem]`을 갖고 있는데, `TopNavigation`은 같은 패딩을 자체 내장함. 단순 치환 시 헤더가 56px 더 내려가고 좌우 패딩이 2배가 됨 → 교체할 때 **래퍼에서 `pt`/`px`를 빼거나 본문(`<main>`)에만 좌우 패딩을 다시 줘야 함.**
  - 호출 예시(교체 후):
    ```tsx
    <TopNavigation
      title={headerTitle}
      rightText={headerActionLabel}
      onRightClick={handleSubmitClick}
      rightVariant="active"
      isRightDisabled={isSubmitting || !canSubmit}
    />
    ```
  - 정렬: `ModeHeader`도 동일 grid였으므로 제목 위치 동일. 비활성 색(`disabled:text-neutral-300`)·활성 색(`text-primary-500`)·하단 간격(2.5rem)도 이미 일치. → 패딩만 정리하면 `ModeHeader` 삭제 가능(사용처는 `ModeForm.tsx` 한 곳).

# Home 부분

- [ ] (보류) context API 사용한 부분을 zustand로 바꾸는 게 좋을지 검토하기 → 검토 결과 현 시점 비권장. 페이지 간 상태 공유나 영속화(persist) 필요 시 재검토. (보고서: ~/.claude/plans/zustand-migration-review.md)
- [ ] **방해금지 버튼 추가** (home): 누르면 활성 모드/소리를 전부 비활성화하는 방식(방향 A). → **푸시 알림 쪽 추가 구현 없음**: 활성 모드가 없으면 백엔드 소리 필터링(`notification_service.py`)에서 매칭 안 돼 푸시 미발송. 우리 SW/onMessage 수신 코드 그대로. 단, 구현 전 합의할 점 ①방해금지 해제 시 이전 모드 복원 여부(UX) ②백엔드에 이미 있는 `do_not_disturb` 필드+`PATCH /users/me/do-not-disturb` API와 중복 → "모드 비활성화 방식 vs do_not_disturb 플래그 방식" 팀 합의 필요(백엔드는 플래그를 의도했을 수 있음) ③하드웨어 진동(위험 소리 자체 판단)은 별개 → 방해금지가 웹 푸시만 끄는지 진동까지 끄는지 정의.
- [ ] **방해금지 모드 state 유지(영속화)** → **로그인/사용자 정보(GET) 구현 후 진행** - 증상: 방해금지 ON 후 탭 이동/모달 열고 닫으면 다시 OFF로 초기화됨. - 원인: `isDoNotDisturb`가 `HomeModeProvider`의 로컬 `useState(false)`에만 있음(`src/pages/home/hooks/useHomeModeContext.tsx:28`). Provider가 `Home.tsx` 안에 있어 홈 언마운트 시 state 소실. 게다가 서버 `do_not_disturb` 값을 진입 시 읽어오는 GET이 현재 없음(쓰기 patch만 존재) → 항상 false로 시작. - 구현 방향(로그인 후): `users/me` GET을 TanStack Query `useQuery`로 가져와 서버를 source of truth로. 초기값을 서버 응답의 `do_not_disturb`로 동기화하고, `usePatchDoNotDisturb` 성공 시 해당 쿼리 캐시 갱신(invalidate 또는 setQueryData)으로 일관성 유지. 그러면 언마운트돼도 캐시에서 복원됨. - 의존: `GET /users/me` API 함수/훅 신설 필요(현재 없음). `UserTypes.do_not_disturb` 필드는 이미 존재(`src/shared/types/userTypes.ts:7`). 인증 헤더는 access token 저장 작업과 연동(아래 "로그인 구현 후" 섹션 참고).

## 로그인 구현 후 해야 할 일 (FCM 인증 연동)

> 배경: 현재는 백엔드 `DEV_AUTH_BYPASS=true` 덕분에 인증 헤더 없이 토큰 등록이 됨. 로그인이 붙고 bypass가 false가 되면 인증 헤더 없는 요청은 401 → axios 인터셉터가 `/login`으로 리다이렉트함. 아래 작업으로 정식 인증 흐름으로 전환해야 함.

- [ ] **access token 저장 연결**: 로그인 성공 시 받은 access token을 `localStorage.setItem('token', ...)`에 저장. → `src/shared/apis/axios.ts`의 요청 인터셉터가 이미 `localStorage.token`을 읽어 `Authorization: Bearer`로 자동 부착하므로, 저장만 하면 FCM 토큰 등록 요청도 자동으로 인증됨.
- [ ] **`/login` 라우트 추가**: `axios.ts` 응답 인터셉터가 401 시 `window.location.href = '/login'`으로 보내는데 현재 해당 라우트가 없어 "No routes matched" 경고 발생. 로그인 페이지 라우트 등록 필요. (`src/routes/AppRouter.tsx`)
- [ ] **FCM 토큰 등록 시점 이동**: 설정 페이지 버튼 → 로그인/디바이스 연결 플로우 안으로 이동. "로그인 + 디바이스 연결 완료" 후 알림 허용 버튼을 띄우고, 허용 시 `requestFcmToken` → `postFcmToken` 호출. (현 `useFcmToken` 훅 그대로 재사용 가능)
- [ ] **토큰 갱신/만료 대응**: FCM 토큰은 변경될 수 있음. 로그인할 때마다 또는 앱 진입 시 토큰 재발급 후 서버에 재전송하는 정책 검토. 로그아웃 시 서버에서 토큰 제거(엔드포인트 백엔드와 협의).

- [ ] (보류) FCM foreground 알림 표시 - `title` 없는 메시지 대응. 현재 `useFcmToken.ts`의 `onForegroundMessage` 핸들러가 `if (... && title)` 조건이라 `notification.title`이 없으면 알림이 안 뜸. → 서버 연동 시 `data`-only 페이로드를 쓰면 `notification.title`이 비어 알림이 누락될 수 있음. `new Notification(title ?? '알림', ...)` 형태의 fallback 필요. 서버 페이로드 구조(`data` 키) 확정 후 background SW(`firebase-messaging-sw.js`)와 함께 반영.

# 커스텀 모달

- [ ] (보류) 모달(ConfirmModal/AlertModal) 키보드 접근성 - 포커스 트랩 적용. 모달이 열려도 Tab으로 뒤쪽 ModeForm까지 포커스가 빠져나감. 필요: ①초기 포커스(열릴 때 모달 내부로) ②포커스 트랩(Tab 순환을 모달 안에 가둠) ③닫을 때 포커스 복원. → useFocusTrap 훅 + ModalShell 공통 컴포넌트로 시도했으나 Tab이 여전히 배경까지 이동(모달이 Portal 미사용이라 DOM상 ModeForm과 형제 → 브라우저 기본 Tab 순서 유지됨이 원인 추정). 제대로 하려면 배경에 inert 속성 부여 또는 React Portal + 배경 aria-hidden 처리 필요. 추후 재작업.
