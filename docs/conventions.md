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
