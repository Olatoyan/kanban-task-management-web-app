"use client";

import { useState, useTransition } from "react";

import { toggleSubtaskAction } from "@/app/_lib/actions";
import { SubtaskType } from "@/app/_lib/type";
import { useBoard } from "@/app/_context/BoardContext";
import { useTheme } from "@/app/_context/ThemeContext";

function ViewTasksList({ subtask }: { subtask: SubtaskType }) {
  const { state, setSelectedTask } = useBoard();
  const {
    state: { isDarkMode },
  } = useTheme();

  const [isCompleted, setIsCompleted] = useState(subtask.isCompleted);
  const [isPending, startTransition] = useTransition();

  const { _id: id, title } = subtask;

  async function handleChange() {
    setIsCompleted((prev) => !prev);

    startTransition(async () => {
      await toggleSubtaskAction(id!);
      const updatedTask = {
        ...state.selectedTask!,
        subtasks: state.selectedTask!.subtasks.map((s) =>
          s._id === id ? { ...s, isCompleted: !isCompleted } : s,
        ),
      };
      setSelectedTask(updatedTask);
    });
  }

  return (
    <label
      htmlFor={id}
      className={`group flex cursor-pointer items-center gap-6 rounded-[0.4rem] bg-[#20212c] px-[1.6rem] py-[1.3rem] transition-all duration-300 hover:bg-[#635dc7] hover:bg-opacity-25 ${isDarkMode ? "bg-[#20212c] hover:bg-[#635dc7]" : "bg-[#e4ebfa] hover:bg-[#635fc7] hover:bg-opacity-25 hover:text-[#000112]"}`}
    >
      <input
        id={id}
        type="checkbox"
        className="accent-[#635fc7]"
        checked={isCompleted}
        onChange={handleChange}
        disabled={isPending}
      />
      <p
        className={`text-[1.2rem] ${isCompleted ? "text-opacity-50 line-through" : ""} ${isDarkMode ? "text-white" : "text-[#000112]"} `}
      >
        {title}
      </p>
    </label>
  );
}

export default ViewTasksList;
