# Hear:ing API Spec

## 공통 사항

- **Base URL**: `http://localhost:8000`
- **인증**: 대부분의 엔드포인트는 `Authorization: Bearer <access_token>` 헤더 필요. (auth 일부 제외)
- **Content-Type**: 요청 바디가 있는 경우 `application/json`
- **공통 에러 응답**
  - `422 Validation Error` → `HTTPValidationError`
    ```jsonc
    {
      "detail": [
        {
          "loc": ["body", "email"],
          "msg": "field required",
          "type": "value_error.missing",
        },
      ],
    }
    ```

### 공통 응답 스키마

#### TokenResponse

| 필드            | 타입   | 비고               |
| --------------- | ------ | ------------------ |
| `access_token`  | string | required           |
| `refresh_token` | string | required           |
| `token_type`    | string | default `"bearer"` |

#### UserResponse

| 필드              | 타입           | 비고     |
| ----------------- | -------------- | -------- |
| `id`              | integer        | required |
| `email`           | string         | required |
| `nickname`        | string         | required |
| `disability_type` | string \| null | required |
| `haptic_strength` | integer        | required |
| `do_not_disturb`  | boolean        | required |
| `push_enabled`    | boolean        | required |
| `terms_agreed`    | boolean        | required |

---

## 1. Auth (`/auth`)

| 메서드 | 경로                    | 설명                  | 인증                    |
| ------ | ----------------------- | --------------------- | ----------------------- |
| POST   | `/auth/register`        | 회원가입              | ❌                      |
| POST   | `/auth/login`           | 로그인                | ❌                      |
| GET    | `/auth/email-available` | 이메일 사용 가능 여부 | ❌                      |
| POST   | `/auth/google`          | 구글 로그인           | ❌                      |
| POST   | `/auth/guest`           | 게스트 로그인         | ❌                      |
| POST   | `/auth/refresh`         | 토큰 재발급           | ❌ (refresh_token 사용) |
| POST   | `/auth/logout`          | 로그아웃              | ✅                      |

### POST `/auth/register`

- **Request Body** (`RegisterRequest`)

  | 필드              | 타입           | 필수 |
  | ----------------- | -------------- | ---- |
  | `email`           | string         | ✅   |
  | `password`        | string         | ✅   |
  | `nickname`        | string         | ✅   |
  | `disability_type` | string \| null | ❌   |
  | `terms_agreed`    | boolean        | ✅   |

- **Response** `200` → `UserResponse`

### POST `/auth/login`

- **Request Body** (`LoginRequest`)

  | 필드       | 타입   | 필수 |
  | ---------- | ------ | ---- |
  | `email`    | string | ✅   |
  | `password` | string | ✅   |

- **Response** `200` → `TokenResponse`

### GET `/auth/email-available`

- **Query Params**

  | 이름    | 타입   | 필수 |
  | ------- | ------ | ---- |
  | `email` | string | ✅   |

- **Response** `200` → `EmailAvailabilityResponse` — `{ available: boolean }`

### POST `/auth/google`

- **Request Body** (`GoogleLoginRequest`)

  | 필드       | 타입   | 필수 |
  | ---------- | ------ | ---- |
  | `id_token` | string | ✅   |

- **Response** `200` → `TokenResponse`

### POST `/auth/guest`

- **Request Body**: 없음
- **Response** `200` → `TokenResponse`

### POST `/auth/refresh`

- **Request Body** (`RefreshRequest`)

  | 필드            | 타입   | 필수 |
  | --------------- | ------ | ---- |
  | `refresh_token` | string | ✅   |

- **Response** `200` → `TokenResponse`

### POST `/auth/logout`

- **Request Body**: 없음
- **Response** `200`

---

## 2. Users (`/users`)

> 모든 엔드포인트 인증 필요 (`Authorization` 헤더). 응답은 별도 명시 없으면 `UserResponse`.

| 메서드 | 경로                       | 설명             |
| ------ | -------------------------- | ---------------- |
| GET    | `/users/me`                | 내 정보 조회     |
| PATCH  | `/users/me`                | 내 정보 수정     |
| PATCH  | `/users/me/haptic`         | 진동 세기 수정   |
| PATCH  | `/users/me/do-not-disturb` | 방해금지모드     |
| PATCH  | `/users/me/push-enabled`   | 푸시 알림 on/off |
| POST   | `/users/me/fcm-token`      | FCM 토큰 등록    |
| PATCH  | `/users/me/agreement`      | 약관 동의 수정   |

### GET `/users/me`

- **Response** `200` → `UserResponse`

### PATCH `/users/me`

- **Request Body** (`UserUpdate`)

  | 필드              | 타입           | 필수 |
  | ----------------- | -------------- | ---- |
  | `nickname`        | string \| null | ❌   |
  | `disability_type` | string \| null | ❌   |

- **Response** `200` → `UserResponse`

### PATCH `/users/me/haptic`

- **Request Body** (`HapticUpdate`)

  | 필드              | 타입    | 필수 |
  | ----------------- | ------- | ---- |
  | `haptic_strength` | integer | ✅   |

- **Response** `200` → `UserResponse`

### PATCH `/users/me/do-not-disturb`

- **Request Body** (`DoNotDisturbUpdate`)

  | 필드             | 타입    | 필수 |
  | ---------------- | ------- | ---- |
  | `do_not_disturb` | boolean | ✅   |

- **Response** `200` → `UserResponse`

### PATCH `/users/me/push-enabled`

- **Request Body** (`PushEnabledUpdate`)

  | 필드           | 타입    | 필수 |
  | -------------- | ------- | ---- |
  | `push_enabled` | boolean | ✅   |

- **Response** `200` → `UserResponse`

### POST `/users/me/fcm-token`

- **Request Body** (`FcmTokenUpdate`)

  | 필드        | 타입   | 필수 |
  | ----------- | ------ | ---- |
  | `fcm_token` | string | ✅   |

- **Response** `200` → `UserResponse`

### PATCH `/users/me/agreement`

> 기본값이 `false`로 변경됨 (기존 테스트 편의용 `true` 기본값 제거). 온보딩에서 필수 약관 동의 완료 시 `terms_agreed: true`로 호출 필요.

- **Request Body** (`AgreementUpdate`)

  | 필드           | 타입    | 필수 |
  | -------------- | ------- | ---- |
  | `terms_agreed` | boolean | ✅   |

- **Response** `200` → `UserResponse`

---

## 3. Modes (`/modes`)

> 모든 엔드포인트 인증 필요.

| 메서드 | 경로                                 | 설명                     |
| ------ | ------------------------------------ | ------------------------ |
| GET    | `/modes`                             | 모드 목록 조회           |
| POST   | `/modes`                             | 모드 생성                |
| GET    | `/modes/icons`                       | 모드 아이콘 목록         |
| GET    | `/modes/{mode_id}`                   | 모드 상세 조회           |
| PUT    | `/modes/{mode_id}`                   | 모드 전체 수정           |
| DELETE | `/modes/{mode_id}`                   | 모드 삭제                |
| PATCH  | `/modes/{mode_id}/activate`          | 모드 활성화              |
| PUT    | `/modes/{mode_id}/sounds`            | 모드 소리 목록 전체 교체 |
| PATCH  | `/modes/{mode_id}/sounds/{sound_id}` | 모드 내 개별 소리 on/off |

### GET `/modes`

- **Response** `200` → `ModeListResponse` — `{ modes: ModeListItem[] }`
  - `ModeListItem`: `{ mode_id, name, icon, is_active }`

### POST `/modes`

- **Request Body** (`ModeCreateRequest`)

  | 필드                                                                        | 타입                        | 필수 |
  | --------------------------------------------------------------------------- | --------------------------- | ---- |
  | `name`                                                                      | string                      | ✅   |
  | `icon`                                                                      | string                      | ✅   |
  | `sounds`                                                                    | array&lt;ModeSoundInput&gt; | ✅   |

  - `ModeSoundInput`: `{ sound_id: integer (required), name?: string\|null }`

- **Response** `200` → `ModeWriteResponse`
  - `{ mode_id, name, icon, sounds: ModeSoundItem[] }`, `ModeSoundItem`: `{ sound_id, name }`

### GET `/modes/icons`

- **Response** `200` → `ModeIconListResponse`
  - `icons[]` = `ModeIconItem`: `{ mode_id, name_ko, name_key, icon_key }`

### GET `/modes/{mode_id}`

- **Path Params**: `mode_id` (integer, required)
- **Response** `200` → `ModeDetailResponse`
  ```jsonc
  {
    "mode_id": 1,
    "name": "수면",
    "icon": "moon",
    "is_active": true,
    "sounds": [
      {
        "sound_id": 10,
        "name": "초인종",
        "category": "가정",
        "is_active": true,
      },
    ],
  }
  ```

### PUT `/modes/{mode_id}`

- **Path Params**: `mode_id` (integer, required)
- **Request Body** (`ModeUpdateRequest`) — 구조는 `ModeCreateRequest`와 동일

  | 필드     | 타입                        | 필수 |
  | -------- | --------------------------- | ---- |
  | `name`   | string                      | ✅   |
  | `icon`   | string                      | ✅   |
  | `sounds` | array&lt;ModeSoundInput&gt; | ✅   |

- **Response** `200` → `ModeWriteResponse`

### DELETE `/modes/{mode_id}`

- **Path Params**: `mode_id` (integer, required)
- **Response** `200`

### PATCH `/modes/{mode_id}/activate`

- **Path Params**: `mode_id` (integer, required)
- **Request Body**: 없음
- **Response** `200` → `ModeActivateResponse` — `{ mode_id, is_active }`

### PUT `/modes/{mode_id}/sounds`

- **Path Params**: `mode_id` (integer, required)
- **Request Body** (`ModeSoundsUpdateRequest`)

  | 필드     | 타입                        | 필수 |
  | -------- | --------------------------- | ---- |
  | `sounds` | array&lt;ModeSoundInput&gt; | ✅   |

- **Response** `200` → `ModeSoundsResponse` — `{ mode_id, sounds: ModeSoundItem[] }`

### PATCH `/modes/{mode_id}/sounds/{sound_id}`

- **Path Params**: `mode_id` (integer, required), `sound_id` (integer, required)
- **Request Body** (`ModeSoundActiveUpdate`)

  | 필드        | 타입    | 필수 |
  | ----------- | ------- | ---- |
  | `is_active` | boolean | ✅   |

- **Response** `200` → `ModeSoundActiveResponse` — `{ mode_id, sound_id, is_active }`

---

## 4. Sounds (`/sounds`)

> 모든 엔드포인트 인증 필요.

| 메서드 | 경로                 | 설명                                  |
| ------ | -------------------- | ------------------------------------- |
| GET    | `/sounds/categories` | 소리 카테고리 목록                    |
| GET    | `/sounds`            | 소리 목록 조회 (카테고리/키워드 필터) |

### GET `/sounds/categories`

- **Response** `200` → `CategoryListResponse` — `{ categories: CategoryItem[] }`
  - `CategoryItem`: `{ category_id, name }`

### GET `/sounds`

- **Query Params**

  | 이름          | 타입            | 필수 |
  | ------------- | --------------- | ---- |
  | `category_id` | integer \| null | ❌   |
  | `keyword`     | string \| null  | ❌   |

- **Response** `200` → `SoundListResponse`
  ```jsonc
  {
    "sounds": [
      {
        "sound_id": 10,
        "name": "초인종",
        "category_id": 1,
        "category_name": "가정",
        "icon_key": "doorbell",
      },
    ],
  }
  ```

---

## 5. Devices (`/devices`)

> 모든 엔드포인트 인증 필요.

| 메서드 | 경로                              | 설명                     |
| ------ | --------------------------------- | ------------------------ |
| GET    | `/devices`                        | 기기 목록 조회           |
| POST   | `/devices/connect`                | 기기를 현재 계정에 연결  |
| POST   | `/devices`                        | 기기 등록 (닉네임)       |
| PATCH  | `/devices/{device_id}`            | 기기 이름(닉네임) 수정   |
| DELETE | `/devices/{device_id}`            | 기기 연결 해제           |
| POST   | `/devices/{device_id}/detections` | 소리 감지 결과 전송      |

### GET `/devices`

- **Response** `200` → `array<DeviceResponse>`

#### DeviceResponse

| 필드             | 타입            | 비고                                             |
| ---------------- | --------------- | ------------------------------------------------ |
| `id`             | integer         | required                                         |
| `nickname`       | string          | required. 미지정 시 기본값 `Hear:ing Neckband`   |
| `battery_level`  | integer \| null | required                                         |
| `is_connected`   | boolean         | required. 서버가 ESP32 WS 접속으로 판단          |
| `is_active_user` | boolean         | required. 요청 계정이 현재 이 기기의 활성 사용자인지 |
| `last_seen_at`   | string \| null  | required. 연결됐을 때만 값이 있음                |

> 기기는 실제 넥밴드 1대이며 여러 계정이 번갈아 연결할 수 있다. `is_active_user`는
> "연결은 됐지만 지금 이 기기를 쓰는 게 나인지"를 구분한다. B가 연결하면 활성 사용자가
> A→B로 넘어가고, 이후 알림·진동에 B의 설정이 적용된다.
> `mac_address`는 응답에 포함되지 않는다(프론트가 쓰지 않고, MAC은 ESP32↔서버 사이의 값).

### POST `/devices/connect`

기기를 현재 로그인한 계정에 연결한다. 서버가 요청 시점의 ESP32 WebSocket 접속 상태를
즉시 확인해 성공/실패를 동기 응답한다(프론트가 연결을 폴링하며 기다리지 않는다).

- **Request Body**: 없음 (로그인 토큰만 사용)
- **Response** `200` → `DeviceResponse` (연결 성공. 활성 사용자가 이 계정으로 넘어옴)
- **Response** `409` → 기기가 서버에 접속해 있지 않음. 프론트는 자체 안내 문구와 "다시 시도" 버튼을 보여준다.

### POST `/devices`

> 새 연결 흐름(`POST /devices/connect`)에서는 프론트가 이 엔드포인트를 직접 호출하지 않는다.
> 백엔드가 API를 유지하기로 해 프론트 코드(`postDevice`/`DeviceRegisterModal`)는 보존하지만,
> 현재 사용자 흐름은 "연결하기"뿐이다.

- **Request Body** (`DeviceCreate`)

  | 필드       | 타입   | 필수 |
  | ---------- | ------ | ---- |
  | `nickname` | string | ✅   |

- **Response** `200` → `DeviceResponse`

### PATCH `/devices/{device_id}`

기기 이름(닉네임)을 수정한다. 설정의 기기 카드에서 연필 버튼 → 이름 수정 모달 → 저장 시 호출.

- **Path Params**: `device_id` (integer, required)
- **Request Body** (`DeviceUpdate`)

  | 필드       | 타입           | 필수 |
  | ---------- | -------------- | ---- |
  | `nickname` | string \| null | ❌   |

  > `battery_level`·`is_connected`는 하드웨어의 사실이라 프론트가 보내지 않는다(오용 방지).

- **Response** `200` → `DeviceResponse`

### DELETE `/devices/{device_id}`

기기 자체 삭제가 아니라 **현재 계정의 연결 해제**다. 현재 계정이 활성 사용자면 연결을 끊고,
활성 사용자가 아니어도 성공으로 응답한다.

- **Path Params**: `device_id` (integer, required)
- **Response** `200`

### POST `/devices/{device_id}/detections`

- **Path Params**: `device_id` (integer, required)
- **Request Body** (`DetectionCreate`)

  | 필드             | 타입              | 필수 |
  | ---------------- | ----------------- | ---- |
  | `sound_id`       | integer \| null   | ❌   |
  | `sound_name`     | string            | ✅   |
  | `sound_category` | string            | ✅   |
  | `confidence`     | number \| null    | ❌   |
  | `detected_at`    | string (datetime) | ✅   |
  | `latitude`       | number \| null    | ❌   |
  | `longitude`      | number \| null    | ❌   |

- **Response** `200`
