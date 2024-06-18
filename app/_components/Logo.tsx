import Image from "next/image";

function Logo() {
  return (
    <Image
      src="/logo-light.svg"
      alt="logo"
      width={155}
      height={26}
      className="ml-[3.2rem]"
    />
  );
}

export default Logo;
