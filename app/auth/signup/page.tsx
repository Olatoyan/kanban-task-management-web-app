import SignUp from "@/app/_components/SignUp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
};

function page() {
  return <SignUp />;
}

export default page;
