import Image from "next/image";
import Link from "next/link";

function Logo() {
  return (
    <Link href="/">
      <Image
        src="/logo-light.svg"
        alt="logo"
        width={155}
        height={26}
        className="ml-[3.2rem]"
      />
    </Link>
  );
}

export default Logo;
