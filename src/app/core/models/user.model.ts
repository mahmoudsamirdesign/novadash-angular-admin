import { UserRole } from './auth.model';

export type UserStatus = 'active' | 'pending' | 'inactive';

export interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  team: string;
  status: UserStatus;
  lastActive: string;
}

export interface UserStats {
  total: number;
  activeToday: number;
  pendingInvites: number;
}
