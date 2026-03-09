export type ActivityType = 'security' | 'billing' | 'team' | 'product';

export type ActivityFilter = ActivityType | 'all';

export interface ActivityItem {
  id: string;
  title: string;
  meta: string;
  type: ActivityType;
}
