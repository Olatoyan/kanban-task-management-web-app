"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";

import { BsEyeSlash, BsEyeFill } from "react-icons/bs";
import Button from "./Button";
import { useState } from "react";
import { loginWithEmailAction } from "../_lib/actions";
import { getErrorMessage } from "../_lib/helper";
import toast from "react-hot-toast";
import SignInButton from "./SignInButton";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useBoard } from "../context/BoardContext";
import Spinner from "./Spinner";

function Login() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    setError,
  } = useForm();

  const {
    setIsLoading,
    state: { isLoading },
  } = useBoard();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email) || "Invalid email address";
  };

  async function onSubmit(data: any) {
    setIsLoading(true);
    try {
      const { email, password } = data;
      const session = await loginWithEmailAction({ email, password });
      if (session) {
        router.push("/");
        toast.success("Welcome back!");
      }
      console.log(session);
      // Handle successful login (e.g., redirect to dashboard)
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  }

  console.log(errors);

  return (
    <>
      <section className="flex w-full items-center justify-center bg-[#20212c]">
        <section className="flex w-full max-w-[60rem] flex-col items-center gap-12 bg-[#2b2c37] p-[3.2rem]">
          <Image
            src="/logo-light.svg"
            alt="logo"
            width={155}
            height={26}
            className=""
          />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-[2.4rem]"
          >
            <div>
              <h2 className="text-[2.4rem] font-bold text-white">
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
                className={`text-[1.2rem] font-bold text-white`}
              >
                Email
              </label>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  id="email"
                  className={`w-full rounded-[0.4rem] border bg-transparent px-6 py-3 text-[1.6rem] font-medium leading-[2.3rem] outline-[0] placeholder:text-opacity-25 ${errors?.email?.message ? "border-[#ea5555] focus:border-[#ea5555]" : "border-[rgba(130,143,163,0.25)] hover:border-[#635fc7] focus:border-[#635fc7] focus:outline-[#635fc7]"} text-white`}
                  placeholder="Enter your email here"
                  {...register("email", {
                    required: "Can't be empty",
                    validate: validateEmail,
                  })}
                />
                {errors?.email?.message && (
                  <p className="text-[1.2rem] font-medium leading-[2.3rem] text-[#ea5555]">
                    {errors.email.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label
                htmlFor="password"
                className={`text-[1.2rem] font-bold text-white`}
              >
                Password
              </label>
              <div className="relative flex flex-col gap-4">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`w-full rounded-[0.4rem] border bg-transparent px-6 py-3 text-[1.6rem] font-medium leading-[2.3rem] outline-[0] placeholder:text-opacity-25 ${errors?.password?.message ? "border-[#ea5555] focus:border-[#ea5555]" : "border-[rgba(130,143,163,0.25)] hover:border-[#635fc7] focus:border-[#635fc7] focus:outline-[#635fc7]"} text-white`}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Can't be empty",
                  })}
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-[1rem] cursor-pointer text-[2rem] text-[#828fa3]"
                >
                  {showPassword ? <BsEyeSlash /> : <BsEyeFill />}
                </span>
                {errors?.password?.message && (
                  <p className="text-[1.2rem] font-medium leading-[2.3rem] text-[#ea5555]">
                    {errors.password.message as string}
                  </p>
                )}
              </div>
            </div>
            <p className="text-[1.4rem] text-[#fff]">
              Don&#39;t have an account with us yet?{"   "}
              <Link href="/auth/signup" className="font-bold text-[#635fc7]">
                Create one now
              </Link>
            </p>

            <Button pendingLabel="Logging in" label="Log Into Your Account" />
          </form>

          <p className="text-[1.5rem] text-[#fff]">OR</p>
          <SignInButton />
        </section>
      </section>

      {isLoading && <Spinner />}
    </>
  );
}

export default Login;
