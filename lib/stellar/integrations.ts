export interface IntegrationProvider {
  name: string;
  baseUrl: string;
  apiKey: string;
}

export function createProvider(name: string, baseUrl: string, apiKey: string): IntegrationProvider {
  return { name, baseUrl, apiKey };
}

export async function callProviderApi<T>(
  provider: IntegrationProvider,
  endpoint: string,
  method: string = "GET",
  body?: unknown,
): Promise<T> {
  const response = await fetch(`${provider.baseUrl}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`${provider.name} API error: ${response.status}`);
  }

  return response.json();
}
