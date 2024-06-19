"use client";

import { toggleSubtaskAction } from "../_lib/actions";
import { SubtaskType } from "../_lib/type";
import { useState } from "react";

function ViewTasksList({ subtask }: { subtask: SubtaskType }) {
  const [isCompleted, setIsCompleted] = useState(subtask.isCompleted);

  const { _id: id, title } = subtask;

  function handleChange() {
    toggleSubtaskAction(id);
    setIsCompleted(!isCompleted);
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
