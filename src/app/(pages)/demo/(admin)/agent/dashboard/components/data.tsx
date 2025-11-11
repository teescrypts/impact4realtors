export const leadCategories: { [key: string]: string[] } = {
  "House Tour Leads": [
    "new lead",
    "contacted",
    "scheduled viewing",
    "viewed property",
    "follow-up sent",
    "second viewing scheduled",
    "offer made",
    "under negotiation",
    "closed deal",
    "lost lead",
    "cold lead",
  ] as const,

  "Home Seller Leads": [
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
    "lost lead",
    "cold lead",
  ] as const,

  "Mortgage Inquiry Leads": [
    "new lead",
    "contacted",
    "needs consultation",
    "pre-approval in progress",
    "pre-approved",
    "actively searching",
    "offer made",
    "closed deal",
    "unresponsive",
    "cold lead",
  ] as const,

  "General Inquiry Leads": [
    "new lead",
    "contacted",
    "needs info",
    "qualified",
    "active client",
    "closed deal",
    "cold lead",
    "lost lead",
  ] as const,
};

export const sampleLeads = [
  {
    id: "1",
    name: "John Doe",
    email: "johnjggyttytytytthgghhghv@example.com",
    phone: "123-456-7890",
    stage: "Scheduled",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    stage: "Viewed Property",
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "555-555-5555",
    stage: "Offer Made",
  },
];
