import { useEffect, useState } from "react";
import { useBoard } from "../context/BoardContext";
import AddSubtask from "./AddSubtask";
import Button from "./Button";
import { BoardType, NewBoardFormType } from "@/app/_lib/type";
import {
  addColumnsToExistingBoardAction,
  updateBoardAction,
} from "../_lib/actions";
import { useRouter } from "next/navigation";
import { UseFormSetError, useForm } from "react-hook-form";
import { validateColumns } from "../_lib/helper";
import { useTheme } from "../context/ThemeContext";

type columnFormProp = { name: string };
function AddNewColumn({ board }: { board: BoardType }) {
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
      columns: [
        {
          name: "",
        },
      ],
    },
  });
  const { clearSelectedTask, setIsLoading } = useBoard();
  const {
    state: { isDarkMode },
  } = useTheme();

  const [isAddColumn, setIsAddColumn] = useState(false);

  const columns: columnFormProp[] = getValues("columns");
  console.log(columns);

  useEffect(() => {
    // This effect will run whenever 'columns' value changes after 'setValue' call
  }, [isAddColumn]);

  function updateColumns() {
    console.log("clicked");

    const updatedColumns = [...columns, { name: "" }];

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
  // async function clientaddColumnsToExistingBoardActionAction(formData: FormData) {
  //   const result = await addColumnsToExistingBoardAction(formData);

  //   console.log("ok");
  //   console.log(result);
  // }

  async function onSubmit(data: NewBoardFormType) {
    setIsLoading(true);

    console.log({ data });

    if (!validateColumns(board.columns, data.columns, setError)) {
      setIsLoading(false);
      return;
    }

    try {
      const newData = await addColumnsToExistingBoardAction({
        ...data,
        id: board._id!,
      });
      console.log({ newData });

      // const newName = newData.name.split(" ").join("+");

      // router.push(`/?board=${newName}`);
    } catch (error) {
      console.error("Failed to update board:", error);
    } finally {
      clearSelectedTask();
      setIsLoading(false);
    }
  }

  console.log(board);

  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center">
      <form
        className={`z-[10] mx-8 flex max-h-[55rem] w-full max-w-[50rem] flex-col gap-10 overflow-auto rounded-[0.6rem] p-[3.2rem] tablet:px-8 ${isDarkMode ? "bg-[#2b2c37]" : "bg-white"}`}
        // action={createNewTaskAction}
        // action={clientaddColumnsToExistingBoardActionAction}
        // onSubmit={clearSelectedTask}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3
          className={`text-[1.8rem] font-bold ${isDarkMode ? "text-white" : "text-[#000112]"}`}
        >
          Add New Column
        </h3>

        {/* <input name="id" type="hidden" value={board._id} /> */}
        <div className="flex flex-col gap-3">
          <label
            htmlFor="boardName"
            className={`text-[1.2rem] font-bold ${isDarkMode ? "text-white" : "text-[#828fa3]"}`}
          >
            Board Name
          </label>
          <input
            type="text"
            name="name"
            id="boardName"
            defaultValue={board.name}
            className={`rounded-[0.4rem] border border-[rgba(130,143,163,0.25)] bg-transparent px-6 py-3 text-[1.4rem] font-medium leading-[2.3rem] outline-[0] placeholder:text-opacity-25 disabled:cursor-not-allowed disabled:opacity-50 ${isDarkMode ? "text-white" : "text-[#000112]"}`}
            placeholder="Enter your Board name here"
            disabled={true}
          />
        </div>

        <div className="flex flex-col gap-3">
          <p
            className={`text-[1.2rem] font-bold ${isDarkMode ? "text-white" : "text-[#828fa3]"}`}
          >
            Board Columns
          </p>

          <div className="custom-scrollbar flex max-h-[16rem] flex-col gap-5 overflow-auto">
            {board.columns.map((column, index) => (
              <input
                defaultValue={column.name}
                key={index}
                disabled={true}
                type="text"
                className={`w-full rounded-[0.4rem] border border-[rgba(130,143,163,0.25)] bg-transparent px-6 py-3 text-[1.4rem] font-medium leading-[2.3rem] outline-[0] placeholder:text-opacity-25 disabled:cursor-not-allowed disabled:opacity-50 ${isDarkMode ? "text-white" : "text-[#000112]"}`}
              />
            ))}
            {columns.map((column, index) => (
              <>
                <AddSubtask
                  key={index}
                  title={column.name}
                  index={index}
                  type="column"
                  handleRemove={() => removeColumn(index)}
                  handleChange={(name) => updateColumnName(index, name)}
                  register={register}
                  error={errors}
                  // handleChange={handleColumnChange}
                />
              </>
            ))}
          </div>
          <p
            className={`cursor-pointer rounded-[2rem] py-[0.85rem] text-center text-[1.4rem] font-bold leading-[2.3rem] text-[#635fc7] transition-all duration-300 ${isDarkMode ? "bg-white" : "bg-[rgba(99,95,199,0.10)] hover:bg-[rgba(99,95,199,0.25)]"}`}
            onClick={updateColumns}
          >
            + Add New Column
          </p>
        </div>

        <Button pendingLabel="Saving...." label="Save Changes" />
      </form>

      <div
        className="fixed bottom-0 left-0 right-0 top-0 h-full w-full bg-black/50"
        onClick={clearSelectedTask}
      ></div>
    </div>
  );
}

export default AddNewColumn;
