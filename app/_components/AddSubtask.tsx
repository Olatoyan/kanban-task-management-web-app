import { FieldErrors, UseFormRegister } from "react-hook-form";
import { BsX } from "react-icons/bs";
import ErrorMessage from "./ErrorMessage";

function AddSubtask({
  title,
  index,
  handleRemove,
  type,
  register,
  error,
}: {
  title?: string;
  index: number;
  handleRemove: (index: number) => void;
  type?: string;
  register: UseFormRegister<any>;
  error: FieldErrors<any>;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-full">
        <input
          type="text"
          defaultValue={title}
          id={`task-${index}`}
          className={`w-full rounded-[0.4rem] border bg-[#2B2C37] px-6 py-3 text-[1.3rem] font-medium leading-[2.3rem] text-white outline-[0] placeholder:text-opacity-25 ${error?.[`task-${index}`]?.message ? "border-[#ea5555] focus:border-[#ea5555]" : "border-[rgba(130,143,163,0.25)] hover:border-[#635fc7] focus:border-[#635fc7] focus:outline-[#635fc7]"}`}
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
          })}
        />
        {error?.[`task-${index}`]?.message && (
          <ErrorMessage>
            {error[`task-${index}`]!.message as string}
          </ErrorMessage>
        )}
      </div>
      <div onClick={() => handleRemove(index)}>
        <BsX className="text-[2rem] text-[#828fa3]" />
      </div>
    </div>
  );
}

export default AddSubtask;
