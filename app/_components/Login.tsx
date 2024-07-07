"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsEyeSlash, BsEyeFill } from "react-icons/bs";
import toast from "react-hot-toast";

import { loginWithEmailAction } from "@/app/_lib/actions";
import { useBoard } from "@/app/_context/BoardContext";
import { useTheme } from "@/app/_context/ThemeContext";

import SignInButton from "./SignInButton";
import Button from "./Button";
import Spinner from "./Spinner";
import ErrorMessage from "./ErrorMessage";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    setIsLoading,
    state: { isLoading },
  } = useBoard();

  const {
    state: { isDarkMode },
  } = useTheme();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email) || "Invalid email address";
  };

  async function onSubmit(data: any) {
    setIsLoading(true);
    const { email, password } = data;
    const result = await loginWithEmailAction({ email, password });

    if (result?.error) {
      toast.error(result?.error);
    }

    router.push("/");
    toast.success("Successfully logged in");

    setIsLoading(false);
  }

  return (
    <>
      <section
        className={`flex w-full items-center justify-center ${isDarkMode ? "bg-[#20212c]" : "bg-[#f9fafb]"}`}
      >
        <section
          className={`flex w-full max-w-[60rem] flex-col items-center gap-12 p-[3.2rem] ${isDarkMode ? "bg-[#2b2c37]" : "bg-white"}`}
        >
          <Image
            src={isDarkMode ? "/logo-light.svg" : "/logo-dark.svg"}
            alt="logo"
            width={155}
            height={26}
          />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-[2.4rem]"
          >
            <div>
              <h2
                className={`text-[2.4rem] font-bold ${isDarkMode ? "text-white" : "text-[#000112]"} `}
              >
                Welcome Back!
              </h2>
              <p className="text-[1.4rem] text-[#828fa3]">
                Log in to your account to continue managing your projects and
                tasks seamlessly.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <label
                htmlFor="email"
                className={`text-[1.2rem] font-bold ${isDarkMode ? "text-white" : "text-[#000112]"}`}
              >
                Email
              </label>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  id="email"
                  className={`w-full rounded-[0.4rem] border bg-transparent px-6 py-3 text-[1.6rem] font-medium leading-[2.3rem] outline-[0] placeholder:text-opacity-25 ${errors?.email?.message ? "border-[#ea5555] focus:border-[#ea5555]" : "border-[rgba(130,143,163,0.25)] hover:border-[#635fc7] focus:border-[#635fc7] focus:outline-[#635fc7]"} ${isDarkMode ? "text-white" : "text-[#000112]"}`}
                  placeholder="Enter your email here"
                  {...register("email", {
                    required: "Can't be empty",
                    validate: validateEmail,
                  })}
                />
                {errors?.email?.message && (
                  <ErrorMessage>{errors.email.message as string}</ErrorMessage>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label
                htmlFor="password"
                className={`text-[1.2rem] font-bold ${isDarkMode ? "text-white" : "text-[#000112]"}`}
              >
                Password
              </label>
              <div className="relative flex flex-col gap-4">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`w-full rounded-[0.4rem] border bg-transparent px-6 py-3 text-[1.6rem] font-medium leading-[2.3rem] outline-[0] placeholder:text-opacity-25 ${errors?.password?.message ? "border-[#ea5555] focus:border-[#ea5555]" : "border-[rgba(130,143,163,0.25)] hover:border-[#635fc7] focus:border-[#635fc7] focus:outline-[#635fc7]"} ${isDarkMode ? "text-white" : "text-[#000112]"}`}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Can't be empty",
                  })}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-[1rem] cursor-pointer text-[2rem] text-[#828fa3]"
                >
                  {showPassword ? <BsEyeSlash /> : <BsEyeFill />}
                </button>
                {errors?.password?.message && (
                  <ErrorMessage>
                    {errors.password.message as string}
                  </ErrorMessage>
                )}
              </div>
            </div>
            <p
              className={`text-[1.4rem] ${isDarkMode ? "text-white" : "text-[#000112]"}`}
            >
              Don&#39;t have an account with us yet?{"   "}
              <Link href="/auth/signup" className="font-bold text-[#635fc7]">
                Create one now
              </Link>
            </p>

            <Button pendingLabel="Logging in" label="Log Into Your Account" />
          </form>

          <p
            className={`text-[1.5rem] ${isDarkMode ? "text-white" : "text-[#000112]"}`}
          >
            OR
          </p>
          <SignInButton isDarkMode={isDarkMode} />
        </section>
      </section>

      {isLoading && <Spinner />}
    </>
  );
}

export default Login;
