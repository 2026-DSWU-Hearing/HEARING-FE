export const CURRENT_LOCATION_QUERY_KEY = ['currentLocation'] as const;

export const LOCATION_NAME_QUERY_KEY = (latitude: number, longitude: number) =>
  ['locationName', latitude, longitude] as const;
