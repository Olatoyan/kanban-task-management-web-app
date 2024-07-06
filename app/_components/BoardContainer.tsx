"use client";

import { useSearchParams } from "next/navigation";

import { useEffect } from "react";

import { BoardType, isSessionType } from "@/app/_lib/type";
import { useTheme } from "@/app/_context/ThemeContext";
import { useBoard } from "@/app/_context/BoardContext";

import BoardLists from "./BoardLists";
import ViewTasks from "./ViewTasks";
import EditTask from "./EditTask";
import DeleteModal from "./DeleteModal";
import AddNewTask from "./AddNewTask";
import AddNewBoard from "./AddNewBoard";
import EditBoard from "./EditBoard";
import AddNewColumn from "./AddNewColumn";
import RevealSidebar from "./RevealSidebar";
import EmptyBoard from "./EmptyBoard";
import Spinner from "./Spinner";
import NoUserLogin from "./NoUserLogin";

function BoardContainer({
  data,
  isSession,
}: {
  data: BoardType[];
  isSession: isSessionType;
}) {
  const searchParams = useSearchParams();

  const { state, addNewColumn, setBoardId } = useBoard();
  const {
    state: { isSidebarHidden, isDarkMode },
  } = useTheme();



  const currentBoard = searchParams.get("board") ?? data?.[0]?.name ?? "";
  
  const currentBoardData = data?.find((board) => board.name === currentBoard);

  const allStatus = currentBoardData?.columns.map((column) => column.name);

  const allBoardNames = data.map((column) => ({
    id: column._id!.toString(),
    name: column.name.toLowerCase(),
  }));

  useEffect(() => {
    if (currentBoardData) {
      setBoardId(currentBoardData._id!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBoardData]);

  return (
    <section
      className={`custom-scrollbar h-[86.8vh] overflow-hidden p-[2.4rem] pr-0 tablet:w-screen ${isSidebarHidden ? "w-screen" : "w-[81vw]"} `}
    >
      {data.length > 0 ? (
        <div className="custom-scrollbar flex h-full gap-10 overflow-auto">
          <div className="flex gap-10">
            {currentBoardData?.columns.map((column, index) => (
              <BoardLists key={column._id} data={column} index={index} />
            ))}

            <div
              className={`group flex w-[28rem] cursor-pointer items-center justify-center transition-all duration-300 ${isDarkMode ? "bg-[linear-gradient(180deg,_rgba(43,44,55,0.25)_0%,_rgba(43,44,55,0.13)_100%)]" : "bg-[linear-gradient(180deg,_#E9EFFA_0%,_rgba(233,239,250,0.50)_100%)]"} `}
              onClick={addNewColumn}
            >
              <button className="text-[2.4rem] font-bold text-[#828fa3] transition-all duration-300 group-hover:text-[#635fc7]">
                + New Column
              </button>
            </div>
          </div>
        </div>
      ) : !isSession ? (
        <NoUserLogin />
      ) : (
        <EmptyBoard />
      )}

      <RevealSidebar />

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
        <AddNewTask
          allStatus={allStatus ?? []}
          boardId={currentBoardData?._id!}
        />
      )}

      {state.isAddingBoard && <AddNewBoard allBoardNames={allBoardNames} />}

      {state.isEditingBoard && (
        <EditBoard board={currentBoardData!} allBoardNames={allBoardNames} />
      )}
      {state.isAddingColumn && <AddNewColumn board={currentBoardData!} />}

      {state.isLoading && <Spinner />}
    </section>
  );
}

export default BoardContainer;
