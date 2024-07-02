import User from "@/models/userModel";
import { comparePasswords, createEmailVerificationToken } from "./userUtils";

export async function signUpWithEmail(userData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const newUser = new User(userData);
  await newUser.save();

  const verificationToken = createEmailVerificationToken(newUser);
  // Send the verification token via email (implement this as needed)

  return newUser;
}

export async function signInWithEmail(email: string, password: string) {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await comparePasswords(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  // Perform additional checks or return user data as needed
  return user;
}

export async function signUpWithGoogle(googleUserData: {
  name: string;
  email: string;
}) {
  let user = await User.findOne({ email: googleUserData.email });
  if (!user) {
    user = new User({
      name: googleUserData.name,
      email: googleUserData.email,
      usedOAuth: true,
      isVerified: true,
    });
    await user.save();
  }

  // Perform additional checks or return user data as needed
  return user;
}
