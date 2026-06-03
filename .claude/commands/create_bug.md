# create_bug.md

## 역할

버그 리포트 이슈를 생성한다.

## 실행 순서

1. `.github/ISSUE_TEMPLATE/🐛-버그-리포트.md` 템플릿을 읽는다
2. 사용자에게 버그 상황을 물어본다
   - 어떤 동작을 했는지
   - 기대한 결과 vs 실제 결과
   - 재현 방법
3. 템플릿에 맞춰 내용을 채운다
4. `gh issue create` 명령으로 이슈를 생성한다

## 명령어

```bash
gh issue create --template "🐛-버그-리포트.md"
```
