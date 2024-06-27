import { useState } from "react";
import { useBoard } from "../context/BoardContext";
import AddSubtask from "./AddSubtask";
import Button from "./Button";
import { BoardType, NewBoardFormType } from "@/app/_lib/type";
import { editBoardAction } from "../_lib/actions";
import { useForm } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import { useRouter } from "next/navigation";

function EditBoard({ board }: { board: BoardType }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewBoardFormType>();

  const { clearSelectedTask, setIsLoading } = useBoard();

  const [columns, setColumns] = useState(
    board?.columns.map((column) => ({ name: column.name, id: column._id })),
  );

  function addNewColumn() {
    const newColumn = {
      name: "",
      id: "",
    };
    setColumns([...columns, newColumn]);
  }

  function removeColumn(index: number) {
    setColumns(columns.filter((_, i) => i !== index));
  }

  console.log(board);

  // async function onSubmit(data: NewBoardFormType) {
  //   console.log(data);

  //   const newData = { ...data, id: board?._id };

  //   setIsLoading(true);
  //   await editBoardAction(newData);
  //   clearSelectedTask();
  //   setIsLoading(false);
  // }

  async function onSubmit(data: NewBoardFormType) {
    setIsLoading(true);

    try {
      const updatedBoard = await editBoardAction({ ...data, id: board?._id });
      // Assuming editBoardAction returns the updated board
      // Optionally, you can use router to navigate to the updated board
      const newName = updatedBoard.name.split(" ").join("+");
      console.log(updatedBoard);
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
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3 className="text-[1.8rem] font-bold text-white">Edit Board</h3>

        <input name="id" type="hidden" value={board?._id} />
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
              defaultValue={board?.name}
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
            {columns?.map((column, index) => (
              <>
                <AddSubtask
                  key={`${column.name}-${index}` || index}
                  title={column.name}
                  index={index}
                  type="column"
                  handleRemove={removeColumn}
                  register={register}
                  error={errors}
                />
                <input
                  key={column.id || `${index + 2}`}
                  type="hidden"
                  value={column.id}
                  {...register(`columns.${index}.id` as const)}
                />
              </>
            ))}
          </div>
          <p
            className="cursor-pointer rounded-[2rem] bg-white py-[0.85rem] text-center text-[1.3rem] font-bold leading-[2.3rem] text-[#635fc7]"
            onClick={addNewColumn}
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

export default EditBoard;
