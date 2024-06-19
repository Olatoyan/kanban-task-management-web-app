import { SubtaskType } from "../_lib/type";

function ViewTasksList({ subtask }: { subtask: SubtaskType }) {
  console.log(subtask);
  const { _id: id, title, isCompleted } = subtask;
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-6 rounded-[0.4rem] bg-[#20212c] px-[1.6rem] py-[1.3rem]"
    >
      <input
        id={id}
        type="checkbox"
        className="accent-[#635fc7]"
        checked={isCompleted}
        readOnly
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
