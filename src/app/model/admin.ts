import mongoose, { Schema, model, models, Document, Model } from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Define an interface for Admin document
export interface IAdmin extends Document {
  fname: string;
  lname: string;
  email: string;
  password: string;
  tokens: { token: string }[];
  generateAuthToken(): Promise<string>;
  verifyCredentials(password: string): Promise<boolean>;
}

// Define a separate interface for the Admin model (to include static methods)
export interface IAdminModel extends Model<IAdmin> {
  findByCredentials(email: string, password: string): Promise<IAdmin>;
}

// Define schema
const adminSchema = new Schema<IAdmin>(
  {
    fname: { type: String, required: true, trim: true, default: "Jane" },
    lname: { type: String, required: true, trim: true, default: "Doe" },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value: string) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    tokens: [
      {
        token: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Remove sensitive fields from response
adminSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  return user;
};

// Generate JWT Token
adminSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  user.tokens.push({ token });
  await user.save();
  return token;
};

// Find user by email and password
adminSchema.statics.findByCredentials = async function (
  email: string,
  password: string
): Promise<IAdmin> {
  const user = await this.findOne({ email });
  if (!user) throw new Error("Invalid login credentials.");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid login credentials.");

  return user;
};

// Verify password
adminSchema.methods.verifyCredentials = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

// Pre-save middleware for hashing passwords
adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Prevent OverwriteModelError
const Admin =
  (models.Admin as IAdminModel) ||
  model<IAdmin, IAdminModel>("Admin", adminSchema);

export default Admin;
