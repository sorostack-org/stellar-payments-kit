import { Keypair, TransactionBuilder, Operation, Asset, BASE_FEE } from "@stellar/stellar-sdk";
import { getServer, getNetworkConfig, StellarNetwork } from "./network";

export interface RecurringPaymentConfig {
  sourceSecret: string;
  destinationPublicKey: string;
  amount: string;
  intervalMs: number;
  maxPayments: number;
  asset?: { code: string; issuer: string };
  memo?: string;
  network?: StellarNetwork;
}

export interface ScheduledPayment {
  scheduledAt: Date;
  amount: string;
  destination: string;
  status: "pending" | "sent" | "failed";
  hash?: string;
}

export class RecurringPaymentScheduler {
  private config: RecurringPaymentConfig;
  private payments: ScheduledPayment[] = [];
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(config: RecurringPaymentConfig) {
    this.config = config;
  }

  async start(): Promise<void> {
    if (this.intervalId) return;

    for (let i = 0; i < this.config.maxPayments; i++) {
      this.payments.push({
        scheduledAt: new Date(Date.now() + i * this.config.intervalMs),
        amount: this.config.amount,
        destination: this.config.destinationPublicKey,
        status: "pending",
      });
    }

    this.intervalId = setInterval(() => this.processNext(), this.config.intervalMs);
    await this.processNext();
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async processNext(): Promise<void> {
    const pending = this.payments.find((p) => p.status === "pending");
    if (!pending) {
      this.stop();
      return;
    }

    try {
      const { sendPayment } = await import("./payments");
      const result = await sendPayment({
        sourceSecret: this.config.sourceSecret,
        destinationPublicKey: pending.destination,
        amount: pending.amount,
        memo: this.config.memo,
        network: this.config.network,
      });
      pending.status = "sent";
      pending.hash = result.hash;
    } catch {
      pending.status = "failed";
    }
  }

  getPayments(): ScheduledPayment[] {
    return this.payments;
  }
}
