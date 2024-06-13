import User from "@/models/userModel";
import connectToDb from "./connectDb";

export async function createUser({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  await connectToDb();
  console.log(name, email);
  const user = new User({ name, email });

  await user.save();
}

export async function getUser(email: string) {
  await connectToDb();

  const user = User.findOne({ email });

  return user;
}
