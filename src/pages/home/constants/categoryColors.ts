// 카테고리별 태그 색상 매핑. 소리 카드 안의 카테고리 태그(CategoryBlock variant=tag) 전용이다.
// 비활성(방해금지) 상태와 필터 바(variant=filter)는 카테고리 고유색을 쓰지 않으므로 여기서 다루지 않는다.

// 매핑에 없는 카테고리가 들어와도 깨지지 않도록 쓰는 기본 색.
export const DEFAULT_CATEGORY_COLOR = 'border-neutral-400 text-neutral-300';

export const CATEGORY_COLOR: Record<string, string> = {
  생활음: 'bg-[#8199C6] text-secondary-100',
  긴급: 'bg-[#A5413E] text-primary',
  교통: 'bg-[#878575] text-primary-100',
  사람: 'bg-[#D3B77F] text-[#917419]',
  주방: 'bg-[#CE9A50] text-[#644111]',
  동물: 'bg-[#D69CA7] text-[#AB5767]',
  음악: 'bg-[#8D80AC] text-[#3D1F85]',
  자연: 'bg-[#78965B] text-primary-100',
};

// 카테고리 이름으로 색 클래스를 안전하게 꺼낸다.
export const getCategoryColor = (categoryName: string) =>
  CATEGORY_COLOR[categoryName] ?? DEFAULT_CATEGORY_COLOR;
