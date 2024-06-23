import { BoardType, TaskType } from "../_lib/type";

function DeleteModal({
  type,
  id,
  deleteName,
  data,
}: {
  type?: string;
  id?: string;
  deleteName?: string;
  data: TaskType | BoardType;
}) {
  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center">
      <div className="z-10 flex w-full max-w-[50rem] flex-col gap-10 rounded-[0.6rem] bg-[#2b2c37] p-[3.2rem_3.2rem_4rem]">
        <h2 className="text-[1.3rem] font-bold text-[#ea5555]">
          Delete this {type}?
        </h2>

        {type === "board" ? (
          <p className="text-[1.3rem] font-medium leading-[2.3rem] text-[#828fa3]">
            Are you sure you want to delete the ‘{deleteName}’ {type}? This
            action will remove all columns and tasks and cannot be reversed.
          </p>
        ) : (
          <p className="text-[1.3rem] font-medium leading-[2.3rem] text-[#828fa3]">
            Are you sure you want to delete the ‘{deleteName}’ task and its
            subtasks? This action cannot be reversed.
          </p>
        )}

        <div className="flex items-center gap-7">
          <button className="w-full rounded-[2rem] bg-white py-[0.8rem] text-[1.3rem] font-bold leading-[2.3rem] text-[#635fc7]">
            Cancel
          </button>
          <button className="w-full rounded-[2rem] bg-[#ea5555] py-[0.8rem] text-[1.3rem] font-bold leading-[2.3rem] text-white transition-all duration-300 hover:bg-[#ff9898]">
            Delete
          </button>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 top-0 h-full w-full bg-black/50"
        // onClick={clearSelectedTask}
      ></div>
    </div>
  );
}

export default DeleteModal;
