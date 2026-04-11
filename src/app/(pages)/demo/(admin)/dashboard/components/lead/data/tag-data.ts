/**
 * Tag System Data
 * 
 * Contains 26 system tags (13 buyer + 13 seller)
 * Color mappings, groupings, and dummy data
 */

import { LeadCategory, BuyerTag, SellerTag, Tag } from "../types/lead.types";

// ======================
//  SYSTEM TAGS
// ======================

export const BUYER_TAGS: BuyerTag[] = [
  "new lead",
  "contacted",
  "needs consultation",
  "pre-approval in progress",
  "pre-approved",
  "property viewing scheduled",
  "viewed property",
  "actively searching",
  "offer made",
  "under negotiation",
  "closed deal",
  "cold lead",
  "lost lead",
];

export const SELLER_TAGS: SellerTag[] = [
  "new lead",
  "contacted",
  "needs valuation",
  "valuation report sent",
  "considering listing",
  "ready to list",
  "staging & photography",
  "property listed",
  "offer received",
  "under contract",
  "sold",
  "cold lead",
  "lost lead",
];

// ======================
//  TAG COLOR SYSTEM
// ======================

export type TagColorKey =
  | "new"
  | "inProgress"
  | "engaged"
  | "won"
  | "cold"
  | "lost";

export const TAG_COLORS: Record<TagColorKey, string> = {
  new: "#2196f3", // Blue
  inProgress: "#ff9800", // Orange
  engaged: "#4caf50", // Green
  won: "#388e3c", // Dark Green
  cold: "#9e9e9e", // Gray
  lost: "#757575", // Dark Gray
};

// Map each tag to its color
export const TAG_COLOR_MAP: Record<string, string> = {
  // New/Fresh leads
  "new lead": TAG_COLORS.new,

  // In progress
  contacted: TAG_COLORS.inProgress,
  "needs consultation": TAG_COLORS.inProgress,
  "pre-approval in progress": TAG_COLORS.inProgress,
  "needs valuation": TAG_COLORS.inProgress,
  "considering listing": TAG_COLORS.inProgress,

  // Engaged/Active
  "pre-approved": TAG_COLORS.engaged,
  "property viewing scheduled": TAG_COLORS.engaged,
  "viewed property": TAG_COLORS.engaged,
  "actively searching": TAG_COLORS.engaged,
  "valuation report sent": TAG_COLORS.engaged,
  "ready to list": TAG_COLORS.engaged,
  "staging & photography": TAG_COLORS.engaged,

  // High engagement
  "offer made": TAG_COLORS.engaged,
  "under negotiation": TAG_COLORS.engaged,
  "property listed": TAG_COLORS.engaged,
  "offer received": TAG_COLORS.engaged,
  "under contract": TAG_COLORS.engaged,

  // Won
  "closed deal": TAG_COLORS.won,
  sold: TAG_COLORS.won,

  // Cold/Lost
  "cold lead": TAG_COLORS.cold,
  "lost lead": TAG_COLORS.lost,
};

// ======================
//  TAG GROUPINGS
// ======================

export interface TagGroup {
  label: string;
  tags: string[];
  color: string;
}

export const BUYER_TAG_GROUPS: TagGroup[] = [
  {
    label: "New & Initial Contact",
    tags: ["new lead", "contacted", "needs consultation"],
    color: TAG_COLORS.new,
  },
  {
    label: "Pre-Approval Process",
    tags: ["pre-approval in progress", "pre-approved"],
    color: TAG_COLORS.inProgress,
  },
  {
    label: "Property Search",
    tags: [
      "property viewing scheduled",
      "viewed property",
      "actively searching",
    ],
    color: TAG_COLORS.engaged,
  },
  {
    label: "Offer & Negotiation",
    tags: ["offer made", "under negotiation"],
    color: TAG_COLORS.engaged,
  },
  {
    label: "Final Outcomes",
    tags: ["closed deal", "cold lead", "lost lead"],
    color: TAG_COLORS.won,
  },
];

export const SELLER_TAG_GROUPS: TagGroup[] = [
  {
    label: "New & Initial Contact",
    tags: ["new lead", "contacted"],
    color: TAG_COLORS.new,
  },
  {
    label: "Valuation Process",
    tags: ["needs valuation", "valuation report sent"],
    color: TAG_COLORS.inProgress,
  },
  {
    label: "Listing Preparation",
    tags: ["considering listing", "ready to list", "staging & photography"],
    color: TAG_COLORS.engaged,
  },
  {
    label: "Active Listing",
    tags: ["property listed", "offer received", "under contract"],
    color: TAG_COLORS.engaged,
  },
  {
    label: "Final Outcomes",
    tags: ["sold", "cold lead", "lost lead"],
    color: TAG_COLORS.won,
  },
];

// ======================
//  TAG METADATA
// ======================

export const TAG_DESCRIPTIONS: Record<string, string> = {
  // Buyer
  "new lead": "Fresh lead, initial inquiry received",
  contacted: "Agent has made initial contact",
  "needs consultation": "Ready for consultation appointment",
  "pre-approval in progress": "Working with lender on pre-approval",
  "pre-approved": "Pre-approved and ready to search",
  "property viewing scheduled": "Tour scheduled",
  "viewed property": "Has viewed at least one property",
  "actively searching": "Actively viewing multiple properties",
  "offer made": "Submitted offer on property",
  "under negotiation": "Negotiating offer terms",
  "closed deal": "Successfully purchased property",

  // Seller
  "needs valuation": "Requested home valuation",
  "valuation report sent": "Valuation report delivered",
  "considering listing": "Evaluating whether to list",
  "ready to list": "Decided to list, preparing property",
  "staging & photography": "Staging and photos in progress",
  "property listed": "Property actively listed",
  "offer received": "Received offer on property",
  "under contract": "Accepted offer, in contract",
  sold: "Successfully sold property",

  // Common
  "cold lead": "Low engagement, needs nurturing",
  "lost lead": "Lost to competitor or withdrew",
};

// ======================
//  DUMMY TAG DATA
// ======================

export const generateDummyTags = (): Tag[] => {
  const tags: Tag[] = [];

  // Generate buyer system tags
  BUYER_TAGS.forEach((tagName, index) => {
    tags.push({
      _id: `buyer_tag_${index + 1}`,
      name: tagName,
      category: "buyer",
      color: TAG_COLOR_MAP[tagName] || TAG_COLORS.new,
      isSystem: true,
      description: TAG_DESCRIPTIONS[tagName],
      order: index,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    });
  });

  // Generate seller system tags
  SELLER_TAGS.forEach((tagName, index) => {
    tags.push({
      _id: `seller_tag_${index + 1}`,
      name: tagName,
      category: "seller",
      color: TAG_COLOR_MAP[tagName] || TAG_COLORS.new,
      isSystem: true,
      description: TAG_DESCRIPTIONS[tagName],
      order: index,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    });
  });

  // Add some custom tags as examples
  tags.push(
    {
      _id: "custom_1",
      name: "VIP Client",
      category: "buyer",
      color: "#9c27b0", // Purple
      isSystem: false,
      description: "High-value client requiring priority attention",
      order: 100,
      createdAt: new Date("2024-02-15"),
      updatedAt: new Date("2024-02-15"),
    },
    {
      _id: "custom_2",
      name: "Referral",
      category: "buyer",
      color: "#00bcd4", // Cyan
      isSystem: false,
      description: "Client referred by existing customer",
      order: 101,
      createdAt: new Date("2024-02-20"),
      updatedAt: new Date("2024-02-20"),
    },
    {
      _id: "custom_3",
      name: "Luxury Listing",
      category: "seller",
      color: "#ff5722", // Deep Orange
      isSystem: false,
      description: "High-end luxury property listing",
      order: 102,
      createdAt: new Date("2024-03-01"),
      updatedAt: new Date("2024-03-01"),
    }
  );

  return tags;
};

// ======================
//  HELPER FUNCTIONS
// ======================

/**
 * Get all tags for a specific category
 */
export const getTagsByCategory = (
  tags: Tag[],
  category: LeadCategory
): Tag[] => {
  return tags.filter((tag) => tag.category === category);
};

/**
 * Get system tags only
 */
export const getSystemTags = (tags: Tag[]): Tag[] => {
  return tags.filter((tag) => tag.isSystem);
};

/**
 * Get custom tags only
 */
export const getCustomTags = (tags: Tag[]): Tag[] => {
  return tags.filter((tag) => !tag.isSystem);
};

/**
 * Get tag by name
 */
export const getTagByName = (tags: Tag[], name: string): Tag | undefined => {
  return tags.find((tag) => tag.name.toLowerCase() === name.toLowerCase());
};

/**
 * Get tag color (with fallback)
 */
export const getTagColor = (tagName: string, tags?: Tag[]): string => {
  // First, try to find in provided tags array
  if (tags) {
    const tag = getTagByName(tags, tagName);
    if (tag) return tag.color;
  }

  // Fallback to color map
  return TAG_COLOR_MAP[tagName.toLowerCase()] || TAG_COLORS.new;
};

/**
 * Check if tag is a system tag
 */
export const isSystemTag = (tagName: string): boolean => {
  return (
    BUYER_TAGS.includes(tagName as BuyerTag) ||
    SELLER_TAGS.includes(tagName as SellerTag)
  );
};

/**
 * Get tag group for a specific tag
 */
export const getTagGroup = (
  tagName: string,
  category: LeadCategory
): TagGroup | undefined => {
  const groups = category === "buyer" ? BUYER_TAG_GROUPS : SELLER_TAG_GROUPS;
  return groups.find((group) =>
    group.tags.some((t) => t.toLowerCase() === tagName.toLowerCase())
  );
};

// Export dummy data instance
export const DUMMY_TAGS = generateDummyTags();
