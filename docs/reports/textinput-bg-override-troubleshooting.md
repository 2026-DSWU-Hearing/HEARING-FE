# 트러블슈팅: TextInput 배경색 오버라이드가 적용되지 않는 문제

> 작성일: 2026-06-22
> 관련 파일: `src/shared/components/TextInput.tsx`, `src/pages/setting/components/device/DeviceNameEditModal.tsx`

## 1. 배경

설정 페이지의 "기기 이름 변경" 모달에서, 공용 컴포넌트 `TextInput`을 재사용했다.
디자인상 이 모달의 input만 배경색이 `neutral-700`(공용 기본값은 `neutral-900`)이어야 했다.

한 화면에서만 필요한 변형이므로, 공용 컴포넌트에 `bgColor` 같은 개별 prop을 추가하는 대신
**`inputClassName` 오버라이드 통로**를 하나 열어 호출부에서 `bg-neutral-700`을 주입하기로 했다.

```tsx
// TextInput.tsx (1차 시도)
className={`... bg-neutral-900 ... ${borderClassName} ${inputClassName}`}

// 모달
<TextInput inputClassName="bg-neutral-700 ..." />
```

## 2. 증상

`inputClassName="bg-neutral-700"`을 넘겼는데도 input 배경이 계속 `neutral-900`으로 렌더됐다.
className 문자열에서 `inputClassName`을 **뒤쪽**에 붙였음에도 오버라이드가 먹지 않았다.

## 3. 원인

**Tailwind 유틸리티 클래스 충돌은 `class` 속성의 문자열 순서가 아니라, 생성된 CSS 파일 내 규칙 정의 순서로 승자가 결정된다.**

- `bg-neutral-900`과 `bg-neutral-700`은 동일한 `background-color` 유틸 그룹이다.
- 두 클래스가 한 요소에 동시에 존재하면, CSS specificity는 동일(둘 다 단일 클래스 선택자)하므로
  **CSS에서 나중에 정의된 규칙**이 이긴다.
- Tailwind는 보통 색상 스케일 번호 순으로 규칙을 생성하여 `-900`이 `-700`보다 뒤에 정의됐고,
  그 결과 문자열 순서와 무관하게 `bg-neutral-900`이 항상 승리했다.

> 핵심: `class="bg-neutral-700 bg-neutral-900"`처럼 써도, CSS 정의 순서가 `-700 → -900`이면 `-900`이 적용된다.

## 4. 해결 과정

### 4-1. 1차 임시 해결 — 기본값에서 충돌 클래스 제거

기본 className에서 `bg-neutral-900`을 빼고, `inputClassName`의 **기본값**으로 옮겼다.

```tsx
inputClassName = 'bg-neutral-900',
// 기본 className에서는 bg-* 제거
className={`... border px-5 py-4 ... ${borderClassName} ${inputClassName}`}
```

→ 한 요소에 배경 클래스가 **하나만** 들어가 충돌이 사라졌다. 기존 사용처(ProfileEditPage, ModeForm)는
`inputClassName` 미전달 시 기본값 `bg-neutral-900`을 받아 동작 변화가 없었다.

**한계:** 곧이어 패딩(`py`)·radius(`rounded`)까지 오버라이드가 필요해졌다.
같은 충돌이 속성마다 반복되므로, 충돌 클래스를 속성별로 계속 기본값에서 빼내야 했다.
→ 공용 API가 번잡해지고 기본 className이 누더기가 되는 방향. 확장성이 나빴다.

### 4-2. 최종 해결 — tailwind-merge 도입

`tailwind-merge`의 `twMerge`는 **충돌하는 같은 유틸 그룹을 감지해 마지막 값만 남긴다.**
이를 통해 기본 className을 온전히 유지하면서 오버라이드를 항상 보장할 수 있다.

```bash
pnpm add tailwind-merge
```

```tsx
// TextInput.tsx (최종)
import { twMerge } from 'tailwind-merge';

className={twMerge(
  'body-lg-regular w-full rounded-xl border bg-neutral-900 px-5 py-4 text-primary outline-none transition-colors placeholder:text-tertiary',
  borderClassName, // 에러 시 border-state-alert가 border-neutral-800을 덮음
  inputClassName,  // 호출부 오버라이드 (맨 뒤 → 최종 승자)
)}
```

```tsx
// 모달 호출부
<TextInput
  inputClassName="h-[2.4375rem] bg-neutral-700 py-xs"
  ...
/>
```

- `bg-neutral-900` → `bg-neutral-700` (배경 그룹)
- `py-4` → `py-xs` (세로 패딩 그룹)
- `border-neutral-800` → `border-state-alert` (에러 시, border-color 그룹)

각 충돌 그룹에서 **뒤 인자가 자동으로 승리**한다. 기본 className에서 클래스를 빼낼 필요가 없어졌다.

## 5. 결과

- input의 배경·패딩·radius·높이를 호출부 `inputClassName` 한 곳에서 충돌 걱정 없이 오버라이드 가능.
- 기존 사용처(ProfileEditPage, ModeForm)는 `inputClassName` 미전달 시 기본 스타일 그대로 → 영향 없음.
- 타입 체크(`tsc --noEmit`)·ESLint 통과.

## 6. 배운 점 / 재발 방지

- **Tailwind 클래스 충돌의 승자는 문자열 순서가 아니라 CSS 정의 순서다.** 같은 유틸 그룹을
  한 요소에 두 번 쓰면 의도대로 오버라이드되지 않을 수 있다.
- "기본값에서 충돌 클래스 빼기"는 1개 속성일 땐 가볍지만, 오버라이드 대상이 2개를 넘어가면
  급격히 나빠진다. 이 시점이 `tailwind-merge` 도입 신호다.
- 공용 컴포넌트가 "기본 스타일 + 호출부 className 오버라이드" 패턴을 쓴다면 `twMerge`로 병합하는 것을
  기본 관용구로 삼는다. 조건부 클래스가 많아지면 `cn = (...args) => twMerge(clsx(args))` 헬퍼 도입을 고려.
