// 카테고리별 태그 색상 매핑. 소리 카드 안의 카테고리 태그(CategoryBlock variant=tag) 전용이다.
// 비활성(방해금지) 상태와 필터 바(variant=filter)는 카테고리 고유색을 쓰지 않으므로 여기서 다루지 않는다.

// 매핑에 없는 카테고리가 들어와도 깨지지 않도록 쓰는 기본 색.
export const DEFAULT_CATEGORY_COLOR = 'border-neutral-400 text-neutral-300';

export const CATEGORY_COLOR: Record<string, string> = {
  생활음: 'bg-secondary-100/50 text-secondary-100',
  긴급: 'bg-state-alert/50 text-primary',
  교통: 'bg-primary-100/50 text-primary-100',
  사람: 'bg-primary-500/50 text-primary-500',
  주방: 'bg-primary-600/50 text-primary-600',
  동물: 'bg-secondary-400/50 text-secondary-400',
  음악: 'bg-neutral-50 text-neutral-50',
  자연: 'bg-state-success/50 text-state-success',
};

// 카테고리 이름으로 색 클래스를 안전하게 꺼낸다.
export const getCategoryColor = (categoryName: string) =>
  CATEGORY_COLOR[categoryName] ?? DEFAULT_CATEGORY_COLOR;
