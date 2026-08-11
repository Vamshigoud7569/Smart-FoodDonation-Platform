// components/RecipientDashboard_Components/recipientModels.ts
export type ReceiverType = 'NGO' | 'ORPHANAGE' | 'INDIVIDUAL';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface UploadedDocument {
  label: string;
  fileName: string;
}

export interface RecipientVerification {
  receiverType: ReceiverType | null;
  status: VerificationStatus;
  documents: UploadedDocument[];
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface DonationListing {
  id: number;
  foodDescription: string;
  foodType: string;
  foodQuantity: string;
  pickupAddress: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  name:string;
}

export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED' | 'IN_TRANSIT';

export interface FoodRequest {
  id: number;
  user_id: number;
  donation_id: number;
  foodDescription: string;
  foodType: string;
  foodQuantity: string;
  pickupAddress: string;
  donorName: string;
  volunteerName: string | null;
  status: RequestStatus;
  requestedAt?: string;
  approvedAt?: string;
}

/* ---------- Gamification ---------- */
export interface TrophyItem {
  id: string;
  label: string;
  hint: string;
  unlocked: boolean;
}

export interface AchievementResponse {
  id: string;
  icon: string;
  title: string;
  description: string;
  current: number;
  target: number;
  status: 'completed' | 'in-progress' | 'locked';
}

export interface BadgeResponse {
  id: string;
  icon: string;
  title: string;
  rarity: string;
  status: 'earned' | 'in-progress' | 'locked';
  progress: number | null;
  date: string | null;
  criteria: string;
}

export interface MilestoneResponse {
  title: string;
  currentValue: number;
  targetValue: number;
  rewardName: string;
}

export interface ProfileResponse {
  name: string;
  phone: string;
  city: string;
  createdAt: string;
  verified: boolean;
}
export interface RecipientProfileDto {
  profileResponse: ProfileResponse;

  level: number;
  currentXp: number;
  xpTargetForNextLevel: number;

  achievementsCompleted: number;
  achievementsTotal: number;

  badgesEarned: number;
  badgesTotal: number;

  totalMealsReceived: number;
  peopleServed: number;

  nextMilestone: MilestoneResponse | null;

  achievements: AchievementResponse[];
  badges: BadgeResponse[];
}
