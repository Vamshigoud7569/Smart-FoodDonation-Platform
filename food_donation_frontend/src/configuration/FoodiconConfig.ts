export interface IconConfig {
  iconPath: string;
  isImage: boolean;
}

interface IconMapping extends IconConfig {
  keywords: string[];
}

const foodIconMappings: IconMapping[] = [
  { keywords: ['meat', 'chicken', 'beef', 'pork','fish'], iconPath: '🍽️', isImage: true },
  { keywords: ['vegetable', 'veggie', 'greens'], iconPath: '🍽️', isImage: true },
  { keywords: ['fruit', 'apple', 'banana', 'orange'], iconPath: '🍽️', isImage: true },
  { keywords: ['dairy', 'milk', 'cheese', 'yogurt'], iconPath: '🍽️', isImage: true },
  { keywords: ['grain', 'bread', 'rice', 'pasta'], iconPath: '🍽️', isImage: true },
  { keywords: ['snack', 'chips', 'cookies', 'candy'], iconPath: '🍽️', isImage: true },
  { keywords: ['beverage', 'water', 'juice', 'soda'], iconPath: '🍽️', isImage: true },
 
];

export const DEFAULT_ICON: IconConfig = {
  iconPath: '🍽️',
  isImage: false,
};

// 🌟 Explicitly tell TypeScript this returns an IconConfig object
export const resolveFoodIcon = (text: string = ''): IconConfig => {
  const lowerText = text.toLowerCase();
  
  const match = foodIconMappings.find((mapping) =>
    mapping.keywords.some((keyword) => lowerText.includes(keyword))
  );

  // Returning the match (which drops keywords to match IconConfig) or default
  if (match) {
    return { iconPath: match.iconPath, isImage: match.isImage };
  }
  
  return DEFAULT_ICON;
};