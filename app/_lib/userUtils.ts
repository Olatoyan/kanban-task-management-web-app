// userUtils.ts
import { IUser } from "@/models/userModel";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const comparePasswords = async (
  candidatePassword: string,
  userPassword: string,
) => {
  if (
    typeof candidatePassword !== "string" ||
    typeof userPassword !== "string"
  ) {
    throw new Error("Both passwords must be strings");
  }
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
