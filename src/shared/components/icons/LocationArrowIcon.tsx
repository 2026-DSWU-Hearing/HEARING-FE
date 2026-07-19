interface LocationArrowIconPropTypes {
  className?: string;
}

// 양방향 소통 페이지 헤더의 현재 위치 표시 옆에 쓰는 위치 화살표 아이콘.
const LocationArrowIcon = ({ className }: LocationArrowIconPropTypes) => (
  <svg
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M15.2926 0.0781514L0.61259 6.21815C-0.21741 6.56815 -0.19741 7.74815 0.63259 8.06815L5.97259 10.1382C6.23259 10.2382 6.44259 10.4482 6.54259 10.7082L8.60259 16.0382C8.92259 16.8782 10.1126 16.8982 10.4626 16.0682L16.6126 1.39815C16.9426 0.568152 16.1126 -0.261849 15.2926 0.0781514Z"
      fill="currentColor"
    />
  </svg>
);

export default LocationArrowIcon;
