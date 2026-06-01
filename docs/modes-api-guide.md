# modes / sounds API 로직 가이드

> 이 문서는 홈(소리 필터링) 도메인의 modes/sounds API가 **프론트에서 어떻게 흐르는지**를 설명한다.
> 백엔드 실제 스펙은 Swagger(`http://localhost:8000/docs`)가 정답지다. 이 문서는 그 스펙에 맞춘 프론트 구현을 정리한 것이다.

## 0. 큰 그림: 4개의 층

API는 4개 층으로 나뉘며, 각 층은 한 가지 책임만 갖는다.

```
[화면 컴포넌트]   ← 사용자가 보는 것 (ModeList, SoundCard…)
       ↕  "데이터 줘 / 바꿔줘"
[커스텀 훅]       ← TanStack Query로 데이터 상태·캐시 관리 (useGetModes, usePostMode…)
       ↕  "서버 함수 호출"
[API 함수]        ← axios로 실제 HTTP 요청 (getModes, postMode…)  → src/pages/home/apis/
       ↕  HTTP
[백엔드 서버]     ← FastAPI (localhost:8000)
```

층을 나누는 이유: 컴포넌트는 "어떻게 가져오는지" 몰라도 된다. 훅만 호출하면 데이터·로딩·에러가 나온다.
API 주소가 바뀌어도 **API 함수 한 곳만** 고치면 된다.

## 1. axios 인스턴스 — 모든 요청의 공통 통로

`src/shared/apis/axios.ts`

```ts
const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,  // .env의 http://localhost:8000
  withCredentials: true,
});
```

- **요청 인터셉터**: 요청 직전 `localStorage`의 `'token'`을 꺼내 `Authorization: Bearer ...` 헤더에 자동 주입.
- **응답 인터셉터**: 401이면 원래 `/login`으로 리다이렉트. (⚠️ 백엔드 auth 복구 전까지 **임시 비활성화** 상태 — 파일 내 TODO 참고)

> `baseURL` 덕분에 API 함수는 `'/modes'`처럼 짧은 경로만 적으면 `http://localhost:8000/modes`로 요청된다.
> 로그인 시 `localStorage`에 `'token'`만 저장하면 이후 모든 요청에 토큰이 자동으로 실린다.

## 2. 핵심: 프론트 "추측 모양" vs 백엔드 "진짜 모양"

이번 정비의 본질은 프론트가 가정한 데이터 모양을 백엔드 실제와 일치시킨 것이다.

### 모드(Mode)

```
❌ 프론트 추측                       ✅ 백엔드 실제 (Swagger)
{ modes: [                          [                       ← 배열을 직접 반환
    { mode_id: 1, ... }               { id: 1,              ← id (mode_id 아님)
] }                                     name, icon, is_active,
                                        sounds: [...] }      ← 소리도 함께 옴
                                    ]
```

### 소리(Sound)

```
❌ 프론트 추측                       ✅ 백엔드 실제
{ sound_id: 1,                      { id: 1,                ← id
  category_name: "위험" }             name, risk_level, icon_url,
                                      category: { id, name } } ← 중첩 객체
```

**기억할 3가지 차이**
1. `mode_id` / `sound_id` → 전부 **`id`**
2. 목록 응답이 `{ modes: [...] }` 객체가 아니라 **배열 직접**
3. 카테고리가 `category_name` 문자열이 아니라 **`category: { id, name }` 객체**

> 이 차이를 `types/modeTypes.ts`, `types/soundTypes.ts`에 정확히 적어두면, 어긋난 나머지 코드를
> TypeScript가 컴파일 에러로 잡아준다. → "타입부터 고치고 빌드 에러 따라가기" 전략.

## 3. modes / sounds API 전체 목록

`src/pages/home/apis/`

| 동작 | 함수 | 메서드 + 경로 | 비고 |
|------|------|--------------|------|
| 모드 목록 조회 | `getModes` | `GET /modes` | 배열 반환 |
| 모드 상세 조회 | `getModeDetail` | `GET /modes/{id}` | 목록과 같은 모양 |
| 모드 생성 | `postMode` | `POST /modes` | 본문 `{ name, icon, sound_ids: [] }` |
| 모드 수정 | `putMode` | **`PATCH`** `/modes/{id}` | ⚠️ PUT 아님. 이름/아이콘만 |
| 모드 활성화 | `patchActivateMode` | **`POST`** `/modes/{id}/activate` | ⚠️ PATCH 아님 |
| 모드 삭제 | `deleteMode` | `DELETE /modes/{id}` | |
| 소리 목록 교체 | `putModeSounds` | `PUT /modes/{id}/sounds` | 본문 `{ sound_ids: [] }` |
| 소리 1개 삭제 | `deleteModeSound` | ⚠️ **전용 API 없음** | "남길 id들로 전체 교체"로 우회 |
| 전체 소리 조회 | `getSounds` | `GET /sounds` | 배열 |
| 카테고리 조회 | `getSoundCategories` | `GET /sounds/categories` | 배열 |

> **메서드 함정**: 함수 이름은 `putMode`인데 백엔드는 `PATCH`를 받는다. 이름만 보고 PUT을 보내면 405가 난다.
> 함수명은 유지하고 내부 메서드만 정정했다.
>
> **`deleteModeSound` 우회**: 백엔드엔 "소리 1개만 빼기" API가 없다. 그래서 "지금 담긴 소리 중 1개를 빼려면,
> 남길 나머지 id들을 `PUT /modes/{id}/sounds`로 통째로 보낸다." (부분 삭제 대신 전체 교체)

## 4. 커스텀 훅 층

`src/pages/home/hooks/`

### (A) 조회 훅 — `useQuery`

```ts
export const useGetModes = () => {
  return useQuery({
    queryKey: ['modes'],   // 이 데이터의 "이름표"(캐시 키)
    queryFn: getModes,
  });
};
```
컴포넌트: `const { data, isLoading, isError } = useGetModes();`

### (B) 변경 훅 — `useMutation`

생성/수정/삭제. 성공 시 캐시를 갱신해 화면이 자동 업데이트된다.

```ts
export const usePostMode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postMode,
    onSuccess: (data) => {
      // 서버가 돌려준 새 모드를 ['modes'] 캐시 배열 끝에 추가
      queryClient.setQueryData(['modes'], (old) => [...old, data]);
    },
  });
};
```

- `queryKey: ['modes']`는 "이 데이터의 주소". 조회 훅이 이 키로 저장하면, 변경 훅이 같은 키 캐시를 직접 수정 → 재요청 없이 화면 갱신.
- 상세 캐시는 `['modes', id]`처럼 id를 붙여 모드별로 따로 저장한다.
- 백엔드가 **완전한 모드 객체**(sounds 포함)를 주므로, 캐시 갱신이 `setQueryData(['modes', id], data)` 한 줄로 단순해졌다. (예전의 category 복원 병합 로직 제거)

## 5. 사용 예: "새 모드 만들기" 전체 흐름

```
1. 사용자가 폼 작성 → "저장" 클릭
2. useModeCreatePage:
   - 선택한 소리들을 sound_ids 배열로 변환  ← 백엔드가 원하는 모양
   - createMode({ name, icon, sound_ids })
3. usePostMode (useMutation) → postMode 실행
4. postMode: axios가 POST http://localhost:8000/modes
5. 백엔드가 생성된 모드(완전한 객체) 반환
6. onSuccess: ['modes'] 캐시 배열에 추가
7. useGetModes를 쓰는 ModeList 자동 리렌더 → 새 모드 등장
8. navigate('/')로 홈 이동
```

> **데이터 변환 지점(2번)**: 화면에서는 소리를 `{ id, name, category }` 객체로 다루지만,
> 생성 API는 `sound_ids: [1,2,3]`처럼 id만 원한다. 폼 제출 훅에서 `selectedSounds.map(s => s.id)`로 변환한다.
> "화면용 모양"과 "전송용 모양"이 다를 때 훅이 다리 역할을 한다.

## 한 줄 요약

백엔드 Swagger를 정답지 삼아 → 프론트 타입(데이터 모양)을 실제와 일치 → API 함수의 경로·메서드·본문을 맞춤
→ 그 타입을 쓰는 컴포넌트/훅/캐시를 줄줄이 정비. TypeScript가 "어디가 안 맞는지" 안내판 역할을 했다.

## 알아두면 좋은 것 (TODO / 주의)

- `axios.ts`의 401 → `/login` 리다이렉트는 **임시 비활성화** 중. 백엔드 auth(register/login 현재 500) 복구 후 원복할 것.
- 로그인 페이지(`src/pages/auth/Login.tsx`)는 최소 UI만 있음. 실제 `POST /auth/login` 연동 + 토큰 저장은 미구현.
- `/modes`(브라우저 라우트)와 `/modes`(백엔드 API 경로)는 이름만 같고 완전히 별개다. 혼동 주의.
