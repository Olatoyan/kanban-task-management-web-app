// userUtils.ts
import { IUser } from "@/models/userModel";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

export const comparePasswords = async (
  candidatePassword: string,
  userPassword: string,
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const createEmailVerificationToken = (user: IUser) => {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  return verificationToken;
};

export const createPasswordResetToken = (user: IUser) => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};
