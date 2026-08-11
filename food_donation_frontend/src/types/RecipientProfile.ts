// types/RecipientProfile.ts

export interface RecipientProfileInfo {
  name: string;
  city: string;
  phone: string;
  createdAt: string;
}

export interface RecipientAchievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  current: number;
  target: number;
  status: 'completed' | 'in-progress' | 'locked';
}

export interface RecipientBadge {
  id: string;
  icon: string;
  title: string;
  rarity: string;
  status: 'earned' | 'in-progress' | 'locked';
  date?: string;
  progress?: number;
  criteria: string;
}

export interface RecipientNextMilestone {
  title: string;
  currentValue: number;
  targetValue: number;
  rewardName: string;
}

export interface RecipientDashboardData {
  profile: RecipientProfileInfo;
  level: number;
  currentXp: number;
  xpTargetForNextLevel: number;
  achievementsCompleted: number;
  achievementsTotal: number;
  badgesEarned: number;
  badgesTotal: number;
  totalMealsReceived: number;
  peopleServed: number;
  nextMilestone: RecipientNextMilestone;
  achievements: RecipientAchievement[];
  badges: RecipientBadge[];
}

/*
 * Suggested backend seed content — mirrors Donor's achievement/badge
 * structure, retargeted at requester activity instead of donation activity:
 *
 * Achievements:
 *  - "Verified Account"     — complete document verification
 *  - "First Request Sent"   — send your first donation request
 *  - "5 Requests Fulfilled" — have 5 requests marked fulfilled
 *  - "50 Meals Received"    — receive 50 meals in total
 *  - "100 People Served"    — support 100 people through received donations
 *  - "Consistent Requester" — request at least once a week for a month
 *
 * Badges:
 *  - "Newcomer"         (common)    — joined FoodShare
 *  - "Trusted Partner"  (uncommon)  — verified receiver
 *  - "Community Anchor" (rare)      — 25 requests fulfilled
 *  - "Steady Supporter" (rare)      — active for 3 months
 *  - "Impact Builder"   (epic)      — 100 meals received
 *  - "Legacy Partner"   (legendary) — 1 year on FoodShare
 */