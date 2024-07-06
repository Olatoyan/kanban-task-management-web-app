import Image from "next/image";
import Link from "next/link";
import ErrorImage from "@/public/404 error with people holding the numbers.gif";

function NotFound() {
  return (
    <section className="mt-8 space-y-[2.4rem] text-center">
      <Image src={ErrorImage} alt="404 error with people holding the numbers" />

      <h1 className="text-[3rem] font-semibold">
        This page could not be found :(
      </h1>
      <Link
        href="/"
        className="inline-block bg-[#635fc7] px-10 py-5 text-[1.6rem] text-white"
      >
        Go back home
      </Link>
    </section>
  );
}

export default NotFound;
