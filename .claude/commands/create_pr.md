# GitHub PR 생성

## 역할

이 명령을 실행하면 현재 브랜치의 변경사항을 분석해서 PR 제목과 본문을 자동 생성하고, `gh pr create`로 PR을 올린다.

## 실행 순서

1. 현재 브랜치와 변경사항 확인
   - `git branch --show-current`
   - `git log develop..HEAD --oneline`
   - `git diff develop...HEAD --stat`

2. 변경사항을 분석해서 PR 제목 생성
   - 형식: `[type]: 한 줄 요약`
   - type 선택 기준:
     | type | 사용 시점 |
     |------|----------|
     | feature | 새 기능 추가 |
     | fix | 버그 수정 |
     | refactor | 기능 변경 없이 코드 구조 개선 |
     | chore | 설정, 패키지, 환경 변경 |
     | docs | 주석, README 등 문서 |
     | style | 스타일(CSS/Tailwind) 변경 |
     | test | 테스트 코드 |

3. 아래 템플릿으로 PR 본문 생성

4. `gh pr create --base develop --title "..." --body "..."` 실행
   - draft 여부는 실행 전에 물어본다

## PR 본문 템플릿

- PR 템플릿: .github/PULL_REQUEST_TEMPLATE.md

## 주의사항

- base 브랜치는 항상 `develop`
- PR 제목에 영어/한국어 혼용 가능하지만 일관성 유지
- 스크린샷 섹션은 UI 변경이 없으면 비워둔다
