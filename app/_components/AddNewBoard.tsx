import { useEffect, useState } from "react";
import { useBoard } from "../context/BoardContext";
import AddSubtask from "./AddSubtask";
import Button from "./Button";
import { createNewBoardAction } from "../_lib/actions";
import { useForm } from "react-hook-form";
import { NewBoardFormType } from "../_lib/type";
import ErrorMessage from "./ErrorMessage";
import { useRouter } from "next/navigation";
import { getAllTasks } from "../_lib/data-service";
import { validateBoardName, validateColumns } from "../_lib/helper";

type columnFormProp = { name: string };

function AddNewBoard({
  allBoardNames,
}: {
  allBoardNames: { id: string; name: string }[];
}) {
  const router = useRouter();

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

  const { clearSelectedTask, setIsLoading } = useBoard();
  const [isAddColumn, setIsAddColumn] = useState(false);

  const columns: columnFormProp[] = getValues("columns");
  console.log(columns);

  useEffect(() => {
    // This effect will run whenever 'columns' value changes after 'setValue' call
  }, [isAddColumn]);

  function updateColumns() {
    console.log("clicked");

    const updatedColumns = [...columns, { name: "", id: "" }];

    console.log({ updatedColumns });

    setValue("columns", updatedColumns);

    setIsAddColumn((prev) => !prev);
  }

  function removeColumn(index: number) {
    console.log(index);

    const updatedColumns = columns.filter((_, i) => index !== i);
    console.log({ updatedColumns });
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

  // async function onSubmit(data: NewBoardFormType) {
  //   console.log(data);

  //   // await createNewBoardAction(data);
  // }

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

  console.log(errors);

  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center">
      <form
        className={`z-[10] flex max-h-[55rem] w-full max-w-[50rem] flex-col gap-10 overflow-auto rounded-[0.6rem] bg-[#2b2c37] p-[3.2rem]`}
        // action={createNewTaskAction}
        // action={clientcreateNewBoardAction}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3 className="text-[1.8rem] font-bold text-white">Add New Board</h3>

        <div className="flex flex-col gap-3">
          <label
            htmlFor="boardName"
            className="text-[1.2rem] font-bold text-white"
          >
            Board Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="boardName"
              className={`w-full rounded-[0.4rem] border bg-[#2B2C37] px-6 py-3 text-[1.3rem] font-medium leading-[2.3rem] text-white outline-[0] placeholder:text-opacity-25 ${errors?.name?.message ? "border-[#ea5555] focus:border-[#ea5555]" : "border-[rgba(130,143,163,0.25)] hover:border-[#635fc7] focus:border-[#635fc7] focus:outline-[#635fc7]"}`}
              placeholder="Enter your Board name here"
              {...register("name", {
                required: "Can't be empty",
                minLength: {
                  value: 3,
                  message: "Must be at least 3 characters",
                },
                maxLength: {
                  value: 15,
                  message: "Must be less than 15 characters",
                },
              })}
            />
            {errors?.name?.message && (
              <ErrorMessage>{errors.name.message}</ErrorMessage>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[1.2rem] font-bold text-white">Board Columns</p>

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
          <p
            className="cursor-pointer rounded-[2rem] bg-white py-[0.85rem] text-center text-[1.3rem] font-bold leading-[2.3rem] text-[#635fc7]"
            onClick={updateColumns}
          >
            + Add New Column
          </p>
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
