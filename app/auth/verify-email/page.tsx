"use client";

import { useRouter, useSearchParams } from "next/navigation";

import toast from "react-hot-toast";

import Spinner from "@/app/_components/Spinner";
import { verifyEmailAction } from "@/app/_lib/actions";
import { getErrorMessage } from "@/app/_lib/helper";
import { useBoard } from "@/app/_context/BoardContext";

function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    state: { isLoading },
    setIsLoading,
  } = useBoard();

  const verifyToken = async () => {
    setIsLoading(true);
    const token = searchParams.get("token");
    if (token) {
      try {
        await verifyEmailAction(token);
        toast.success("Email verified successfully");
        router.push("/");
      } catch (error) {
        toast.error(getErrorMessage(error));
        router.push("/auth/signup");
      } finally {
        setIsLoading(false);
      }
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
