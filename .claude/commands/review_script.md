# 코드 리뷰 스크립트

## 역할

변경된 코드를 두 단계로 리뷰한다.

1. **Claude 리뷰**: 이 프로젝트의 컨벤션과 구조 기준으로 검토
2. **GPT 리뷰**: 정리된 diff와 컨텍스트를 GPT에 넘겨서 추가 관점 확보

## 1단계 — 변경사항 파악

\`\`\`bash
git diff develop...HEAD --name-only # 변경 파일 목록
git diff develop...HEAD # 전체 diff
\`\`\`

## 2단계 — Claude 리뷰 체크리스트

변경된 각 파일에 대해 아래 항목을 순서대로 검토한다.

### 컨벤션

컨벤션을 준수하는지 확인

- 코딩 컨벤션 파일: docs/conventions.md

### 폴더 구조 준수

변경 파일의 위치가 아래 규칙에 맞는지 확인:

- 페이지 전용 코드 → `pages/{pageName}/{apis|components|constants|hooks|types|utils}`
- 재사용 공통 코드 → `shared/{해당 폴더}`
- 잘못된 위치에 있는 파일이 있으면 지적한다

### 코드 품질

- [ ] 전역 변수 남용 없는지
- [ ] 구조 분해 할당 활용하는지
- [ ] 문자열 조합 시 템플릿 리터럴 사용하는지
- [ ] 함수는 화살표 함수인지
- [ ] Custom Hook / Reducer / Context 등 디자인 패턴을 적절히 활용하는지
- [ ] 이해가 어려운 로직에 주석이 있는지

### 기타

- [ ] 절대경로를 잘 사용했는지 확인 `'@/shared/...' 형식`
- [ ] 불필요한 console.log 제거
- [ ] TODO/FIXME 주석 중 이번 PR에서 처리해야 할 것
- [ ] 환경 변수(`VITE_USE_MOCK` 등) 하드코딩 여부

## 3단계 — GPT 리뷰 요청

Claude 리뷰가 끝나면 아래 형식으로 GPT 프롬프트를 생성해서 출력한다.
사용자가 직접 GPT에 붙여넣거나, OPENAI_API_KEY가 환경 변수에 있으면 curl로 자동 요청한다.

### 자동 요청 (OPENAI_API_KEY 있을 때)

\`\`\`bash
DIFF=$(git diff dev...HEAD)

curl https://api.openai.com/v1/chat/completions \
 -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": "너는 시니어 프론트엔드 개발자야. React + TypeScript + TanStack Query 기반 프로젝트의 코드 리뷰를 한다. 지적할 내용이 없는 파일은 생략하고, 개선이 필요한 부분만 파일명과 줄 번호와 함께 한국어로 구체적으로 말해줘."
      },
      {
        "role": "user", 
        "content": "다음은 dev 브랜치 대비 변경사항이야. 리뷰해줘.\n\n'"$DIFF"'"
}
]
}'
\`\`\`

### 수동 요청 (붙여넣기용 프롬프트 생성)

OPENAI_API_KEY가 없으면 아래 형식으로 프롬프트를 출력한다:

\`\`\`
[GPT에 붙여넣을 프롬프트]

너는 시니어 프론트엔드 개발자야. React + TypeScript + TanStack Query 기반 프로젝트의 코드 리뷰를 한다.
지적할 내용이 없는 파일은 생략하고, 개선이 필요한 부분만 파일명과 구체적인 이유와 함께 한국어로 말해줘.

--- 변경사항 ---
{git diff 결과 붙여넣기}
\`\`\`

## 최종 출력 형식

리뷰 결과를 아래 형식으로 정리해서 출력한다.

\`\`\`

## 🔍 Claude 리뷰 결과

### 컨벤션 이슈

- ...

### 구조/설계 이슈

- ...

### 권장 개선사항

- ...

---

## 🤖 GPT 리뷰 결과

(자동 요청 시 결과 삽입 / 수동 시 "위 프롬프트를 GPT에 붙여넣으세요")
\`\`\`
