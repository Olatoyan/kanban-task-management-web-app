"use client";

import { BsThreeDotsVertical } from "react-icons/bs";
import { TaskType } from "../_lib/type";
import ViewTasksList from "./ViewTasksList";
import { useBoard } from "@/app/context/BoardContext";
import { useState } from "react";

function ViewTasks({ task }: { task: TaskType }) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const { clearSelectedTask, editSelectedTask, deleteSelectedTask } =
    useBoard();

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

  function handleDeleteTask(task: TaskType, deletedType: string) {
    deleteSelectedTask(task, "task");
  }

  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center">
      <div className="relative z-10 flex max-h-[55rem] w-full max-w-[50rem] flex-col gap-10 overflow-y-auto overflow-x-hidden rounded-[0.6rem] bg-[#2b2c37] p-[3.2rem]">
        <div className="flex items-center justify-between gap-5">
          <h3 className="text-[1.8rem] font-bold text-white">{task.title}</h3>

          <button>
            <BsThreeDotsVertical
              className="cursor-pointer text-[2rem] text-[#828fa3]"
              onClick={handleOpenOptionsBtn}
            />
          </button>

          {isOptionsOpen && (
            <div className="absolute right-[-10%] top-[20%] flex w-[19.2rem] flex-col gap-[1.6rem] bg-[#20212c] p-[1.6rem] shadow-[0px_10px_20px_0px_rgba(54,78,126,0.25)]">
              <p
                className="cursor-pointer text-[1.3rem] font-medium leading-[2.3rem] text-[#828fa3]"
                onClick={editSelectedTask}
              >
                Edit Task
              </p>
              <p
                className="cursor-pointer text-[1.3rem] font-medium leading-[2.3rem] text-[#ea5555]"
                // onClick={handleDeleteTask}
                onClick={() => {
                  deleteSelectedTask(task, "task");
                }}
              >
                Delete Task
              </p>
            </div>
          )}
        </div>

        <p className="text-[1.3rem] font-medium leading-[2.3rem] text-[#828fa3]">
          {task.description}
        </p>

        <div>
          <p className="pb-4 text-[1.2rem] font-bold text-white">
            Subtasks ({numSubTasksCompleted} of {task.subtasks.length})
          </p>

          <div className="flex flex-col gap-3">
            {task.subtasks.map((subtask) => (
              <ViewTasksList key={subtask._id} subtask={subtask} />
            ))}
          </div>
        </div>

        <div>
          <p className="pb-3 text-[1.2rem] font-bold text-white">
            Current Status
          </p>
          <button className="flex w-full items-start rounded-[0.4rem] border border-[rgba(130,143,163,0.25)] px-6 py-3">
            <span className="text-[1.3rem] font-medium leading-[2.3rem] text-white">
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
