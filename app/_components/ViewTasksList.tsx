"use client";

import { toggleSubtaskAction } from "../_lib/actions";
import { SubtaskType } from "../_lib/type";
import { useState, useTransition } from "react";
import { useBoard } from "../context/BoardContext";

function ViewTasksList({ subtask }: { subtask: SubtaskType }) {
  const { state, setSelectedTask } = useBoard();

  const [isCompleted, setIsCompleted] = useState(subtask.isCompleted);
  const [isPending, startTransition] = useTransition();

  const { _id: id, title } = subtask;

  async function handleChange() {
    setIsCompleted((prev) => !prev);

    startTransition(async () => {
      await toggleSubtaskAction(id!);

      // Update the task in the global state
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
      className="flex cursor-pointer items-center gap-6 rounded-[0.4rem] bg-[#20212c] px-[1.6rem] py-[1.3rem] transition-all duration-300 hover:bg-[#635dc7] hover:bg-opacity-25"
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
        className={`text-[1.2rem] text-white ${isCompleted ? "text-opacity-50 line-through" : ""}`}
      >
        {title}
      </p>
    </label>
  );
}

export default ViewTasksList;
