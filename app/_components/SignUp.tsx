"use client";

import Image from "next/image";
import Link from "next/link";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsEyeSlash, BsEyeFill } from "react-icons/bs";
import toast from "react-hot-toast";

import ErrorMessage from "@/app/_components/ErrorMessage";
import { signupWithEmailAction } from "@/app/_lib/actions";
import { getErrorMessage } from "@/app/_lib/helper";
import { useBoard } from "@/app/_context/BoardContext";
import { useTheme } from "@/app/_context/ThemeContext";

import SignInButton from "./SignInButton";
import Spinner from "./Spinner";
import Button from "./Button";

type SignUpType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function SignUp() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm<SignUpType>();

  const {
    setIsLoading,
    state: { isLoading },
  } = useBoard();

  const {
    state: { isDarkMode },
  } = useTheme();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email) || "Invalid email address";
  };
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    return (
      passwordRegex.test(password) ||
      "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, and one special character"
    );
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    return (
      confirmPassword === getValues("password") || "Passwords do not match"
    );
  };

  async function onSubmit(data: SignUpType) {
    setIsLoading(true);
    try {
      const { name, email, password } = data;
      await signupWithEmailAction({ name, email, password });
      toast.success("Please check your email for verification");
    } catch (error) {
      toast.error("There is already an account with this email");
    } finally {
      setIsLoading(false);
      reset();
    }
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
                Join Toyan Kanban!
              </h2>
              <p className="text-[1.4rem] text-[#828fa3]">
                Create your account to start streamlining your workflow with our
                powerful Kanban application.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <label
                htmlFor="name"
                className={`text-[1.2rem] font-bold ${isDarkMode ? "text-white" : "text-[#000112]"}`}
              >
                Name
              </label>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  id="name"
                  className={`w-full rounded-[0.4rem] border bg-transparent px-6 py-3 text-[1.6rem] font-medium leading-[2.3rem] outline-[0] placeholder:text-opacity-25 ${errors?.name?.message ? "border-[#ea5555] focus:border-[#ea5555]" : "border-[rgba(130,143,163,0.25)] hover:border-[#635fc7] focus:border-[#635fc7] focus:outline-[#635fc7]"} ${isDarkMode ? "text-white" : "text-[#000112]"}`}
                  placeholder="Enter your name here"
                  {...register("name", {
                    required: "Can't be empty",
                    minLength: {
                      value: 3,
                      message: "Must be at least 3 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Must be less than 50 characters",
                    },
                  })}
                />
                {errors?.name?.message && (
                  <ErrorMessage>
                    {errors.name.message as string}
                  </ErrorMessage>
                )}
              </div>
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
                  <ErrorMessage>
                    {errors.email.message as string}
                  </ErrorMessage>
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
                  placeholder="Must be at least 8 characters"
                  {...register("password", {
                    required: "Can't be empty",
                    validate: validatePassword,
                  })}
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-[1rem] cursor-pointer text-[2rem] text-[#828fa3]"
                >
                  {showPassword ? <BsEyeSlash /> : <BsEyeFill />}
                </span>
                {errors?.password?.message && (
                  <ErrorMessage>
                    {errors.password.message as string}
                  </ErrorMessage>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label
                htmlFor="confirmPassword"
                className={`text-[1.2rem] font-bold ${isDarkMode ? "text-white" : "text-[#000112]"}`}
              >
                Confirm Password
              </label>
              <div className="flex flex-col gap-4">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  className={`w-full rounded-[0.4rem] border bg-transparent px-6 py-3 text-[1.6rem] font-medium leading-[2.3rem] outline-[0] placeholder:text-opacity-25 ${errors?.confirmPassword?.message ? "border-[#ea5555] focus:border-[#ea5555]" : "border-[rgba(130,143,163,0.25)] hover:border-[#635fc7] focus:border-[#7b7aa5] focus:outline-[#635fc7]"} ${isDarkMode ? "text-white" : "text-[#000112]"}`}
                  placeholder="Please confirm your password"
                  {...register("confirmPassword", {
                    required: "Can't be empty",
                    validate: validateConfirmPassword,
                  })}
                />

                {errors?.confirmPassword?.message && (
                  <ErrorMessage>
                    {errors.confirmPassword.message as string}
                  </ErrorMessage>
                )}
              </div>
            </div>
            <p
              className={`text-[1.4rem] ${isDarkMode ? "text-white" : "text-[#000112]"}`}
            >
              Already have an account with us?{" "}
              <Link href="/auth/login" className="font-bold text-[#635fc7]">
                Login
              </Link>
            </p>
            <Button pendingLabel="Creating" label="Create Your Account" />
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

export default SignUp;
