"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-6 bg-[#2b2c37]">
      <h1 className="text-[3rem] font-semibold text-white">
        Something went wrong!
      </h1>
      <p className="text-lg text-[#828fa3]">{error.message}</p>

      <Link
        href="/"
        className="inline-block bg-[#635fc7] px-[2.4rem] py-5 text-[1.6rem] text-white"
        onClick={reset}
      >
        Go back home
      </Link>
    </section>
  );
}
