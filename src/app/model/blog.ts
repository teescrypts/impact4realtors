import mongoose, { Schema, Document } from "mongoose";

interface IBlogPost extends Document {
  admin: Schema.Types.ObjectId;
  title?: string;
  shortDescription?: string;
  author?: string;
  estReadTime?: number;
  cover?: {
    url?: string;
    imageId?: string;
    fileName?: string;
  };
  content?: string;
  status: "Draft" | "Published";
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    admin: { type: Schema.Types.ObjectId, required: true, ref: "Admin" },
    title: {
      type: String,
      required: function (this: IBlogPost) {
        return this.status === "Published";
      },
    },
    shortDescription: {
      type: String,
      required: function (this: IBlogPost) {
        return this.status === "Published";
      },
    },
    author: {
      type: String,
      required: function (this: IBlogPost) {
        return this.status === "Published";
      },
    },
    estReadTime: {
      type: Number,
      min: 1,
      required: function (this: IBlogPost) {
        return this.status === "Published";
      },
    },
    cover: {
      url: {
        type: String,
        required: function (this: IBlogPost) {
          return this.status === "Published";
        },
      },
      fileName: { type: String },
      imageId: { type: String },
    },
    content: {
      type: String,
      required: function (this: IBlogPost) {
        return this.status === "Published";
      },
    },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      required: true,
    },
  },
  { timestamps: true }
);

const BlogPost =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
