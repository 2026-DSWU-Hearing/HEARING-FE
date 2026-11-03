import { vi } from 'vitest';

export class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSED = 3;
  static instances: MockWebSocket[] = [];
  readyState = MockWebSocket.CONNECTING;
  bufferedAmount = 0;
  binaryType = '';
  onopen: (() => void | Promise<void>) | null = null;
  onmessage: ((event: MessageEvent<string>) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  send = vi.fn();
  // 브라우저가 close/error 이벤트를 보내지 않는 상황도 재현한다.
  close = vi.fn(() => {
    this.readyState = MockWebSocket.CLOSED;
  });

  constructor() {
    MockWebSocket.instances.push(this);
  }

  open = async () => {
    this.readyState = MockWebSocket.OPEN;
    await this.onopen?.();
  };

  receive = (data: unknown) => {
    this.onmessage?.(
      new MessageEvent('message', { data: JSON.stringify(data) }),
    );
  };

  serverClose = (code: number) => {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.(new CloseEvent('close', { code }));
  };
}
