import { Horizon } from "@stellar/stellar-sdk";

export interface StreamHandler<T> {
  onMessage: (data: T) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

export class PaymentEventStream {
  private server: Horizon.Server;
  private accountId: string;
  private handler: StreamHandler<any>;
  private es: EventSource | null = null;

  constructor(serverUrl: string, accountId: string, handler: StreamHandler<any>) {
    this.server = new Horizon.Server(serverUrl);
    this.accountId = accountId;
    this.handler = handler;
  }

  start() {
    const url = `${this.server.serverURL}accounts/${this.accountId}/payments`;
    this.es = new EventSource(url);
    this.es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handler.onMessage(data);
    };
    this.es.onerror = () => {
      this.handler.onError?.(new Error("Stream error"));
    };
  }

  close() {
    this.es?.close();
    this.handler.onClose?.();
  }
}

export function streamPayments(
  serverUrl: string,
  accountId: string,
  handler: StreamHandler<any>,
): PaymentEventStream {
  const stream = new PaymentEventStream(serverUrl, accountId, handler);
  stream.start();
  return stream;
}
