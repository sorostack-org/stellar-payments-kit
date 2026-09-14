export interface Identity {
  publicKey: string;
  secretKey: string | null;
  label?: string;
}

export interface IdentityManager {
  identities: Identity[];
  defaultIdentity: string | null;
}

export function createIdentityManager(): IdentityManager {
  return { identities: [], defaultIdentity: null };
}

export function addIdentity(manager: IdentityManager, identity: Identity): IdentityManager {
  return {
    ...manager,
    identities: [...manager.identities, identity],
  };
}

export function removeIdentity(manager: IdentityManager, publicKey: string): IdentityManager {
  return {
    ...manager,
    identities: manager.identities.filter((i) => i.publicKey !== publicKey),
    defaultIdentity: manager.defaultIdentity === publicKey ? null : manager.defaultIdentity,
  };
}

export function setDefaultIdentity(manager: IdentityManager, publicKey: string): IdentityManager {
  if (!manager.identities.find((i) => i.publicKey === publicKey)) {
    throw new Error(`Identity ${publicKey} not found`);
  }
  return { ...manager, defaultIdentity: publicKey };
}

export function getDefaultIdentity(manager: IdentityManager): Identity | null {
  if (!manager.defaultIdentity) return null;
  return manager.identities.find((i) => i.publicKey === manager.defaultIdentity) ?? null;
}
