"use client";

import { TaskType } from "../_lib/type";
import { useBoard } from "@/app/context/BoardContext";

function BoardItem({ task }: { task: TaskType }) {
  const numSubTasksCompleted = task.subtasks
    .map((subtask) => subtask.isCompleted)
    .filter(Boolean).length;

  const { setSelectedTask } = useBoard();
  return (
    <div
      className="group flex cursor-pointer flex-col rounded-[0.8rem] bg-[#2b2c37] px-[1.6rem] py-[2.3rem] shadow-[0px_4px_6px_0px_rgba(54,78,126,0.10)]"
      onClick={() => {
        setSelectedTask(task);
      }}
    >
      <h3 className="pb-4 text-[1.5rem] font-bold text-white transition-all duration-300 group-hover:text-[#635fc7]">
        {task.title}
      </h3>
      <p className="text-[1.2rem] font-bold text-[#828fa3]">
        {numSubTasksCompleted} of {task.subtasks.length} subtasks
      </p>
    </div>
  );
}

export default BoardItem;
