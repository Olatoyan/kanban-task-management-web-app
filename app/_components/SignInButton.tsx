import { signInAction } from "@/app/_lib/actions";
import toast from "react-hot-toast";
import { getErrorMessage } from "../_lib/helper";
import { useRouter } from "next/navigation";
import Image from "next/image";

function SignInButton() {
  const router = useRouter();
  async function handleClick() {
    const isLoggedIn = await signInAction();
  }

  return (
    <form action={handleClick}>
      {/* <form> */}
      <button className="border-primary-300 flex items-center gap-6 border px-10 py-4 text-[1.4rem] font-medium text-white">
        <Image
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          height={24}
          width={24}
        />
        <span>Continue with Google</span>
      </button>
    </form>
  );
}

export default SignInButton;
