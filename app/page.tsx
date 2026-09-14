"use client";

import { useState } from "react";

type Tab = "keygen" | "fund" | "payment" | "info";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("keygen");

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10">
      <header className="max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Stellar Payments Kit</h1>
        <p className="text-gray-400 text-sm">
          Interactive demo — explore Stellar network utilities on Testnet.
        </p>
      </header>

      <div className="max-w-3xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-2">
          {(
            [
              { id: "keygen", label: "Generate Keypair" },
              { id: "fund", label: "Fund Account" },
              { id: "payment", label: "Send XLM" },
              { id: "info", label: "Account Info" },
            ] as { id: Tab; label: string }[]
          ).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2 rounded-t text-sm font-medium transition-colors ${
                activeTab === id ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          {activeTab === "keygen" && <KeygenPanel />}
          {activeTab === "fund" && <FundPanel />}
          {activeTab === "payment" && <PaymentPanel />}
          {activeTab === "info" && <AccountInfoPanel />}
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Keypair Generator                                                    */
/* ------------------------------------------------------------------ */

function KeygenPanel() {
  const [result, setResult] = useState<{
    publicKey: string;
    secretKey: string;
  } | null>(null);

  async function generate() {
    const { generateKeypair } = await import("@/lib/stellar/accounts");
    setResult(generateKeypair());
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Generate Keypair</h2>
      <p className="text-gray-400 text-sm mb-4">
        Creates a new random Stellar keypair. Never share the secret key.
      </p>
      <button
        onClick={generate}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm font-medium transition-colors"
      >
        Generate
      </button>

      {result && (
        <div className="mt-5 space-y-3">
          <Field label="Public Key" value={result.publicKey} />
          <Field label="Secret Key" value={result.secretKey} secret />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Fund Testnet Account                                                 */
/* ------------------------------------------------------------------ */

function FundPanel() {
  const [publicKey, setPublicKey] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fund() {
    if (!publicKey.trim()) return;
    setLoading(true);
    setStatus(null);
    try {
      const { fundTestnetAccount } = await import("@/lib/stellar/accounts");
      await fundTestnetAccount(publicKey.trim());
      setStatus("Account funded successfully on Testnet.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Fund Testnet Account</h2>
      <p className="text-gray-400 text-sm mb-4">
        Uses Friendbot to fund a Testnet account with 10,000 XLM.
      </p>
      <label className="block text-sm text-gray-300 mb-1">Public Key</label>
      <input
        type="text"
        value={publicKey}
        onChange={(e) => setPublicKey(e.target.value)}
        placeholder="G..."
        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm font-mono mb-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <button
        onClick={fund}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded text-sm font-medium transition-colors"
      >
        {loading ? "Funding..." : "Fund via Friendbot"}
      </button>
      {status && (
        <p
          className={`mt-4 text-sm ${
            status.startsWith("Error") ? "text-red-400" : "text-green-400"
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Send XLM                                                             */
/* ------------------------------------------------------------------ */

function PaymentPanel() {
  const [secret, setSecret] = useState("");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [result, setResult] = useState<{
    hash: string;
    ledger: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function send() {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const { sendPayment } = await import("@/lib/stellar/payments");
      const res = await sendPayment({
        sourceSecret: secret.trim(),
        destinationPublicKey: destination.trim(),
        amount: amount.trim(),
        memo: memo.trim() || undefined,
        network: "testnet",
      });
      setResult(res);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Send XLM (Testnet)</h2>
      <p className="text-gray-400 text-sm mb-4">
        Sends native XLM from one Testnet account to another.
      </p>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Source Secret Key</label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="S..."
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Destination Public Key</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="G..."
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Amount (XLM)</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="10"
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Memo (optional)</label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Payment for..."
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={send}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded text-sm font-medium transition-colors"
        >
          {loading ? "Sending..." : "Send Payment"}
        </button>
      </div>

      {result && (
        <div className="mt-4 space-y-2">
          <p className="text-green-400 text-sm">Payment submitted.</p>
          <Field label="Transaction Hash" value={result.hash} />
          <Field label="Ledger" value={String(result.ledger)} />
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${result.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 text-sm underline"
          >
            View on Stellar Expert
          </a>
        </div>
      )}
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Account Info                                                         */
/* ------------------------------------------------------------------ */

function AccountInfoPanel() {
  const [publicKey, setPublicKey] = useState("");
  const [info, setInfo] = useState<{
    balances: { asset: string; balance: string }[];
    sequence: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setInfo(null);
    setError(null);
    try {
      const { getAccountInfo } = await import("@/lib/stellar/accounts");
      const result = await getAccountInfo(publicKey.trim(), "testnet");
      setInfo(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Account Info (Testnet)</h2>
      <p className="text-gray-400 text-sm mb-4">
        Fetches balances and sequence number for any Testnet account.
      </p>
      <label className="block text-sm text-gray-300 mb-1">Public Key</label>
      <input
        type="text"
        value={publicKey}
        onChange={(e) => setPublicKey(e.target.value)}
        placeholder="G..."
        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm font-mono mb-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <button
        onClick={load}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded text-sm font-medium transition-colors"
      >
        {loading ? "Loading..." : "Load Account"}
      </button>

      {info && (
        <div className="mt-5">
          <Field label="Sequence" value={info.sequence} />
          <p className="text-sm text-gray-300 mt-3 mb-2 font-medium">Balances</p>
          <div className="space-y-1">
            {info.balances.map((b) => (
              <div
                key={b.asset}
                className="flex justify-between bg-gray-800 rounded px-3 py-2 text-sm"
              >
                <span className="text-gray-400 font-mono truncate mr-4">{b.asset}</span>
                <span className="text-white font-mono">{b.balance}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared Field component                                               */
/* ------------------------------------------------------------------ */

function Field({
  label,
  value,
  secret = false,
}: {
  label: string;
  value: string;
  secret?: boolean;
}) {
  const [revealed, setRevealed] = useState(!secret);

  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <code className="flex-1 bg-gray-800 rounded px-3 py-2 text-xs font-mono break-all text-gray-200">
          {secret && !revealed ? "•".repeat(24) : value}
        </code>
        {secret && (
          <button
            onClick={() => setRevealed((r) => !r)}
            className="text-xs text-indigo-400 hover:text-indigo-300 shrink-0"
          >
            {revealed ? "Hide" : "Reveal"}
          </button>
        )}
      </div>
    </div>
  );
}
