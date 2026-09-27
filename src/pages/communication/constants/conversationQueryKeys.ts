export const LOCATION_NAME_QUERY_KEY = (latitude: number, longitude: number) =>
  ['locationName', latitude, longitude] as const;
