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

| 메서드 | 경로 | 요청 본문 | 응답 |
|--------|------|----------|------|
| GET | `/modes` | — | `ModeResponse[]` |
| POST | `/modes` | `ModeCreate` | `ModeResponse` |
| PATCH | `/modes/{mode_id}` | `ModeUpdate` | `ModeResponse` |
| DELETE | `/modes/{mode_id}` | — | `{}` |
| POST | `/modes/{mode_id}/activate` | — | `ModeResponse` |
| PUT | `/modes/{mode_id}/sounds` | `ModeSoundsUpdate` | `ModeResponse` |

> ⚠️ 모드 수정은 **PATCH**(PUT 아님), 활성화는 **POST**(PATCH 아님). 개별 소리 삭제 엔드포인트는 없고 `PUT /modes/{id}/sounds`로 전체 교체한다.

---

## Sounds (`/sounds`)

| 메서드 | 경로 | 쿼리/본문 | 응답 |
|--------|------|----------|------|
| GET | `/sounds/categories` | — | `SoundCategoryResponse[]` |
| GET | `/sounds` | `category_id?`, `keyword?`, `page=1`, `size=50` (max 200) | `SoundResponse[]` |
| GET | `/sounds/{sound_id}` | — | `SoundResponse` |

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
ModeResponse = {
  id, name, icon, is_active,
  sounds: SoundResponse[]   // default []
}
ModeCreate       = { name, icon, sound_ids: number[] }
ModeUpdate       = { name?, icon? }
ModeSoundsUpdate = { sound_ids: number[] }
```

### Sound

```ts
SoundCategoryResponse = { id, name }
SoundResponse = {
  id, name, risk_level, icon_url|null,
  category: SoundCategoryResponse   // 중첩 객체
}
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
