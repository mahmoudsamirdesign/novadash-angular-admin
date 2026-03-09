export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
