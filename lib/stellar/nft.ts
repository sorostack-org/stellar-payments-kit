export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

export interface NFTBalance {
  contractId: string;
  tokenId: string;
  metadata: NFTMetadata;
  owner: string;
}

export function validateNFTMetadata(metadata: NFTMetadata): boolean {
  if (!metadata.name || metadata.name.length === 0) return false;
  if (!metadata.description || metadata.description.length === 0) return false;
  try {
    new URL(metadata.image);
    return true;
  } catch {
    return false;
  }
}

export function formatNFTIdentifier(contractId: string, tokenId: string): string {
  return `${contractId}:${tokenId}`;
}

export function parseNFTIdentifier(identifier: string): {
  contractId: string;
  tokenId: string;
} {
  const parts = identifier.split(":");
  return { contractId: parts[0], tokenId: parts.slice(1).join(":") };
}
