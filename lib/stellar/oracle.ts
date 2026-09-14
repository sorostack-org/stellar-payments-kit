export interface PriceFeed {
  asset: string;
  price: string;
  timestamp: number;
}

export async function getAssetPrice(assetCode: string, issuer?: string): Promise<PriceFeed> {
  const assetId = issuer ? `${assetCode}:${issuer}` : assetCode;
  const response = await fetch(`https://api.stellar.expert/api/v1/markets/${assetId}/price`);

  if (!response.ok) {
    throw new Error(`Price feed unavailable for ${assetId}`);
  }

  const data = await response.json();
  return {
    asset: assetId,
    price: data.price || "0",
    timestamp: Date.now(),
  };
}
