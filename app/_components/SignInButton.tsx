import { signInAction } from "@/app/_lib/actions";
import toast from "react-hot-toast";
import { getErrorMessage } from "../_lib/helper";
import { useRouter } from "next/navigation";

function SignInButton() {
  const router = useRouter();
  async function handleClick() {
    try {
      const isLoggedIn = await signInAction();

      console.log({ isLoggedIn });
    } catch (error) {
      console.log("ERRORRRRR😫😫😫😫😫😫😫😫😫", error);
      toast.error(getErrorMessage(error));
      router.push("/auth/login");
    }
  }

  return (
    <form action={handleClick}>
      {/* <form> */}
      <button className="border-primary-300 flex items-center gap-6 border px-10 py-4 text-[1.4rem] font-medium text-white">
        <img
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          height="24"
          width="24"
        />
        <span>Continue with Google</span>
      </button>
    </form>
  );
}

export default SignInButton;
