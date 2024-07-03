"use client";

import Spinner from "@/app/_components/Spinner";
import { verifyEmailAction } from "@/app/_lib/actions";
import { getErrorMessage } from "@/app/_lib/helper";
import { useBoard } from "@/app/context/BoardContext";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    state: { isLoading },
    setIsLoading,
  } = useBoard();

  // useEffect(() => {
  //   const verifyToken = async () => {
  //     const token = searchParams.get("token");
  //     if (token) {
  //       try {
  //         console.log(token);
  //         const newToken = await verifyEmailAction(token);
  //         console.log(newToken);
  //         toast.success("Email verified successfully");
  //         // redirect("/");
  //         router.push("/"); // Redirect to homepage after successful verification
  //       } catch (error) {
  //         // redirect("/auth/signup");
  //         toast.error("Invalid or expired verification token.");
  //         console.error("Error verifying email:", error);
  //         // Handle error or show error toast
  //         // router.push("/auth/signup"); // Redirect to homepage after successful verification
  //       }
  //     } else {
  //       console.log("No token provided");
  //     }
  //   };

  //   verifyToken();
  // }, [router, searchParams]);

  const verifyToken = async () => {
    setIsLoading(true);
    const token = searchParams.get("token");
    if (token) {
      try {
        console.log(token);
        const newToken = await verifyEmailAction(token);
        console.log(newToken);
        toast.success("Email verified successfully");
        // redirect("/");
        router.push("/"); // Redirect to homepage after successful verification
      } catch (error) {
        // redirect("/auth/signup");
        toast.error(getErrorMessage(error));
        console.error("Error verifying email:", error);
        // Handle error or show error toast
        router.push("/auth/signup"); // Redirect to homepage after successful verification
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("No token provided");
    }
  };

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="mb-4 text-[2.4rem]">
            Thank you for signing up! Please verify your email by clicking the
            button below.
          </p>
          <button
            onClick={verifyToken}
            className="rounded-[0.8rem] bg-purple-600 px-[1.6rem] py-4 text-[1.5rem] text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            Verify Email
          </button>
        </div>
      </div>

      {isLoading && <Spinner />}
    </>
  );
}

export default Page;
