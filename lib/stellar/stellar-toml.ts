export interface StellarToml {
  federationServer?: string;
  authServer?: string;
  transferServer?: string;
  kycServer?: string;
  webAuthEndpoint?: string;
  signingKey?: string;
  networkPassphrase?: string;
  currencies?: StellarTomlCurrency[];
  validators?: StellarTomlValidator[];
}

export interface StellarTomlCurrency {
  code: string;
  issuer: string;
  status?: string;
  name?: string;
  desc?: string;
  conditions?: string;
}

export interface StellarTomlValidator {
  alias?: string;
  displayName?: string;
  publicKey?: string;
  host?: string;
}

export async function fetchStellarToml(domain: string): Promise<StellarToml> {
  const url = `https://${domain}/.well-known/stellar.toml`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch stellar.toml from ${url}`);
  }

  const text = await response.text();
  return parseToml(text);
}

function parseToml(text: string): StellarToml {
  const result: StellarToml = {};
  const lines = text.split("\n");

  let currentSection = "general";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const sectionMatch = trimmed.match(/^\[(\w+)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      continue;
    }

    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;

    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed
      .slice(eqIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    if (currentSection === "general") {
      const keyMap: Record<string, keyof StellarToml> = {
        FEDERATION_SERVER: "federationServer",
        AUTH_SERVER: "authServer",
        TRANSFER_SERVER: "transferServer",
        KYC_SERVER: "kycServer",
        WEB_AUTH_ENDPOINT: "webAuthEndpoint",
        SIGNING_KEY: "signingKey",
        NETWORK_PASSPHRASE: "networkPassphrase",
      };
      const mapped = keyMap[key];
      if (mapped) (result as any)[mapped] = value;
    }
  }

  return result;
}
