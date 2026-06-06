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

> `baseURL`은 `http://localhost:8000`(prefix 없음)이라 users/devices/notifications 등은 `/users/me`처럼 짧게 적으면 된다.
> 로그인 시 `localStorage`에 `'token'`만 저장하면 이후 모든 요청에 토큰이 자동으로 실린다.

> ⚠️ **modes/sounds 만 임시 prefix(`/api/v1`)가 필요**하다. baseURL 에 `/api/v1` 을 붙이면 prefix 없는 도메인이 깨지므로,
> modes/sounds 경로는 `apis/endpoints.ts` 에서 `VITE_API_PREFIX`(.env)를 붙여 조립한다.
> 서버가 prefix 를 제거하면 `.env` 의 `VITE_API_PREFIX` 만 `""` 로 바꾸면 끝.

## 2. 핵심: 프론트 "추측 모양" vs 백엔드 "진짜 모양"

이번 정비의 본질은 프론트가 가정한 데이터 모양을 백엔드 실제와 일치시킨 것이다.

### 모드(Mode)

```
✅ 백엔드 실제 (openapi.json)
GET /modes  → { modes: [ { mode_id, name, icon, is_active } ] }   ← 객체로 감싸고, sounds 없음
GET /modes/{id} → { mode_id, name, icon, is_active,
                    sounds: [ { sound_id, name, category } ] }     ← 상세에만 sounds(category 는 문자열)
```

> ⚠️ 응답이 동작마다 다르다. 생성·수정은 `{ mode_id, name, icon, sounds:[{sound_id,name}] }`(is_active 없음),
> 활성화는 `{ mode_id, is_active }`(name/icon/sounds 없음), 소리교체는 `{ mode_id, sounds:[{sound_id,name}] }`.

### 소리(Sound)

```
✅ 백엔드 실제
GET /sounds  → { sounds: [ { sound_id, name, category_id, category_name } ] }   ← 목록은 플랫
GET /sounds/categories → { categories: [ { category_id, name } ] }
GET /sounds/{id} → { id, name, risk_level, icon_url, category: { id, name } }   ← 단건만 id + 중첩
```

**기억할 4가지**
1. 식별자는 대부분 **`mode_id` / `sound_id` / `category_id`**(snake). 단, `GET /sounds/{id}` 단건만 예외적으로 `id`.
2. 목록은 **객체로 감싼다**: `{ modes: [] }`, `{ sounds: [] }`, `{ categories: [] }`.
3. 소리 목록은 **플랫**(`category_name`), 단건만 **중첩**(`category: { id, name }`).
4. 모드 응답은 **동작별로 다른 스키마**다. 단일 `ModeResponse` 가정 금지.

> 이 차이를 `types/modeTypes.ts`, `types/soundTypes.ts`에 정확히 적어두면, 어긋난 나머지 코드를
> TypeScript가 컴파일 에러로 잡아준다. → "타입부터 고치고 빌드 에러 따라가기" 전략.

## 3. modes / sounds API 전체 목록

`src/pages/home/apis/`

> ⚠️ 경로 prefix: 현재 서버는 modes/sounds 에 임시로 `/api/v1` 을 붙인다. 코드는 `apis/endpoints.ts` 에서
> `VITE_API_PREFIX`(.env) 로 prefix 를 조립하므로, 서버가 prefix 를 떼면 `.env` 한 줄만 `""` 로 바꾸면 된다.

| 동작 | 함수 | 메서드 + 경로 | 비고 |
|------|------|--------------|------|
| 모드 목록 조회 | `getModes` | `GET /modes` | `{ modes: [] }` |
| 모드 상세 조회 | `getModeDetail` | `GET /modes/{id}` | 상세는 sounds 포함 |
| 모드 생성 | `postMode` | `POST /modes` | 본문 `{ name, icon, sounds: [{sound_id, name?}] }` |
| 모드 수정 | `putMode` | **`PUT`** `/modes/{id}` | ⚠️ 전체 교체(name·icon·sounds 모두 보냄) |
| 모드 활성화 | `patchActivateMode` | **`PATCH`** `/modes/{id}/activate` | 응답 `{ mode_id, is_active }` |
| 모드 삭제 | `deleteMode` | `DELETE /modes/{id}` | |
| 소리 목록 교체 | `putModeSounds` | `PUT /modes/{id}/sounds` | 본문 `{ sounds: [{sound_id, name?}] }` |
| 소리 1개 삭제 | `deleteModeSound` | `DELETE /modes/{id}/sounds/{soundId}` | ✅ 전용 API 있음 |
| 전체 소리 조회 | `getSounds` | `GET /sounds` | `{ sounds: [] }` |
| 카테고리 조회 | `getSoundCategories` | `GET /sounds/categories` | `{ categories: [] }` |

> **메서드**: 수정은 **PUT**, 활성화는 **PATCH**. (이전 문서가 반대로 적었던 부분을 정정함.)
>
> **모드 수정(PUT)은 전체 교체**다. 이름/아이콘만 바꿀 때도 `sounds` 를 함께 보내야 하므로, 수정 페이지는
> 기존 상세의 소리를 `{ sound_id, name }` 로 변환해 그대로 실어 보낸다.
>
> **소리 삭제**: 전용 엔드포인트로 `soundId` 하나만 넘긴다. 단, 서버는 "모드당 소리 최소 1개" 규칙이 있어
> 마지막 1개를 지우면 422(`At least 1 sound required`)가 난다.

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
      // 캐시는 { modes: [...] } 객체다. 생성 응답엔 is_active 가 없으니 목록 원소 모양으로 재구성해 추가한다.
      const newItem = { mode_id: data.mode_id, name: data.name, icon: data.icon, is_active: false };
      queryClient.setQueryData(['modes'], (old) =>
        old ? { modes: [...old.modes, newItem] } : { modes: [newItem] },
      );
    },
  });
};
```

- `queryKey: ['modes']`는 "이 데이터의 주소". 조회 훅이 이 키로 저장하면, 변경 훅이 같은 키 캐시를 직접 수정 → 재요청 없이 화면 갱신.
- 상세 캐시는 `['modes', id]`처럼 id를 붙여 모드별로 따로 저장한다.
- ⚠️ **응답이 동작별로 부분적**이라 캐시를 통째 교체하면 안 된다. 활성화 응답엔 name/icon 이, 수정 응답엔 is_active 가 없다.
  - 활성화/수정: 기존 캐시에 **변경분만 병합**(`{ ...old, ...일부필드 }`).
  - 소리교체/소리삭제: 상세 응답이 목록 상세(category 포함)와 모양이 달라, 그냥 `invalidateQueries(['modes', id])` 로 재요청한다.

## 5. 사용 예: "새 모드 만들기" 전체 흐름

```
1. 사용자가 폼 작성 → "저장" 클릭
2. useModeCreatePage:
   - 선택한 소리들을 sounds 배열로 변환  ← 백엔드가 원하는 모양 [{ sound_id, name }]
   - createMode({ name, icon, sounds })
3. usePostMode (useMutation) → postMode 실행
4. postMode: axios가 POST {prefix}/modes
5. 백엔드가 생성된 모드(ModeWriteResponse) 반환
6. onSuccess: ['modes'] 캐시({ modes: [] })에 목록 원소 모양으로 추가
7. useGetModes를 쓰는 ModeList 자동 리렌더 → 새 모드 등장
8. navigate('/')로 홈 이동
```

> **데이터 변환 지점(2번)**: 화면(소리 목록)에서는 소리를 `{ sound_id, name, category_id, category_name }` 로 다루지만,
> 생성 API는 `sounds: [{ sound_id, name }]` 객체 배열을 원한다. 폼 제출 훅에서
> `selectedSounds.map(s => ({ sound_id: s.sound_id, name: s.name }))` 로 변환한다.
> "화면용 모양"과 "전송용 모양"이 다를 때 훅이 다리 역할을 한다.

## 한 줄 요약

백엔드 Swagger를 정답지 삼아 → 프론트 타입(데이터 모양)을 실제와 일치 → API 함수의 경로·메서드·본문을 맞춤
→ 그 타입을 쓰는 컴포넌트/훅/캐시를 줄줄이 정비. TypeScript가 "어디가 안 맞는지" 안내판 역할을 했다.

## 알아두면 좋은 것 (TODO / 주의)

- `axios.ts`의 401 → `/login` 리다이렉트는 **임시 비활성화** 중. 백엔드 auth(register/login 현재 500) 복구 후 원복할 것.
- 로그인 페이지(`src/pages/auth/Login.tsx`)는 최소 UI만 있음. 실제 `POST /auth/login` 연동 + 토큰 저장은 미구현.
- `/modes`(브라우저 라우트)와 `/modes`(백엔드 API 경로)는 이름만 같고 완전히 별개다. 혼동 주의.
