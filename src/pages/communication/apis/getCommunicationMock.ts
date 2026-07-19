import type { GetCommunicationMockResponseTypes } from '@/pages/communication/types/communication-Types';

export const getCommunicationMock =
  async (): Promise<GetCommunicationMockResponseTypes> => {
    const response = await fetch('/data/communicationMock.json');

    if (!response.ok) {
      throw new Error(
        `양방향 소통 목데이터 조회 실패: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  };
