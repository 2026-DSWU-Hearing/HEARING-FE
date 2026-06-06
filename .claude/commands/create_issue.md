# create_issue.md

## 역할

작업 이슈를 생성한다.

## 실행 순서

1. `.github/ISSUE_TEMPLATE/✏️-이슈-생성---작업.md` 템플릿을 읽는다
2. 사용자에게 이슈 내용을 물어본다
3. 템플릿에 맞춰 내용을 채운다
4. `gh issue create` 명령으로 이슈를 생성한다

## 명령어

```bash
gh issue create --template "✏️-이슈-생성---작업.md"
```
