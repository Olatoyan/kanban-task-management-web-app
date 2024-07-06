import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  isVerified?: boolean;
  usedOAuth?: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  boards?: string[];
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please enter an email address"],
    validate: [validator.isEmail, "Please enter a valid email address"],
    lowercase: true,
  },
  password: {
    type: String,
    required: function (this: IUser) {
      return !this.usedOAuth;
    },
    minLength: 8,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  usedOAuth: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: { type: String, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },

  boards: [{ type: Schema.Types.ObjectId, ref: "Board" }],
});

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (!this.usedOAuth) {
    this.password = await bcrypt.hash(this.password!, 12);
  }

  next();
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
