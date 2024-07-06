"use client";

import { TaskType } from "@/app/_lib/type";
import { useBoard } from "@/app/_context/BoardContext";
import { useTheme } from "@/app/_context/ThemeContext";

function BoardItem({ task }: { task: TaskType }) {
  const numSubTasksCompleted = task.subtasks
    .map((subtask) => subtask.isCompleted)
    .filter(Boolean).length;

  const { setSelectedTask } = useBoard();

  const {
    state: { isDarkMode },
  } = useTheme();

  return (
    <div
      className={`group flex cursor-pointer flex-col rounded-[0.8rem] px-[1.6rem] py-[2.3rem] shadow-[0px_4px_6px_0px_rgba(54,78,126,0.10)] transition-all duration-300 ${isDarkMode ? "bg-[#2b2c37]" : "bg-white"} }`}
      onClick={() => {
        setSelectedTask(task);
      }}
    >
      <h3
        className={`pb-4 text-[1.5rem] font-bold transition-all duration-300 group-hover:text-[#635fc7] ${isDarkMode ? "text-white" : "text-[#000112]"}`}
      >
        {task.title}
      </h3>
      <p className="text-[1.2rem] font-bold text-[#828fa3]">
        {numSubTasksCompleted} of {task.subtasks.length} subtasks
      </p>
    </div>
  );
}

export default BoardItem;
