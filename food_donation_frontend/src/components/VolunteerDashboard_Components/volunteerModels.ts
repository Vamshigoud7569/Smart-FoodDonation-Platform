// components/VolunteerDashboard_Components/volunteerModels.ts

export type DeliveryStatus = 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'NOT_DELIVERED';
export type RequestStatus  = 'PENDING' | 'ACCEPTED' | 'IN_TRANSIT' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

export interface AvailablePickup {
  requestId: number;
  donationId: number;
  foodDescription: string;
  foodType: string;
  foodQuantity: string;
  pickupAddress: string;
  donorName: string;
  recipientName: string;
  status: RequestStatus;
  requestedAt: string;
  approvedAt: string;
}

export interface VolunteerDelivery {
  deliveryId: number;
  foodRequestId: number;
  donationId: number;
  foodDescription: string;
  foodQuantity: string;
  pickupAddress: string;
  donorName: string;
  donorPhone: string;
  recipientName: string;
  recipientPhone: string;
  deliveryStatus: DeliveryStatus;
  requestStatus: RequestStatus;
  claimedAt: string;
  transitStartedAt: string | null;
  completedAt: string | null;
}

export interface VolunteerDashboardDto {
  availablePickups: AvailablePickup[];
  activeDelivery: VolunteerDelivery | null;
  totalDeliveries: number;
  deliveredCount: number;
  cancelledCount: number;
  notDeliveredCount: number;
}

export interface VolunteerAnalyticsDto {
  totalDeliveries: number;
  delivered: number;
  cancelled: number;
  notDelivered: number;
  inProgress: number;
}

export interface AchievementResponse {
  id: string; icon: string; title: string; description: string;
  current: number; target: number; status: 'completed' | 'in-progress' | 'locked';
}

export interface BadgeResponse {
  id: string; icon: string; title: string; rarity: string;
  status: 'earned' | 'in-progress' | 'locked';
  progress: number | null; date: string | null; criteria: string;
}

export interface MilestoneResponse {
  title: string; currentValue: number; targetValue: number; rewardName: string;
}

export interface ProfileResponse {
  name: string; phone: string; city: string; createdAt: string; verified: boolean;
}

export interface VolunteerProfileDto {
  profileResponse: ProfileResponse;
  level: number; currentXp: number; xpTargetForNextLevel: number;
  achievementsCompleted: number; achievementsTotal: number;
  badgesEarned: number; badgesTotal: number;
  totalDeliveries: number; deliveredCount: number;
  nextMilestone: MilestoneResponse;
  achievements: AchievementResponse[];
  badges: BadgeResponse[];
}
