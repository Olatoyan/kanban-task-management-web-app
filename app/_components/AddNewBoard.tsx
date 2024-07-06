import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useBoard } from "@/app/_context/BoardContext";
import { useTheme } from "@/app/_context/ThemeContext";

import { createNewBoardAction } from "@/app/_lib/actions";
import { NewBoardFormType } from "@/app/_lib/type";
import { validateBoardName, validateColumns } from "@/app/_lib/helper";

import AddSubtask from "./AddSubtask";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

type columnFormProp = { name: string };

function AddNewBoard({
  allBoardNames,
}: {
  allBoardNames: { id: string; name: string }[];
}) {
  const router = useRouter();

  const { clearSelectedTask, setIsLoading } = useBoard();
  const {
    state: { isDarkMode },
  } = useTheme();

  const [isAddColumn, setIsAddColumn] = useState(false);

  useEffect(() => {
    // This effect will run whenever 'columns' value changes after 'setValue' call
  }, [isAddColumn]);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    setError,
  } = useForm<NewBoardFormType>({
    defaultValues: {
      name: "",
      columns: [
        {
          name: "",
          id: "",
        },
      ],
    },
  });

  const columns: columnFormProp[] = getValues("columns");

  function addNewColumn() {
    const updatedColumns = [...columns, { name: "", id: "" }];
    setValue("columns", updatedColumns);
    setIsAddColumn((prev) => !prev);
  }

  function removeColumn(index: number) {
    const updatedColumns = columns.filter((_, i) => index !== i);
    setValue("columns", updatedColumns);
    setIsAddColumn((prev) => !prev);
  }

  function updateColumnName(index: number, name: string) {
    const updatedColumns = columns.map((column, i) =>
      i === index ? { ...column, name } : column,
    );

    setValue("columns", updatedColumns);
    setIsAddColumn((prev) => !prev);
  }

  async function onSubmit(data: NewBoardFormType) {
    setIsLoading(true);

    if (!validateBoardName(data.name, "", allBoardNames, setError)) {
      setIsLoading(false);
      return;
    }

    if (!validateColumns([], data.columns, setError)) {
      setIsLoading(false);
      return;
    }

    try {
      await createNewBoardAction(data);
      const newName = data.name.split(" ").join("+");
      router.push(`/?board=${newName}`);
    } catch (error) {
      console.error("Failed to update board:", error);
    } finally {
      clearSelectedTask();
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center">
      <form
        className={`z-[10] mx-8 flex max-h-[55rem] w-full max-w-[50rem] flex-col gap-10 overflow-auto rounded-[0.6rem] p-[3.2rem] tablet:px-8 ${isDarkMode ? "bg-[#2b2c37]" : "bg-white"}`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3
          className={`text-[1.8rem] font-bold ${isDarkMode ? "text-white" : "text-[#000112]"}`}
        >
          Add New Board
        </h3>

        <div className="flex flex-col gap-3">
          <label
            htmlFor="boardName"
            className={`text-[1.2rem] font-bold ${isDarkMode ? "text-white" : "text-[#828fa3]"}`}
          >
            Board Name
          </label>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              id="boardName"
              className={`w-full rounded-[0.4rem] border bg-transparent px-6 py-3 text-[1.6rem] font-medium leading-[2.3rem] outline-[0] placeholder:text-opacity-25 ${errors?.name?.message ? "border-[#ea5555] focus:border-[#ea5555]" : "border-[rgba(130,143,163,0.25)] hover:border-[#635fc7] focus:border-[#635fc7] focus:outline-[#635fc7]"} ${isDarkMode ? "text-white" : "text-[#000112]"}`}
              placeholder="Enter your Board name here"
              {...register("name", {
                required: "Can't be empty",
                minLength: {
                  value: 3,
                  message: "Must be at least 3 characters",
                },
                maxLength: {
                  value: 30,
                  message: "Must be less than 30 characters",
                },
              })}
            />
            {errors?.name?.message && (
              <ErrorMessage>{errors.name.message}</ErrorMessage>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p
            className={`text-[1.2rem] font-bold ${isDarkMode ? "text-white" : "text-[#828fa3]"}`}
          >
            Board Columns
          </p>

          <div className="custom-scrollbar flex max-h-[16rem] flex-col gap-5 overflow-auto">
            {columns.map((subtask, index) => (
              <AddSubtask
                key={index}
                title={subtask.name}
                index={index}
                type="column"
                handleRemove={() => removeColumn(index)}
                handleChange={(name) => updateColumnName(index, name)}
                register={register}
                error={errors}
              />
            ))}
          </div>
          <button
            type="button"
            className={`cursor-pointer rounded-[2rem] py-[0.85rem] text-center text-[1.3rem] font-bold leading-[2.3rem] text-[#635fc7] transition-all duration-300 ${isDarkMode ? "bg-white" : "bg-[rgba(99,95,199,0.10)] hover:bg-[rgba(99,95,199,0.25)]"}`}
            onClick={addNewColumn}
          >
            + Add New Column
          </button>
        </div>

        <Button pendingLabel="Creating" label="Create New Board" />
      </form>

      <div
        className="fixed bottom-0 left-0 right-0 top-0 h-full w-full bg-black/50"
        onClick={clearSelectedTask}
      ></div>
    </div>
  );
}

export default AddNewBoard;
