import { loadKakaoMapSdk } from '@/shared/utils/loadKakaoMapSdk';

const ADMINISTRATIVE_REGION_TYPE = 'H';

export const getLocationName = async (
  latitude: number,
  longitude: number,
): Promise<string | null> => {
  const maps = await loadKakaoMapSdk();
  const geocoder = new maps.services.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
      if (status === 'ZERO_RESULT') {
        resolve(null);
        return;
      }

      if (status !== 'OK') {
        reject(new Error('좌표를 지역명으로 변환하지 못했습니다.'));
        return;
      }

      const region =
        result.find(
          ({ region_type: regionType }) =>
            regionType === ADMINISTRATIVE_REGION_TYPE,
        ) ?? result[0];

      if (!region) {
        resolve(null);
        return;
      }

      const locationName = [
        region.region_1depth_name,
        region.region_2depth_name,
      ]
        .filter(Boolean)
        .join(' ');

      resolve(locationName || null);
    });
  });
};
