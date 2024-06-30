"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { BsX } from "react-icons/bs";
import ErrorMessage from "./ErrorMessage";
import { MouseEventHandler } from "react";
import { useTheme } from "../context/ThemeContext";

function AddSubtask({
  title,
  index,
  handleRemove,
  type,
  register,
  error,
  handleChange,
}: {
  title?: string;
  index: number;
  handleRemove: MouseEventHandler<HTMLDivElement>;
  handleChange: (value: string) => void;
  type?: string;
  register: UseFormRegister<any>;
  error: FieldErrors<any>;
}) {
  console.log(title);

  const {
    state: { isDarkMode },
  } = useTheme();

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-full">
        <input
          type="text"
          value={title}
          id={`task-${index}`}
          className={`w-full rounded-[0.4rem] border bg-transparent px-6 py-3 text-[1.3rem] font-medium leading-[2.3rem] outline-[0] placeholder:text-opacity-25 ${error?.[`task-${index}`]?.message ? "border-[#ea5555] focus:border-[#ea5555]" : "border-[rgba(130,143,163,0.25)] hover:border-[#635fc7] focus:border-[#635fc7] focus:outline-[#635fc7]"} ${isDarkMode ? "text-white" : "text-[#000112]"}`}
          placeholder={
            type === "column"
              ? "Enter your column name here"
              : "Enter your subtask name here"
          }
          {...register(`task-${index}`, {
            required: "Can't be empty",
            minLength: {
              value: 3,
              message: "Too short",
            },
            maxLength: {
              value: 15,
              message: "Too long",
            },
            onChange: (e) => handleChange(e.target.value),
          })}
        />
        {error?.[`task-${index}`]?.message && (
          <ErrorMessage>
            {error[`task-${index}`]!.message as string}
          </ErrorMessage>
        )}
      </div>
      <div
        onClick={handleRemove}
        className="cursor-pointer text-[2rem] text-[#828fa3] transition-all duration-300 hover:text-[#ea5555]"
      >
        <BsX />
      </div>
    </div>
  );
}

export default AddSubtask;
