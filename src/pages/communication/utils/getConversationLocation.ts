import type { ConversationLocationTypes } from '@/pages/communication/types/conversationApiTypes';

export const getConversationLocation = (): Promise<ConversationLocationTypes> =>
  new Promise((resolve) => {
    const unavailable = () => resolve({ latitude: null, longitude: null });
    if (!navigator.geolocation) return unavailable();
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      unavailable,
      { timeout: 5000, maximumAge: 60000 },
    );
  });
