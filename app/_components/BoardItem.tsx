import { TaskType } from "../_lib/type";

function BoardItem({ task }: { task: TaskType }) {
  const numSubTasksCompleted = task.subtasks
    .map((subtask) => subtask.isCompleted)
    .filter(Boolean).length;
  return (
    <div className="flex flex-col rounded-[0.8rem] bg-[#2b2c37] px-[1.6rem] py-[2.3rem] shadow-[0px_4px_6px_0px_rgba(54,78,126,0.10)]">
      <h3 className="pb-4 text-[1.5rem] font-bold text-white">{task.title}</h3>
      <p className="text-[1.2rem] font-bold text-[#828fa3]">
        {numSubTasksCompleted} of {task.subtasks.length} subtasks
      </p>
    </div>
  );
}

export default BoardItem;
