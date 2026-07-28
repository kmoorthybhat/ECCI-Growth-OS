import { UserRole, Tier } from '../types';

export const INNOVATOR_MASTER_EMAIL = 'kmoorthy.bhat@gmail.com';

export interface UserSession {
  email: string;
  name: string;
  role: UserRole;
  tier: Tier;
  activeClientId: string;
  isGodMode: boolean;
}

export const DEFAULT_INNOVATOR_SESSION: UserSession = {
  email: 'kmoorthy.bhat@gmail.com',
  name: 'Krishna Moorthy M (Innovator / God Mode)',
  role: 'innovator',
  tier: 'Enterprise',
  activeClientId: 'client_ecc_cafe',
  isGodMode: true,
};

export const DEFAULT_CLIENT_SESSION: UserSession = {
  email: 'owner@energizecultcafe.com',
  name: 'Energize Cult Cafe (Client Portal)',
  role: 'client',
  tier: 'Enterprise',
  activeClientId: 'client_ecc_cafe',
  isGodMode: false,
};

export function canAccessInnovator(session: UserSession): boolean {
  return session.role === 'innovator' || session.isGodMode;
}

export function canAccessClientData(session: UserSession, targetClientId: string): boolean {
  if (session.isGodMode || session.role === 'innovator') return true;
  return session.activeClientId === targetClientId;
}
