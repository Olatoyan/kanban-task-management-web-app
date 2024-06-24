"use client";

import { useSearchParams } from "next/navigation";
import { BoardType } from "../_lib/type";
import BoardLists from "./BoardLists";
import { useBoard } from "@/app/context/BoardContext";
import ViewTasks from "./ViewTasks";
import EditTask from "./EditTask";
import DeleteModal from "./DeleteModal";
import AddNewTask from "./AddNewTask";

function BoardContainer({ data }: { data: BoardType[] }) {
  const { state } = useBoard();

  console.log(data);

  const searchParams = useSearchParams();

  const currentBoard = searchParams.get("board") ?? data[0].name;

  const currentBoardData = data.find((board) => board.name === currentBoard);

  console.log(currentBoardData);
  console.log(currentBoardData?.columns);

  const allStatus = currentBoardData?.columns.map((column) => column.name);

  return (
    <>
      <div className="flex h-full gap-10 overflow-auto">
        <div className="flex w-full gap-10">
          {currentBoardData?.columns.map((column, index) => (
            <BoardLists key={column._id} data={column} index={index} />
          ))}
          <div className="flex w-[28rem] items-center justify-center bg-[linear-gradient(180deg,_rgba(43,44,55,0.25)_0%,_rgba(43,44,55,0.13)_100%)]">
            <button className="text-[2.4rem] font-bold text-[#828fa3]">
              + New Column
            </button>
          </div>
        </div>
      </div>

      {state.isViewingTask && <ViewTasks task={state.selectedTask!} />}

      {state.isEditingTask && (
        <EditTask task={state.selectedTask!} allStatus={allStatus ?? []} />
      )}

      {state.isDeletingTask === "task" && (
        <DeleteModal data={state.deletedTask!} type={state.isDeletingTask} />
      )}

      {state.isDeletingTask === "board" && (
        <DeleteModal data={state.deletedBoard!} type={state.isDeletingTask} />
      )}

      {state.isAddingTask && (
        <AddNewTask allStatus={allStatus ?? []} boardName={currentBoard} />
      )}
    </>
  );
}

export default BoardContainer;
