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
  | - `ModeSoundInput`: `{ sound_id: integer (required), name?: string\|null }` |

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

| 메서드 | 경로                              | 설명                    |
| ------ | --------------------------------- | ----------------------- |
| GET    | `/devices`                        | 기기 목록 조회          |
| POST   | `/devices/connect`                | 기기를 현재 계정에 연결 |
| POST   | `/devices`                        | 기기 등록 (닉네임)      |
| PATCH  | `/devices/{device_id}`            | 기기 이름(닉네임) 수정  |
| DELETE | `/devices/{device_id}`            | 기기 연결 해제          |
| POST   | `/devices/{device_id}/detections` | 소리 감지 결과 전송     |

### GET `/devices`

- **Response** `200` → `array<DeviceResponse>`

#### DeviceResponse

| 필드             | 타입            | 비고                                                 |
| ---------------- | --------------- | ---------------------------------------------------- |
| `id`             | integer         | required                                             |
| `nickname`       | string          | required. 미지정 시 기본값 `Hear:ing Neckband`       |
| `battery_level`  | integer \| null | required                                             |
| `is_connected`   | boolean         | required. 서버가 ESP32 WS 접속으로 판단              |
| `is_active_user` | boolean         | required. 요청 계정이 현재 이 기기의 활성 사용자인지 |
| `last_seen_at`   | string \| null  | required. 연결됐을 때만 값이 있음                    |

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

---

## 6. Notifications (`/notifications`)

> - 감지 기록 **생성**은 이미 있다 → `POST /devices/{device_id}/detections`
> - 감지 이벤트 **실시간 수신**도 이미 있다 → `WS /ws/users/me/detections`
> - 이번에 추가할 것은 그 기록의 **목록 조회 + 삭제** 두 가지뿐이다.
>
> 응답 아이템 스키마는 WebSocket이 내려주는 `detection` 메시지의 `data`와 **완전히 동일**해야
> 한다. 프론트가 WS로 받은 실시간 이벤트를 이 목록 캐시에 그대로 끼워 넣기 때문에, 두 스키마가
> 갈라지면 변환 계층이 생기고 중복·누락이 발생한다.

| 메서드 | 경로                    | 설명                       |
| ------ | ----------------------- | -------------------------- |
| GET    | `/notifications`        | 알림 목록 조회 (커서 기반) |
| POST   | `/notifications/delete` | 알림 일괄 삭제 (ids 배열)  |

### 공통 응답 스키마

#### NotificationItem

WS `detection` 메시지의 `data`와 필드·타입이 완전히 동일하다.

| 필드             | 타입              | 비고                                                                      |
| ---------------- | ----------------- | ------------------------------------------------------------------------- |
| `id`             | integer           | required. **WS 이벤트의 `id`와 같은 값**이어야 한다 (아래 제약사항 4번)   |
| `sound_name`     | string            | required. 한글. 예: `"화재 경보"`                                         |
| `sound_category` | string            | required. 한글. 아래 8종 중 하나                                          |
| `source`         | string            | required. 감지 출처. **알림에서는 화면 미표시**                           |
| `confidence`     | number            | required. `0.0`~`1.0`. **알림에서는 화면 미표시**                         |
| `location`       | string \| null    | required(널 허용). 사람이 읽는 문자열. **알림에서는 화면 미표시**         |
| `detected_at`    | string (datetime) | required. **ISO 8601 + 타임존 오프셋**. 예: `"2026-04-09T13:01:22+09:00"` |

`source`·`confidence`·`location`은 지금 알림 화면에서 표시 X
응답에 포함하는 이유는 프론트가 WS 타입(`DetectionTypes`)을 목록 아이템 타입으로 **그대로 재사용**해 실시간 수신분과 목록 조회분을 한 배열에 섞기 위해서다. 필드를 빼면 두 타입이 갈라진다.
서버는 이 세 필드를 화면용으로 가공할 필요가 없음

### GET `/notifications`

내 알림(감지 기록) 목록을 최신순으로 조회한다. 커서 기반 무한 스크롤.

- **Query Params**

  | 이름     | 타입           | 필수 | 비고                                                             |
  | -------- | -------------- | ---- | ---------------------------------------------------------------- |
  | `cursor` | string \| null | ❌   | 이전 응답의 `next_cursor`. 없으면 최신부터                       |
  | `limit`  | integer        | ❌   | 기본 `20`, 최소 `1`, 최대 `50`. 범위 밖 값은 **clamp**(400 금지) |

  > `limit`이 범위를 벗어났을 때 400을 주면 무한 스크롤 도중 화면이 그냥 멈춘다. 상·하한으로
  > 잘라서 정상 응답하는 편이 안전하다.

- **정렬**: `detected_at DESC, id DESC` 고정. 정렬 옵션은 두지 않는다.

- **Response** `200` → `NotificationListResponse`

  | 필드          | 타입                          | 비고                                              |
  | ------------- | ----------------------------- | ------------------------------------------------- |
  | `items`       | array&lt;NotificationItem&gt; | required. 최신순. 결과 없으면 `[]`                |
  | `next_cursor` | string \| null                | required. 다음 페이지 커서. 마지막이면 `null`     |
  | `has_next`    | boolean                       | required. `false`면 `next_cursor`는 반드시 `null` |

  ```jsonc
  {
    "items": [
      {
        "id": 1024,
        "sound_name": "화재 경보",
        "sound_category": "긴급",
        "source": "neckband",
        "confidence": 0.93,
        "location": "서울시 마포구",
        "detected_at": "2026-04-09T13:01:22+09:00",
      },
      {
        "id": 1023,
        "sound_name": "아기 옹알이",
        "sound_category": "생활음",
        "source": "neckband",
        "confidence": 0.81,
        "location": null,
        "detected_at": "2026-04-09T13:01:22+09:00",
      },
    ],
    "next_cursor": "MjAyNi0wNC0wOVQxMzowMToyMiswOTowMHwxMDIz",
    "has_next": true,
  }
  ```

#### 커서 규격 (중요)

- `cursor`는 **불투명(opaque) 문자열**이다. 프론트는 내용을 파싱하지 않고 받은 값을 그대로
  되돌려준다. 서버는 내부적으로 `(detected_at, id)` 복합 키를 인코딩한다
  (예: `base64("{detected_at}|{id}")`). 형식은 서버 자유이며 나중에 바꿔도 프론트는 영향 없다.

- **`detected_at` 단독 커서는 금지.** 넥밴드가 **같은 초에 여러 소리를 감지하는 일이 흔하다.**
  `detected_at < cursor`로 자르면 동점 그룹이 통째로 누락되고, `<=`로 자르면 무한 중복된다.
  반드시 튜플 비교로 자른다:

  ```sql
  WHERE (detected_at, id) < (:cursor_detected_at, :cursor_id)
  ORDER BY detected_at DESC, id DESC
  LIMIT :limit
  ```

- **`id` 단독 커서도 금지.** `POST /devices/{device_id}/detections`가 `detected_at`을
  **하드웨어에서 받는** 구조라, 넥밴드가 오프라인 중 버퍼링했다가 뒤늦게 올리면
  `id`는 큰데 `detected_at`은 과거다. 두 순서가 어긋나 항목이 건너뛰어진다.

- 잘못됐거나 만료된 커서는 `422`. 프론트는 이 경우 목록을 처음부터 다시 로드한다.

### POST `/notifications/delete`

선택한 알림들을 **일괄 삭제**한다.

> **`DELETE` 대신 `POST`를 쓰는 이유**: 화면에 "전체 선택" 버튼이 있어 `ids`가 수백 개가 될 수
> 있다. 쿼리스트링(`?ids=1,2,3`)은 URL 길이 제한에 걸리고, `DELETE`의 요청 바디는 RFC 9110상
> 의미가 정의돼 있지 않아 일부 프록시/게이트웨이가 **조용히 버린다**(→ 서버가 빈 배열을 받아
> 0건 삭제되는데 응답은 성공이라 원인 추적이 어렵다). PWA라 서비스워커까지 끼는 환경이므로
> 액션 스타일 POST로 고정한다. 이미 `POST /devices/connect`라는 같은 결의 전례가 있다.

- **Request Body** (`NotificationDeleteRequest`)

  | 필드  | 타입                 | 필수 | 비고                                          |
  | ----- | -------------------- | ---- | --------------------------------------------- |
  | `ids` | array&lt;integer&gt; | ✅   | 1개 이상 100개 이하. 중복 허용(서버가 dedupe) |

  ```jsonc
  {
    "ids": [1024, 1023, 1019],
  }
  ```

- **Response** `200` → `NotificationDeleteResponse`

  | 필드            | 타입    | 비고                         |
  | --------------- | ------- | ---------------------------- |
  | `deleted_count` | integer | required. 실제로 삭제된 건수 |

  ```jsonc
  {
    "deleted_count": 2,
  }
  ```

- **Response** `422` → `ids`가 빈 배열이거나 100개를 초과한 경우

#### 부분 실패 동작 (반드시 이대로)

- 요청한 id 중 **존재하지 않거나, 이미 삭제됐거나, 다른 사용자 소유**인 것이 섞여 있어도
  **404·403을 반환하지 않는다.** 해당 id만 조용히 건너뛰고 나머지를 삭제한 뒤 `200`을 응답한다.
- 즉 이 엔드포인트는 **멱등**하다. 같은 요청을 두 번 보내면 두 번째는 `deleted_count: 0`으로
  성공한다(네트워크 타임아웃 후 재시도가 안전해야 한다).
- 이유:
  - 사용자가 삭제 모드에서 항목을 고르는 사이 WS로 목록이 갱신되거나 다른 세션에서 이미 지웠을
    수 있다. 이때 에러를 띄우면 "지우려던 게 이미 없는데 실패했다"는 무의미한 실패가 된다.
  - 타인 소유 id에 `403`을 주면 id 존재 여부가 새어 나간다(enumeration). 조용히 무시가 낫다.
- 프론트는 `deleted_count`가 요청한 개수와 다르면 목록 쿼리를 무효화해 서버 상태와 다시 맞춘다.

### 백엔드 제약사항 (필수 준수)

아래는 프론트 구현에서 역산된 요구사항이다. 지키지 않아도 API는 "동작"하지만 화면이 조용히
깨지는 것들이라, 통합 전에 맞춰야 한다.

#### 1. `detected_at`은 ISO 8601 + 타임존 오프셋 원본으로

예: `2026-04-09T13:01:22+09:00`

**서버가 `"1일 전"`, `"26.04.09 13:01"` 같은 표시용 문자열을 만들어 보내면 안 된다.** 화면에는
상대 시간과 절대 시간이 함께 나오지만, 그 변환은 프론트가 한다. 이유 셋:

- 상대 시간은 사용자가 화면을 켜둔 채로도 계속 변한다(1분 전 → 2분 전). 서버가 응답 시점에
  굳혀 보내면 캐시된 과거 문자열이 계속 표시된다.
- 프론트는 WS 실시간 수신분과 목록 조회분을 **한 배열에 섞어 정렬**한다. 포맷된 문자열끼리는
  정렬이 불가능하다.
- 오프셋 없는 naive datetime(`2026-04-09T13:01:22`)은 브라우저가 UTC로도 로컬로도 해석해
  **9시간 어긋난다.** 오프셋 또는 `Z`를 반드시 포함할 것.

#### 2. `sound_name`·`sound_category`는 한글 원문으로, `GET /sounds`와 완전히 동일하게

프론트는 **소리 아이콘에 서버의 `icon_key`를 전혀 사용하지 않는다.** (`icon_key`는 모드 아이콘
전용이다.) 소리 아이콘은 한글 `sound_name`을 키로 내부 매핑 테이블에서 찾고, 실패하면 한글
카테고리로, 그것도 실패하면 기본 스피커 아이콘으로 떨어진다.

따라서 **공백·띄어쓰기 하나만 달라도 아이콘이 전부 기본값이 된다.**

- `"화재 경보"` ⭕
- `"화재경보"` ❌ (띄어쓰기 없음)
- `"Fire alarm"` ❌ (영문)

`GET /sounds`의 `name`과 **글자 단위로 같은 문자열**을 내려주면 된다.

#### 3. `sound_category`는 아래 8종으로 고정

프론트의 카테고리 배지 색상 테이블이 이 8개 한글 키만 갖고 있고, 그 외 값은 전부 회색 fallback
으로 떨어져 디자인이 깨진다.

| 카테고리 (응답에 넣을 한글 값) | 프론트 내부 아이콘 키 |
| ------------------------------ | --------------------- |
| `긴급`                         | `ic_emergency`        |
| `교통`                         | `ic_traffic`          |
| `사람`                         | `ic_human`            |
| `생활음`                       | `ic_life`             |
| `자연`                         | `ic_nature`           |
| `동물`                         | `ic_animal`           |
| `주방`                         | `ic_kitchen`          |
| `음악`                         | `ic_music`            |

> 참고: 이 문서 `GET /sounds` 예시에 있는 `"가정"`은 위 8종에 없다. `/sounds`의 `category_name`도
> 이 8종과 일치해야 하므로 백엔드에서 함께 정리 필요.

#### 4. WS 이벤트의 `id`와 목록 API의 `id`는 같은 식별자

프론트는 WS로 새 감지를 받으면 서버를 다시 조회하지 않고 그 이벤트를 목록 캐시 맨 앞에 삽입한다.

- `id`가 다르면 → 사용자가 스크롤해 서버에서 같은 레코드를 다시 받았을 때 **같은 알림이 두 번
  보인다.**
- 낙관적으로 삽입한 항목을 사용자가 곧바로 삭제하면, 그 `id`가 그대로
  `POST /notifications/delete`에 실려 나간다. 서버가 인식할 수 있는 id여야 한다.

→ **WS 브로드캐스트는 DB insert 후 확정된 PK로 보낼 것.** 임시 id나 UUID를 쓰면 안 된다.

#### 5. 삭제 격리 — 사용자별 숨김 (감지 원본 물리 삭제 금지)

넥밴드 1대를 여러 계정이 번갈아 사용한다(`DeviceResponse.is_active_user` 참고). 이 구조에서
알림 삭제는 **요청한 계정의 목록에서만** 사라져야 한다.

- `POST /notifications/delete`는 **감지 원본 레코드를 물리 삭제하지 않는다.** 요청한 `user_id`에
  대해서만 숨김 처리한다(사용자별 삭제 마커 테이블, 또는 사용자-감지 매핑 행의 soft delete).
- `GET /notifications`는 요청 계정 기준으로 숨김을 걸러낸 결과만 반환한다.
- **판정 기준: A가 알림을 지워도, 같은 기기를 쓰는 B의 알림 목록은 전혀 변하지 않아야 한다.**

> 어떤 계정에 어떤 감지가 보이는지의 기준(감지 시점의 활성 사용자에게만 보이는지, 그 기기에
> 연결된 모든 계정에게 보이는지)은 **백엔드가 정해서 이 문서에 명시해달라.** 프론트는 서버가
> 준 목록을 그대로 그린다.

#### 6. 목록은 본인 것만

다른 사용자의 감지가 절대 섞이지 않아야 한다.

### 선택 사항 (지금은 불필요, 여유가 되면)

지금 없어도 화면은 완성된다. 다만 나중에 스키마를 바꾸는 것보다 처음부터 넣어두는 게 싼 항목들이라
적어둔다. **우선순위는 위 두 엔드포인트가 먼저다.**

| 항목                             | 내용                                        | 왜 미리 요청하는가                                                                                                                                                         |
| -------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FCM `data`에 `detection_id`      | 푸시 payload의 `data`에 `detection_id` 추가 | 현재 서비스워커는 `title`/`body`만 소비해 알림 클릭 딥링크가 불가능하다. payload 스키마 변경은 백엔드 배포가 따라야 해 리드타임이 길다. 프론트는 값이 있어도 당장 무시한다 |
| `POST /notifications/delete-all` | 내 알림 전체 삭제                           | 지금은 "전체 선택 → 삭제"라 id를 전부 실어 보낸다. 알림이 수백 건 쌓이면 100개 상한에 걸려 프론트가 요청을 쪼개야 한다                                                     |
| `GET /notifications?category=`   | 카테고리(한글 8종) 필터                     | 지금 화면엔 필터 탭이 없다. 추가된다면 클라이언트 필터링은 커서 페이지네이션과 상성이 나쁘다(한 페이지에 해당 카테고리가 0건이면 빈 화면이 뜬다)                           |

> **이번 범위에서 제외한 것**: 읽음 상태(`is_read`), 안 읽은 개수, 알림 상세 조회, 날짜 그룹핑용
> 응답 구조, 카테고리 탭. 화면에 해당 UI가 전혀 없어 지금 만들면 쓰이지 않는다.
