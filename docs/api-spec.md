# API 명세 (Backend Reference)

> 백엔드 `HEARING-BE` (FastAPI)의 실제 엔드포인트 명세. **출처: Swagger / OpenAPI** (`http://localhost:8000/docs`, `http://localhost:8000/openapi.json`).
> 이 문서는 "백엔드가 무엇을 제공하는지"의 레퍼런스다. 프론트에서 어떻게 쓰는지는 [@docs/modes-api-guide.md](./modes-api-guide.md) 참고.

## 공통 사항

- Base URL (로컬): `http://localhost:8000` — **`/api/v1` 같은 prefix 없음**. 경로가 루트에 바로 붙는다.
- 인증: 대부분 엔드포인트가 `Authorization` 헤더(`Bearer <access_token>`)를 받는다. OpenAPI 상으론 optional(`required: false`)이지만, 런타임에선 토큰 없으면 401을 반환하는 엔드포인트가 있다(예: `GET /modes`).
- 목록 조회는 객체로 감싸지 않고 **배열을 직접 반환**한다.
- 식별자 필드는 `mode_id`/`sound_id`가 아니라 모두 **`id`**.

---

## Auth (`/auth`)

| 메서드 | 경로 | 요청 본문 | 응답 |
|--------|------|----------|------|
| POST | `/auth/register` | `RegisterRequest` | `UserResponse` |
| POST | `/auth/login` | `LoginRequest` | `TokenResponse` |
| POST | `/auth/google` | `GoogleLoginRequest` | `TokenResponse` |
| POST | `/auth/refresh` | `RefreshRequest` | `TokenResponse` |
| POST | `/auth/logout` | — | `{}` |
| POST | `/auth/forgot-password` | `ForgotPasswordRequest` | `{}` |
| POST | `/auth/reset-password` | `ResetPasswordRequest` | `{}` |

---

## Users (`/users`)

| 메서드 | 경로 | 요청 본문 | 응답 |
|--------|------|----------|------|
| GET | `/users/me` | — | `UserResponse` |
| PATCH | `/users/me` | `UserUpdate` | `UserResponse` |
| PATCH | `/users/me/haptic` | `HapticUpdate` | `UserResponse` |
| PATCH | `/users/me/do-not-disturb` | `DoNotDisturbUpdate` | `UserResponse` |
| POST | `/users/me/fcm-token` | `FcmTokenUpdate` | `UserResponse` |
| PATCH | `/users/me/agreement` | `AgreementUpdate` | `UserResponse` |

---

## Modes (`/modes`)

> 경로 표기는 prefix 없는 최종 형태(`/modes/...`) 기준이다. **현재 서버는 임시로 `/api/v1` prefix를 사용 중**이며, 서버에서 곧 제거할 예정이다.

| 메서드 | 경로 | 요청 본문 | 응답 |
|--------|------|----------|------|
| GET | `/modes` | — | `ModeListResponse` |
| POST | `/modes` | `ModeCreateRequest` | `ModeWriteResponse` |
| GET | `/modes/{mode_id}` | — | `ModeDetailResponse` |
| PUT | `/modes/{mode_id}` | `ModeUpdateRequest` | `ModeWriteResponse` |
| DELETE | `/modes/{mode_id}` | — | `{}` |
| PATCH | `/modes/{mode_id}/activate` | — | `ModeActivateResponse` |
| PUT | `/modes/{mode_id}/sounds` | `ModeSoundsUpdateRequest` | `ModeSoundsResponse` |
| DELETE | `/modes/{mode_id}/sounds/{sound_id}` | — | `{}` |

> ⚠️ 모드 수정은 **PUT**(PATCH 아님), 활성화는 **PATCH**(POST 아님).
> ⚠️ 응답이 동작마다 다른 스키마다(목록/상세/생성·수정/활성화/소리교체). 단일 `ModeResponse`가 아니다.
> ⚠️ 식별자는 **`mode_id` / `sound_id`**(스네이크). 목록 응답은 `{ modes: [...] }`로 감싼다.
> ✅ 개별 소리 삭제 전용 엔드포인트가 **있다**(`DELETE /modes/{mode_id}/sounds/{sound_id}`).

---

## Sounds (`/sounds`)

> 경로 표기는 prefix 없는 최종 형태 기준. 현재 서버는 임시로 `/api/v1` prefix 사용 중(곧 제거 예정).

| 메서드 | 경로 | 쿼리/본문 | 응답 |
|--------|------|----------|------|
| GET | `/sounds/categories` | — | `CategoryListResponse` |
| GET | `/sounds` | `category_id?`, `keyword?`, `page=1`, `size=50` (max 200) | `SoundListResponse` |
| GET | `/sounds/{sound_id}` | — | `SoundResponse` |

> ⚠️ 목록(`SoundListResponse`)과 단건(`SoundResponse`)의 모양이 다르다.
> - 목록 원소(`SoundItem`)는 **플랫**: `{ sound_id, name, category_id, category_name }` (risk_level·icon_url 없음).
> - 단건(`SoundResponse`)은 **중첩 + `id`**: `{ id, name, risk_level, icon_url, category: { id, name } }`.
> ⚠️ 목록은 `{ sounds: [...] }`, 카테고리는 `{ categories: [...] }`로 감싼다.

---

## Devices (`/devices`)

| 메서드 | 경로 | 요청 본문 | 응답 |
|--------|------|----------|------|
| GET | `/devices` | — | `DeviceResponse[]` |
| POST | `/devices` | `DeviceCreate` | `DeviceResponse` |
| PATCH | `/devices/{device_id}` | `DeviceUpdate` | `DeviceResponse` |
| DELETE | `/devices/{device_id}` | — | `{}` |
| POST | `/devices/{device_id}/detections` | `DetectionCreate` | `{}` |

> `POST /devices/{id}/detections` 는 웨어러블 또는 HEARING-AI-SE가 호출. JWT의 source 필드로 caller를 식별한다.

---

## Notifications (`/notifications`)

| 메서드 | 경로 | 쿼리 | 응답 |
|--------|------|------|------|
| GET | `/notifications` | `page=1`, `size=30` (max 100) | `NotificationResponse[]` |
| PATCH | `/notifications/{notification_id}/read` | — | `NotificationResponse` |
| DELETE | `/notifications/{notification_id}` | — | `{}` |

---

## Health

| 메서드 | 경로 | 응답 |
|--------|------|------|
| GET | `/health` | `{ "status": "ok" }` (DB 상태는 검사하지 않는 단순 체크) |

---

## 스키마 (Schemas)

### Auth / User

```ts
RegisterRequest      = { email, password, nickname, disability_type?, terms_agreed }
LoginRequest         = { email, password }
GoogleLoginRequest   = { id_token }
RefreshRequest       = { refresh_token }
ForgotPasswordRequest= { email }
ResetPasswordRequest = { token, new_password }
TokenResponse        = { access_token, refresh_token, token_type = "bearer" }

UserResponse = { id, email, nickname, disability_type|null, haptic_strength, do_not_disturb }
UserUpdate           = { nickname?, disability_type? }
HapticUpdate         = { haptic_strength }
DoNotDisturbUpdate   = { do_not_disturb }
FcmTokenUpdate       = { fcm_token }
AgreementUpdate      = { terms_agreed }
```

### Mode

```ts
// ── 요청 ──
// sounds 배열의 원소는 id 숫자가 아니라 객체다(name 은 optional).
ModeSoundInput          = { sound_id: number, name?: string|null }
ModeCreateRequest       = { name, icon, sounds: ModeSoundInput[] }   // 세 필드 모두 required
ModeUpdateRequest       = { name, icon, sounds: ModeSoundInput[] }   // PUT — 전체 교체, 세 필드 모두 required
ModeSoundsUpdateRequest = { sounds: ModeSoundInput[] }

// ── 응답 (동작마다 다름) ──
ModeListItem    = { mode_id, name, icon, is_active }                 // 목록 원소 (sounds 없음)
ModeListResponse = { modes: ModeListItem[] }                        // GET /modes

ModeDetailSoundItem = { sound_id, name, category }                  // category 는 문자열
ModeDetailResponse  = { mode_id, name, icon, is_active, sounds: ModeDetailSoundItem[] }  // GET /modes/{id}

ModeSoundItem    = { sound_id, name }                               // 쓰기 응답의 소리 원소(가벼움)
ModeWriteResponse = { mode_id, name, icon, sounds: ModeSoundItem[] }  // POST·PUT /modes (is_active 없음)

ModeActivateResponse = { mode_id, is_active }                       // PATCH activate (name/icon/sounds 없음!)
ModeSoundsResponse   = { mode_id, sounds: ModeSoundItem[] }         // PUT /modes/{id}/sounds
```

### Sound

```ts
// 목록 — 플랫, sound_id / category_id / category_name (snake)
SoundItem         = { sound_id, name, category_id, category_name }
SoundListResponse = { sounds: SoundItem[] }                        // GET /sounds

// 카테고리 목록 — category_id (snake)
CategoryItem         = { category_id, name }
CategoryListResponse = { categories: CategoryItem[] }              // GET /sounds/categories

// 단건 — 중첩 + id (예외적으로 snake 아님)
SoundCategoryResponse = { id, name }
SoundResponse = {
  id, name, risk_level, icon_url|null,
  category: SoundCategoryResponse   // 중첩 객체
}                                                                  // GET /sounds/{id}
```

### Device / Detection

```ts
DeviceResponse = { id, nickname, mac_address, battery_level|null, is_connected, last_seen_at|null }
DeviceCreate   = { nickname, mac_address }
DeviceUpdate   = { nickname?, battery_level?, is_connected? }

DetectionCreate = {
  sound_id?|null, sound_name, sound_category, risk_level,
  confidence?|null, detected_at, latitude?|null, longitude?|null
}
```

### Notification

```ts
NotificationResponse = {
  id, device_id, sound_id|null, sound_name, sound_category,
  risk_level, source, confidence|null, location|null, detected_at, is_read
}
```

---

> 명세가 변경되면 Swagger를 다시 확인해 이 문서를 갱신할 것. (`http://localhost:8000/openapi.json`)
