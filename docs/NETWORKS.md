# Network Configuration

## Supported Networks

| Network | Horizon URL                           | Passphrase                                       |
| ------- | ------------------------------------- | ------------------------------------------------ |
| Testnet | `https://horizon-testnet.stellar.org` | `Test SDF Network ; September 2015`              |
| Mainnet | `https://horizon.stellar.org`         | `Public Global Stellar Network ; September 2015` |
| Custom  | User-defined                          | User-defined                                     |

## Usage

```typescript
import { getServer, getNetworkConfig } from "./network";

// Default: testnet
const server = getServer();
const config = getNetworkConfig();

// Explicit
const server = getServer("mainnet");
const config = getNetworkConfig("mainnet");
```
