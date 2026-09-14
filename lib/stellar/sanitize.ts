export function sanitizePublicKey(key: string): string {
  return key.trim().toUpperCase();
}

export function sanitizeAmount(amount: string): string {
  const cleaned = amount.trim().replace(/[^0-9.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) return parts[0] + "." + parts.slice(1).join("");
  return cleaned;
}

export function sanitizeMemo(memo: string, maxLength: number = 28): string {
  return memo.trim().slice(0, maxLength);
}

export function sanitizeAssetCode(code: string): string {
  return code
    .trim()
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 12);
}

export function sanitizeDomain(domain: string): string {
  return domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split("/")[0];
}
