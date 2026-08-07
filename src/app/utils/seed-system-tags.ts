/**
 * Seed System Tags
 *
 * Run this ONCE to populate system tags from leadCategories
 * These tags are read-only and available to all admins
 */


import Tag from "../model/Tag";

// Lead categories from your data.tsx
const leadCategories = {
  Buyer: [
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
  ],
  Seller: [
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
  ],
};

export async function seedSystemTags(
  isAgent: boolean,
  isBroker: boolean,
  userId: string,
  adminId?: string,
) {
  try {
    // Check if system tags already exist
    const existingSystemTags = await Tag.countDocuments({
      [isAgent ? "agent" : "admin"]: userId,
      isSystem: true,
    });

    if (existingSystemTags > 0) {
      console.log(
        `System tags already seeded (${existingSystemTags} tags found)`,
      );
      return {
        success: true,
        message: "System tags already exist",
        count: existingSystemTags,
      };
    }

    console.log("Seeding system tags...");

    // Create buyer system tags
    const buyerTags = leadCategories.Buyer.map((name, index) => ({
      name,
      category: "buyer" as const,
      order: index,
      color: "#0EA5E9", // Blue for buyers
      isSystem: true,
      admin: isAgent ? adminId : userId!,
      ...((isAgent || isBroker) && { agent: userId }),
    }));

    // Create seller system tags
    const sellerTags = leadCategories.Seller.map((name, index) => ({
      name,
      category: "seller" as const,
      order: index,
      color: "#F97316", // Orange for sellers
      isSystem: true,
      admin: isAgent ? adminId : userId!,
      ...((isAgent || isBroker) && { agent: userId }),
    }));

    // Insert all system tags.
    //
    // ordered: false so one clash cannot abandon the rest of the batch - a
    // half-seeded admin is worse than a skipped duplicate.
    const allSystemTags = [...buyerTags, ...sellerTags];

    let result: unknown[] = [];
    try {
      result = await Tag.insertMany(allSystemTags, { ordered: false });
    } catch (error: any) {
      // 11000 = duplicate key. The tag already exists, which is the desired
      // end state, so treat it as success and let anything else surface.
      if (error?.code !== 11000 && error?.writeErrors === undefined) throw error;

      result = error.insertedDocs ?? [];
      console.log(
        `Some system tags already existed and were skipped (${result.length} newly inserted)`,
      );
    }

    console.log(`✅ Successfully seeded ${result.length} system tags`);
    console.log(`   - ${buyerTags.length} buyer tags`);
    console.log(`   - ${sellerTags.length} seller tags`);

    return {
      success: true,
      message: "System tags seeded successfully",
      count: result.length,
      tags: result,
    };
  } catch (error: any) {
    console.error("❌ Error seeding system tags:", error);
    throw error;
  }
}

// Auto-run if this file is executed directly
// if (require.main === module) {
//   mongoose
//     .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/your-db")
//     .then(async () => {
//       console.log("Connected to MongoDB");
//       await seedSystemTags();
//       await mongoose.disconnect();
//       console.log("Disconnected from MongoDB");
//       process.exit(0);
//     })
//     .catch((error) => {
//       console.error("Failed to connect to MongoDB:", error);
//       process.exit(1);
//     });
// }

export { leadCategories };
