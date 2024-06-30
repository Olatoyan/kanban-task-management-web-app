import Image from "next/image";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";

function Logo() {
  const {
    state: { isDarkMode },
  } = useTheme();

  return (
    <Link href="/">
      <Image
        src={isDarkMode ? "/logo-light.svg" : "/logo-dark.svg"}
        alt="logo"
        width={155}
        height={26}
        className="ml-[3.2rem]"
      />
    </Link>
  );
}

export default Logo;
