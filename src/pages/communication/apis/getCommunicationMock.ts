import type { GetCommunicationMockResponseTypes } from '@/pages/communication/types/communication-Types';

export const getCommunicationMock =
  async (): Promise<GetCommunicationMockResponseTypes> => {
    const response = await fetch('/data/communicationMock.json');
    return response.json();
  };
