import { signInAction } from "@/app/_lib/actions";

function SignInButton() {
  return (
    <form action={signInAction}>
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
