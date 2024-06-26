import { useState } from "react";
import { useBoard } from "../context/BoardContext";
import AddSubtask from "./AddSubtask";
import Button from "./Button";
import { BoardType } from "@/app/_lib/type";
import { createColumn, editBoardAction } from "../_lib/actions";

function AddNewColumn({ board }: { board: BoardType }) {
  const [columns, setColumns] = useState([
    {
      name: "",
      id: "",
    },
  ]);

  const { clearSelectedTask } = useBoard();

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

  function handleColumnChange(index: number, value: string) {
    setColumns((prevColumns) => {
      return prevColumns.map((column, i) => {
        if (i === index) {
          return { ...column, name: value };
        }
        return column;
      });
    });
  }

  async function clientCreateColumnAction(formData: FormData) {
    const result = await createColumn(formData);

    console.log("ok");
    console.log(result);
  }

  console.log(board);

  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center">
      <form
        className={`z-[10] flex max-h-[55rem] w-full max-w-[50rem] flex-col gap-10 overflow-auto rounded-[0.6rem] bg-[#2b2c37] p-[3.2rem]`}
        // action={createNewTask}
        action={clientCreateColumnAction}
        onSubmit={clearSelectedTask}
      >
        <h3 className="text-[1.8rem] font-bold text-white">Add New Column</h3>

        <input name="id" type="hidden" value={board._id} />
        <div className="flex flex-col gap-3">
          <label
            htmlFor="boardName"
            className="text-[1.2rem] font-bold text-white"
          >
            Board Name
          </label>
          <input
            type="text"
            name="name"
            id="boardName"
            defaultValue={board.name}
            className="rounded-[0.4rem] border border-[rgba(130,143,163,0.25)] bg-[#2B2C37] px-6 py-3 text-[1.3rem] font-medium leading-[2.3rem] text-white outline-[0] placeholder:text-opacity-25 hover:border-[#635fc7] focus:border-[#635fc7] focus:outline-[#635fc7] disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter your Board name here"
            disabled={true}
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[1.2rem] font-bold text-white">Board Columns</p>

          <div className="custom-scrollbar flex max-h-[16rem] flex-col gap-5 overflow-auto">
            {board.columns.map((column, index) => (
              <input
                defaultValue={column.name}
                key={column.name || index}
                disabled={true}
                type="text"
                className="w-full rounded-[0.4rem] border border-[rgba(130,143,163,0.25)] bg-[#2B2C37] px-6 py-3 text-[1.3rem] font-medium leading-[2.3rem] text-white outline-[0] placeholder:text-opacity-25 hover:border-[#635fc7] focus:border-[#635fc7] focus:outline-[#635fc7] disabled:cursor-not-allowed disabled:opacity-50"
              />
            ))}
            {columns.map((column, index) => (
              <>
                <AddSubtask
                  key={`${column.name}-${index}` || index}
                  title={column.name}
                  index={index}
                  type="column"
                  handleRemove={removeColumn}
                  // handleChange={handleColumnChange}
                />
                <input
                  key={column.id || index}
                  type="hidden"
                  name={`id-${index}`}
                  value={column.id}
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

export default AddNewColumn;
