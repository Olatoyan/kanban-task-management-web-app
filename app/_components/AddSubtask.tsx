import { BsX } from "react-icons/bs";

function AddSubtask({
  title,
  index,
  handleRemove,
  // handleChange,
  type,
}: {
  title: string;
  index: number;
  handleRemove: (index: number) => void;
  type?: string;
  // handleChange: (index: number, value: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        name={`task-${index}`}
        defaultValue={title}
        // value={title}
        // onChange={(e) => handleChange(index, e.target.value)}
        id={`task-${index}`}
        className="w-full rounded-[0.4rem] border border-[rgba(130,143,163,0.25)] bg-[#2B2C37] px-6 py-3 text-[1.3rem] font-medium leading-[2.3rem] text-white outline-[0] placeholder:text-opacity-25 hover:border-[#635fc7] focus:border-[#635fc7] focus:outline-[#635fc7]"
        placeholder={
          type === "column"
            ? "Enter your column name here"
            : "Enter your subtask name here"
        }
      />
      <button onClick={() => handleRemove(index)}>
        <BsX className="text-[2rem] text-[#828fa3]" />
      </button>
    </div>
  );
}

export default AddSubtask;
