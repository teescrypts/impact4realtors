import { Journey } from "./type";


export const mockJourneys: Journey[] = [
  {
    id: "1",
    name: "New Buyer Welcome Sequence",
    contactType: "buyer",
    entryAction: {
      tagAction: { type: "assign", tagName: "new-buyer" },
    },
    isActive: true,
    steps: [
      {
        id: "s1",
        type: "email",
        title: "Welcome Email",
        description:
          "Send personalized welcome email with property search tips",
        trigger: { type: "timing", timing: { type: "immediate" } },
      },
      {
        id: "s2",
        type: "call",
        title: "Introduction Call",
        description: "Schedule a call to understand their needs",
        trigger: {
          type: "timing",
          timing: { type: "delay", delayValue: 1, delayUnit: "days" },
        },
      },
      {
        id: "s3",
        type: "email",
        title: "Property Listings",
        description: "Send curated property listings based on preferences",
        trigger: {
          type: "action",
          tagAction: { type: "assign", tagName: "preferences-set" },
        },
      },
      {
        id: "s4",
        type: "meeting",
        title: "Property Viewing",
        description: "Schedule first property viewing",
        trigger: {
          type: "timing",
          timing: { type: "delay", delayValue: 5, delayUnit: "days" },
        },
      },
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "Seller Listing Follow-up",
    contactType: "seller",
    entryAction: {
      tagAction: {
        type: "change",
        tagName: "listing-draft",
        newTagName: "listing-live",
      },
    },
    isActive: true,
    steps: [
      {
        id: "s1",
        type: "email",
        title: "Listing Confirmation",
        description: "Confirm listing is live with link",
        trigger: { type: "timing", timing: { type: "immediate" } },
      },
      {
        id: "s2",
        type: "sms",
        title: "Viewing Stats Update",
        description: "Send weekly viewing statistics",
        trigger: {
          type: "timing",
          timing: { type: "delay", delayValue: 7, delayUnit: "days" },
        },
      },
    ],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "3",
    name: "Open House Follow-up",
    contactType: "buyer",
    entryAction: {
      tagAction: { type: "assign", tagName: "open-house-attended" },
    },
    isActive: false,
    steps: [
      {
        id: "s1",
        type: "email",
        title: "Thank You Email",
        description: "Thank them for attending",
        trigger: { type: "timing", timing: { type: "immediate" } },
      },
      {
        id: "s2",
        type: "call",
        title: "Feedback Call",
        description: "Get their thoughts on the property",
        trigger: {
          type: "action",
          tagAction: { type: "assign", tagName: "interested" },
        },
      },
    ],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "4",
    name: "Price Reduction Alert",
    contactType: "seller",
    entryAction: {
      tagAction: {
        type: "change",
        tagName: "price-original",
        newTagName: "price-reduced",
      },
    },
    isActive: true,
    steps: [
      {
        id: "s1",
        type: "email",
        title: "Price Change Notification",
        description: "Notify interested buyers of price change",
        trigger: { type: "timing", timing: { type: "immediate" } },
      },
      {
        id: "s2",
        type: "sms",
        title: "Quick Alert",
        description: "SMS blast to hot leads",
        trigger: {
          type: "timing",
          timing: { type: "delay", delayValue: 30, delayUnit: "minutes" },
        },
      },
    ],
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-15"),
  },
];
