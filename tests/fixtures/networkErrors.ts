import { AxiosError, AxiosHeaders } from 'axios';

export const createServerError = (status: number) =>
  new AxiosError('Request failed', 'ERR_BAD_RESPONSE', undefined, undefined, {
    status,
    statusText: 'Request failed',
    data: null,
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

export const createNetworkError = () =>
  new AxiosError('Network Error', 'ERR_NETWORK');
