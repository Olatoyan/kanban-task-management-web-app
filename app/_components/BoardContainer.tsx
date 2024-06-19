"use client";

import { useSearchParams } from "next/navigation";
import { BoardType } from "../_lib/type";
import BoardLists from "./BoardLists";
import { useBoard } from "@/app/context/BoardContext";
import ViewTasks from "./ViewTasks";
import EditTask from "./EditTask";

function BoardContainer({ data }: { data: BoardType[] }) {
  const { state } = useBoard();

  // console.log(state);

  const searchParams = useSearchParams();

  const currentBoard = searchParams.get("board") ?? data[0].name;

  const currentBoardData = data.find((board) => board.name === currentBoard);

  console.log(currentBoardData?.columns);

  return (
    <>
      <div className="flex h-full gap-10 overflow-auto">
        <div className="flex gap-10">
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

      {state.isEditingTask && <EditTask task={state.selectedTask!} />}
    </>
  );
}

export default BoardContainer;
