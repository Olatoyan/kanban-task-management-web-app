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

  console.log({ session });

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

  console.log(email);
  const isUserExists = await User.findOne({ email });

  console.log({ isUserExists });

  if (isUserExists) {
    throw new Error("There is already a user with that email");
  }

  console.log({ password });
  // const hashedPassword = await hashPassword(password);

  // console.log({ hashedPassword });
  const newUser = new User({ name, email, password });
  console.log({ newUser });
  const verificationToken = createEmailVerificationToken(newUser);

  const url = process.env.APP_URL;

  const verificationLink = `${url}/auth/verify-email?token=${verificationToken}`;

  console.log({ verificationToken });

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

  console.log({ newUser });

  return newUser;
}

export async function verifyEmail(token: string) {
  // Convert the token to a hashed value
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  console.log({ hashedToken });

  // Find the user with the hashed token
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    isVerified: false,
    // emailVerificationTokenExpires: { $gt: Date.now() }, // Check if the token is not expired
  });

  console.log("THIS IS THE USER", { user });

  if (user) {
    console.log("FOUND THE USER!!!!");
  }

  // Send an error response if the user is not found
  if (!user) {
    throw new Error("Invalid or expired verification token.");
  }

  // Update the user's verification status
  user.isVerified = true;
  user.emailVerificationToken = undefined;
  // user.emailVerificationToken = undefined;
  // user.emailVerificationTokenExpires = undefined;
  await user.save();

  const session = await createToken(user.email);

  // Save the session in a cookie
  cookies().set("session", session, {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
  });

  // Return plain object data instead of the user instance
  return { email: user.email, isVerified: user.isVerified };
}

export async function loginWithEmailAndPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isCorrect = await comparePasswords(password, user?.password);
  console.log({ isCorrect });

  if (!isCorrect) {
    throw new Error("Invalid email or password");
  }

  // if (!user || !(await comparePasswords(password, user?.password))) {
  //   throw new Error("Invalid email or password");
  // }

  if (!user.isVerified) {
    throw new Error("Please verify your email address first");
  }

  if (user.usedOAuth) {
    throw new Error("You are already logged in with an OAuth account");
  }

  console.log("SUCESSFULLY LOGGED IN!!!!!!!");

  const session = await createToken(email);

  // Save the session in a cookie
  cookies().set("session", session, {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
    secure: process.env.NODE_ENV === "production",
  });

  const test = await getSession();

  console.log({ test });

  return user;
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

// export async function updateSession(request: NextRequest) {
//   const session = request.cookies.get("session")?.value;
//   if (!session) return;

//   // Refresh the session so it doesn't expire
//   const parsed = await decrypt(session);
//   parsed.expires = new Date(Date.now() + 10 * 1000);
//   const res = NextResponse.next();

//   res.cookies.set("session", await encrypt(parsed), {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "Lax",
//     expires: parsed.expires,
//   });
//   return res;
// }
