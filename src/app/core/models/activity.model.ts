export type ActivityType = 'security' | 'billing' | 'team' | 'product';

export type ActivityFilter = ActivityType | 'all';

export interface ActivityItem extends Record<string, unknown> {
  id: string;
  title: string;
  meta: string;
  type: ActivityType;
}
