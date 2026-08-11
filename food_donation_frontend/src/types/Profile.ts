export  interface Profile
{
    name:string;
    phone:string;
    city:string;
    createdAt:string;
    verified:boolean;
    
}
export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  current: number;
  target: number;
  status: 'completed' | 'in-progress' | 'locked';
}

export interface Badge {
  id: string;
  icon: string;
  title: string;
  rarity: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  status: 'earned' | 'in-progress' | 'locked';
  progress?: number;
  date?: string;
  criteria: string;
}

export interface Milestone {
  title: string;
  currentValue: number;
  targetValue: number;
  rewardName: string;
}

export interface DashboardData {
  profile: Profile;
  level: number;
  currentXp: number;
  xpTargetForNextLevel: number;
  achievementsCompleted: number;
  achievementsTotal: number;
  badgesEarned: number;
  badgesTotal: number;
  totalMeals: number;
  peopleHelped: number;
  nextMilestone: Milestone;
  achievements: Achievement[];
  badges: Badge[];
}