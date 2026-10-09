export type KakaoServiceStatusTypes = 'OK' | 'ZERO_RESULT' | 'ERROR';

export interface KakaoRegionTypes {
  region_type: 'H' | 'B';
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
}

export interface KakaoGeocoderTypes {
  coord2RegionCode: (
    longitude: number,
    latitude: number,
    callback: (
      result: KakaoRegionTypes[],
      status: KakaoServiceStatusTypes,
    ) => void,
  ) => void;
}

export interface KakaoMapsTypes {
  load: (callback: () => void) => void;
  services: {
    Geocoder: new () => KakaoGeocoderTypes;
  };
}

declare global {
  interface Window {
    kakao?: {
      maps: KakaoMapsTypes;
    };
  }
}
