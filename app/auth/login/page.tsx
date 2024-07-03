import Login from "@/app/_components/Login";
import SignInButton from "@/app/_components/SignInButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return <Login />;
}
