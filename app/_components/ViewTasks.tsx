"use client";

import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

import { useBoard } from "@/app/_context/BoardContext";
import { TaskType } from "@/app/_lib/type";
import { useTheme } from "@/app/_context/ThemeContext";

import ViewTasksList from "./ViewTasksList";

function ViewTasks({ task }: { task: TaskType }) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const { clearSelectedTask, editSelectedTask, deleteSelectedTask } =
    useBoard();

  const {
    state: { isDarkMode },
  } = useTheme();

  const numSubTasksCompleted = task.subtasks
    .map((subtask) => subtask.isCompleted)
    .filter(Boolean).length;

  function handleOpenOptionsBtn() {
    setIsOptionsOpen((prev) => !prev);
  }

  function handleCloseOptionsBtn() {
    setIsOptionsOpen(false);
  }

  function closeAllModals() {
    if (isOptionsOpen) {
      handleCloseOptionsBtn();
    } else {
      clearSelectedTask();
    }
  }

  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center">
      <div
        className={`relative z-10 mx-8 flex max-h-[55rem] w-full max-w-[50rem] flex-col gap-10 overflow-y-auto overflow-x-hidden rounded-[0.6rem] p-[3.2rem] tablet:px-8 ${isDarkMode ? "bg-[#2b2c37]" : "bg-white"}`}
      >
        <div className="flex items-center justify-between gap-5">
          <h3
            className={`text-[1.8rem] font-bold ${isDarkMode ? "text-white" : "text-[#000112]"}`}
          >
            {task.title}
          </h3>

          <button
            className={`rounded-[1rem] py-4 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${isDarkMode ? "hover:bg-[#20212c]" : "hover:bg-[#E4EBFA]"}`}
          >
            <BsThreeDotsVertical
              className="cursor-pointer text-[2rem] text-[#828fa3]"
              onClick={handleOpenOptionsBtn}
            />
          </button>

          {isOptionsOpen && (
            <div
              className={`absolute right-[-10%] top-[20%] flex w-[19.2rem] flex-col gap-[1.6rem] p-[1.6rem] shadow-[0px_10px_20px_0px_rgba(54,78,126,0.25)] tablet:w-[16rem] ${isDarkMode ? "bg-[#20212c]" : "bg-white"}`}
            >
              <p
                className="cursor-pointer text-[1.4rem] font-medium leading-[2.3rem] text-[#828fa3]"
                onClick={editSelectedTask}
              >
                Edit Task
              </p>
              <p
                className="cursor-pointer text-[1.4rem] font-medium leading-[2.3rem] text-[#ea5555]"
                onClick={() => {
                  deleteSelectedTask(task, "task");
                }}
              >
                Delete Task
              </p>
            </div>
          )}
        </div>

        <p className="text-[1.4rem] font-medium leading-[2.3rem] text-[#828fa3]">
          {task.description}
        </p>

        <div>
          <p
            className={`pb-4 text-[1.2rem] font-bold ${isDarkMode ? "text-white" : "text-[#828fa3]"}`}
          >
            Subtasks ({numSubTasksCompleted} of {task.subtasks.length})
          </p>

          <div className="flex flex-col gap-3">
            {task.subtasks.map((subtask) => (
              <ViewTasksList key={subtask._id} subtask={subtask} />
            ))}
          </div>
        </div>

        <div>
          <p
            className={`pb-3 text-[1.2rem] font-bold ${isDarkMode ? "text-white" : "text-[#828fa3]"}`}
          >
            Current Status
          </p>
          <button className="flex w-full items-start rounded-[0.4rem] border border-[rgba(130,143,163,0.25)] px-6 py-3">
            <span
              className={`text-[1.4rem] font-medium leading-[2.3rem] ${isDarkMode ? "text-white" : "text-[#000112]"}`}
            >
              {task.status}
            </span>
          </button>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 top-0 h-full w-full bg-black/50"
        onClick={closeAllModals}
      ></div>
    </div>
  );
}

export default ViewTasks;
