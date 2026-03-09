import { UserRole } from './auth.model';
import { UserStatus } from './user.model';

export interface TeamMember extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
}

export interface TeamInvite {
  id: string;
  email: string;
  role: UserRole;
  invitedAt: string;
}
