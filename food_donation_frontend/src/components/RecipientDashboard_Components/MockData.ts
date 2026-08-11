// components/RecipientDashboard_Components/mockData.ts
import type { DonationListing, RecipientVerification, RecipientProfileStats } from './recipientModels';





export const initialProfileStats: RecipientProfileStats = {
  location: 'Nizamabad',
  joinedDate: '05/07/2026',
  phone: '7569604184',
  level: 1,
  xp: 8,
  xpTarget: 100,
  mealsReceived: 8,
  peopleHelped: 2,
  achievements: [
    { id: 'ach-1', label: 'Verified Account', hint: 'Complete document verification', unlocked: true },
    { id: 'ach-2', label: 'First Request Sent', hint: 'Send your first donation request', unlocked: false },
    { id: 'ach-3', label: '5 Requests Fulfilled', hint: 'Have 5 requests marked fulfilled', unlocked: false },
    { id: 'ach-4', label: '50 Meals Received', hint: 'Receive 50 meals in total', unlocked: false },
    { id: 'ach-5', label: '100 People Helped', hint: 'Support 100 people through received donations', unlocked: false },
  ],
  badges: [
    { id: 'bdg-1', label: 'Newcomer', hint: 'Joined FoodShare', unlocked: true },
    { id: 'bdg-2', label: 'Trusted Partner', hint: 'Verified receiver', unlocked: false },
    { id: 'bdg-3', label: 'Community Anchor', hint: '25 requests fulfilled', unlocked: false },
    { id: 'bdg-4', label: 'Steady Supporter', hint: 'Active for 3 months', unlocked: false },
    { id: 'bdg-5', label: 'Impact Builder', hint: '100 meals received', unlocked: false },
    { id: 'bdg-6', label: 'Milestone Maker', hint: 'Hit your first milestone', unlocked: false },
    { id: 'bdg-7', label: 'Legacy Partner', hint: '1 year on FoodShare', unlocked: false },
  ],
  nextMilestone: {
    label: "Receive 92 more meals to unlock \"Community Anchor\"",
    rewardLabel: 'Community Anchor Badge',
    progress: 8,
    target: 100,
  },
};