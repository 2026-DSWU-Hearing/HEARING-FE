## Coding Conventions (코딩 컨벤션)

- 컴포넌트 / class: `PascalCase`
- 폴더명, 파일명(컴포넌트 제외), 변수, 함수, 파라미터: `camelCase`
- 상수: `BIG_SNAKE_CASE`
- 전역 변수 지양
- 구조 분해 할당 적극 활용
- 문자열 조합은 템플릿 리터럴 사용
- 줄임말 사용 금지 (의미 명확하게)
- 함수는 화살표 함수 사용
- 이벤트 핸들러: `handle + 기능 + 이벤트` (예: `handleBtnClick`, `handleTabChange`)
- boolean 변수: `is + 상태` (예: `isLogined`), 필요시 `can / should / has`
- API 함수: `HTTP 메서드 + 명사` (예: `getUser`, `postSound`)
- `var` 사용 금지, `const` 기본 / 필요시 `let`
- 모든 타입명 뒤에 `-Types` 접미사
- Props 타입: `컴포넌트명 + PropTypes`
- object 구조 → `interface`, 단일 변수 → `type`
- 컴포넌트 인자 타입은 컴포넌트 바로 위에 선언

### 디자인 패턴

- Custom Hook
- Reducer
- Context Provider
- Error Boundary
- Controlled Components
- Lazy Loading

## 깃 컨벤션

1. 브랜치 네이밍 컨벤션

- 커밋 컨벤션/페이지 or 기능 이름 (예: setting/router-setting )

2. 커밋 컨벤션
   setting 패키지 설치, 개발 설정
   feat 새로운 기능 추가 / 퍼블리싱
   fix 버그 수정
   style CSS 등 사용자 UI 디자인 변경
   api api 연결 로직 작성
   refactor 프로덕션 코드 리팩토링업, QA 반영
   chore 빌드 테스트 업데이트, 패키지 매니저를 설정하는 경우(프로덕션 코드 변경 X)
   deploy 배포 작업
   comment 필요한 주석 추가 및 변경
   test 테스트 추가, 테스트 리팩토링(프로덕션 코드 변경 X)
   rename 파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우
   remove 파일을 삭제하는 작업만 수행한 경우
   docs 문서 수정
   !HOTFIX 코드 포맷 변경, 세미 콜론 누락, 코드 수정이 없는 경우
   !BREAKING CHANGE 커다란 API 변경의 경우
