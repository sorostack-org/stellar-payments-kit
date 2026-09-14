# Permissions Guide

## Stellar Account Permissions

- **Master Weight** — Controls the master key pair's signing weight
- **Low Threshold** — Required for low-security operations
- **Medium Threshold** — Required for standard operations
- **High Threshold** — Required for high-security operations

## Common Configurations

### Single User

- Master weight: 1
- Low/Med/High thresholds: 1

### Multisig (2-of-3)

- Master weight: 0 (disabled)
- Three signers with weight 1 each
- All thresholds: 2

## Changing Permissions

Use the `setOptions` operation to modify signers and thresholds.
