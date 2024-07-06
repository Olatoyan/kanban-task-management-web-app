import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt } from "./helper";

import User from "../../models/userModel";
import { comparePasswords, createEmailVerificationToken } from "./userUtils";
import connectToDb from "./connectDb";
import crypto from "crypto";
import { sendEmail } from "./sendEmail";

export async function createToken(email: string) {
  // Create the session
  const expires = new Date(Date.now() + 60 * 60 * 24 * 1000);
  const session = await encrypt({ email, expires });


  return session;
}

export async function createUserWithEmailAndPassword({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  await connectToDb();
  if (!name || !email || !password) {
    throw new Error("Please fill in all fields");
  }

  const isUserExists = await User.findOne({ email });


  if (isUserExists) {
    throw new Error("There is already a user with that email");
  }
  const newUser = new User({ name, email, password });
  const verificationToken = createEmailVerificationToken(newUser);

  const url = process.env.APP_URL;

  const verificationLink = `${url}/auth/verify-email?token=${verificationToken}`;


  const emailOptions = {
    email,
    subject: "Welcome to Toyan Kanban! Confirm Your Email Address",
    message: `
    <div style="background-color: #fafafa; padding: 20px; border-radius: 10px;">
    <h1 style="color: #633cff; margin-bottom: 20px;">Welcome aboard!</h1>
    <p style="color: #737373; margin-bottom: 15px;">Greetings from Toyan Kaban! We're thrilled to have you join our community.</p>
    <p style="color: #737373; margin-bottom: 15px;">To complete your registration and unlock all the amazing features, please click the button below to verify your email address:</p>
    <p style="text-align: center; margin-bottom: 20px;"><a href="${verificationLink}" style="background-color: #633cff; color: #fafafa; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Verify Email Address</a></p>
    <p style="color: #737373; margin-bottom: 15px;">Alternatively, you can copy and paste the following link into your browser:</p>
    <p style="color: #737373; margin-bottom: 15px;"><em>${verificationLink}</em></p>
    <p style="color: #737373; font-weight: bold;">If you didn't sign up for Toyan Kaban, no worries! Simply ignore this email.</p>
  </div>
    `,
  };

  await sendEmail({
    email,
    subject: emailOptions.subject,
    message: emailOptions.message,
  });

  await newUser.save();


  return newUser;
}

export async function verifyEmail(token: string) {
  await connectToDb();
  // Convert the token to a hashed value
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");


  // Find the user with the hashed token
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    isVerified: false,
  });



  if (!user) {
    throw new Error("Invalid or expired verification token.");
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  const session = await createToken(user.email);

  // Save the session in a cookie
  cookies().set("session", session, {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
  });

  return { email: user.email, isVerified: user.isVerified };
}

export async function loginWithEmailAndPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  await connectToDb();
  const user = await User.findOne({ email }).select("+password");


  if (!user) {
    return { error: "Invalid email or password" };
  }

  if (!user.isVerified) {
    return { error: "Please verify your email address first" };
  }

  if (user.usedOAuth) {
    return { error: "You are already logged in with an OAuth account" };
  }

  const isPasswordCorrect = await comparePasswords(password, user?.password);

  if (!isPasswordCorrect) {
    return { error: "Invalid email or password" };
  }


  const session = await createToken(email);

  cookies().set("session", session, {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
    secure: process.env.NODE_ENV === "production",
  });

  const test = await getSession();


  return { email: user.email, isVerified: user.isVerified };
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

