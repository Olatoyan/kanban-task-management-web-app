"use client";

import { verifyEmailAction } from "@/app/_lib/actions";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

function Page() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          console.log(token);
          const newToken = await verifyEmailAction(token);
          console.log(newToken);
          toast.success("Email verified successfully");
          redirect("/");
          // router.push('/'); // Redirect to homepage after successful verification
        } catch (error) {
          redirect("/auth/signup");
          console.error("Error verifying email:", error);
          // Handle error or show error toast
          toast.error("Invalid or expired verification token.");
        }
      } else {
        console.log("No token provided");
      }
    };

    verifyToken();
  }, [token]);

  function handleVerifyToken() {
    console.log("clicked");
  }

  return (
    <div></div>
    // <div className="flex w-full flex-col items-center justify-center bg-gray-900 text-white">
    //   <div className="text-center">
    //     <p className="mb-4 text-[2.4rem]">
    //       Thank you for signing up! Please verify your email by clicking the
    //       button below.
    //     </p>
    //     <button
    //       onClick={handleVerifyToken}
    //       className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
    //     >
    //       Receive Token
    //     </button>
    //   </div>
    // </div>
  );
}

export default Page;
