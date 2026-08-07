import mongoose, { Schema, Document, Model } from "mongoose";
import { clearModelInDev } from "@/app/lib/register-model";

export interface ITag extends Document {
  _id: string;
  name: string;
  category: "buyer" | "seller";
  order: number;
  color: string;
  isSystem: boolean;
  admin: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  agent?: Schema.Types.ObjectId;
}

const TagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: [true, "Tag name is required"],
      trim: true,
      maxlength: [50, "Tag name cannot exceed 50 characters"],
    },
    category: {
      type: String,
      enum: {
        values: ["buyer", "seller"],
        message: "Category must be either buyer or seller",
      },
      required: [true, "Category is required"],
    },
    order: {
      type: Number,
      required: [true, "Order is required"],
      min: [0, "Order must be non-negative"],
    },
    color: {
      type: String,
      required: [true, "Color is required"],
      match: [/^#[0-9A-F]{6}$/i, "Color must be a valid hex color"],
      default: "#0EA5E9",
    },
    isSystem: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },

    agent: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for efficient queries
TagSchema.index({ admin: 1, category: 1, order: 1 });
TagSchema.index({ isSystem: 1, category: 1 });

/**
 * Unique constraint: a tag name is unique per category, per owner.
 *
 * `agent` is part of the key because agents under the same broker share an
 * `admin` id — without it, the second agent of a brokerage could not seed
 * their own tags. Tags with no agent index as null, which still stops one
 * admin holding two tags of the same name.
 *
 * NOTE: this deliberately does NOT special-case `isSystem`. System tags are
 * seeded per admin, not shared globally, so a constraint spanning admins
 * would let the first admin seed and block everyone after them.
 */
TagSchema.index(
  { name: 1, category: 1, admin: 1, agent: 1 },
  { unique: true },
);

// Virtual for checking if tag can be modified
TagSchema.virtual("isEditable").get(function (this: ITag) {
  return !this.isSystem;
});

// Static method: Get all tags for an admin (system + custom)
TagSchema.statics.getAdminTags = async function (
  adminId: string | null,
  category?: "buyer" | "seller",
) {
  const query: any = {
    $or: [{ admin: adminId }, { isSystem: true }],
  };

  if (category) {
    query.category = category;
  }

  return this.find(query).sort({ category: 1, order: 1 }).lean();
};

// Static method: Check if tag is in use
TagSchema.statics.isTagInUse = async function (tagName: string) {
  const Lead = mongoose.model("Lead");
  const count = await Lead.countDocuments({ status: tagName });
  return count > 0;
};

// Pre-delete hook: Prevent deletion of system tags
TagSchema.pre("deleteOne", { document: true, query: false }, async function () {
  if (this.isSystem) {
    throw new Error("System tags cannot be deleted");
  }
});

// Pre-update hook: Prevent modification of system tags (except order)
TagSchema.pre("findOneAndUpdate", async function (next) {
  const update: any = this.getUpdate();

  // Allow order updates for system tags (for reordering)
  const onlyOrderUpdate =
    update.$set &&
    Object.keys(update.$set).length === 1 &&
    "order" in update.$set;

  if (!onlyOrderUpdate) {
    const doc = await this.model.findOne(this.getQuery());
    if (doc?.isSystem) {
      throw new Error(
        "System tags cannot be modified. Only reordering is allowed.",
      );
    }
  }

  next();
});

clearModelInDev("Tag");

const Tag: Model<ITag> =
  mongoose.models.Tag || mongoose.model<ITag>("Tag", TagSchema);

export default Tag;
