"use client";

import { useState } from "react";
import { TaskType } from "../_lib/type";
import AddSubtask from "./AddSubtask";
import { useBoard } from "../context/BoardContext";
import { BsChevronDown } from "react-icons/bs";
import { editTaskAction } from "../_lib/actions";
import Button from "./Button";

function EditTask({
  task,
  allStatus,
}: {
  task: TaskType;
  allStatus: string[];
}) {
  const { clearSelectedTask } = useBoard();

  const { title, description, _id } = task;

  const [subtasks, setSubtasks] = useState(task.subtasks);
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState(task.status);

  function addNewSubtask() {
    const newSubtask = {
      title: "",
      isCompleted: false,
    };
    setSubtasks([...subtasks, newSubtask]);
  }

  function removeSubtask(index: number) {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  }

  function changeStatus(newStatus: string) {
    setStatus(newStatus);
    setIsExpanded(false);
  }

  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center">
      <form
        className={`z-[10] flex h-[55rem] w-full max-w-[50rem] flex-col gap-10 overflow-auto rounded-[0.6rem] bg-[#2b2c37] p-[3.2rem]`}
        action={editTaskAction}
        onSubmit={clearSelectedTask}
      >
        <h3 className="text-[1.8rem] font-bold text-white">Edit Task</h3>

        <input type="hidden" name="status" value={status} />
        <input type="hidden" name="id" value={_id} />

        <div className="flex flex-col gap-3">
          <label htmlFor="title" className="text-[1.2rem] font-bold text-white">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="rounded-[0.4rem] border border-[rgba(130,143,163,0.25)] bg-[#2B2C37] px-6 py-3 text-[1.3rem] font-medium leading-[2.3rem] text-white outline-[0] placeholder:text-opacity-25 hover:border-[#635fc7] focus:border-[#635fc7] focus:outline-[#635fc7]"
            placeholder="e.g title here"
            defaultValue={title}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label
            htmlFor="description"
            className="text-[1.2rem] font-bold text-white"
          >
            Description
          </label>
          <textarea
            rows={4}
            name="description"
            id="description"
            className="resize-none rounded-[0.4rem] border border-[rgba(130,143,163,0.25)] bg-[#2B2C37] px-6 py-3 text-[1.3rem] font-medium leading-[2.3rem] text-white outline-[0] placeholder:text-opacity-25 hover:border-[#635fc7] focus:border-[#635fc7] focus:outline-[#635fc7]"
            placeholder="e.g title here"
            defaultValue={description}
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[1.2rem] font-bold text-white">Subtasks</p>

          <div className="custom-scrollbar flex h-[16rem] flex-col gap-5 overflow-auto">
            {subtasks.map((subtask, index) => (
              <AddSubtask
                key={`${subtask.title}-${index}`}
                title={subtask.title}
                index={index}
                handleRemove={removeSubtask}
              />
            ))}
          </div>
          <p
            className="rounded-[2rem] bg-white py-[0.85rem] text-[1.3rem] font-bold leading-[2.3rem] text-[#635fc7]"
            onClick={addNewSubtask}
          >
            + Add New SubTask
          </p>
        </div>

        <div className="relative">
          <p className="text-[1.2rem] font-bold text-white">Status</p>

          <div
            className="relatives flex w-full items-center justify-between gap-3 rounded-[0.4rem] border border-[rgba(130,143,163,0.25)] bg-[#2B2C37] px-[1.6rem] py-[0.85rem]"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            <p className="text-[1.3rem] font-bold leading-[2.3rem] text-white">
              {status}
            </p>
            <span>
              <BsChevronDown className="text-[1.5rem] text-[#828fa3]" />
            </span>
          </div>
          {isExpanded && (
            <div className="absolute left-0 top-[7rem] flex w-full flex-col gap-2 rounded-[0.8rem] bg-[#20212c] p-[1.6rem] shadow-[0px_10px_20px_0px_rgba(54,78,126,0.25)]">
              {allStatus.map((status, index) => (
                <p
                  key={index}
                  className="cursor-pointer text-[1.3rem] font-medium leading-[2.3rem] text-[#828fa3]"
                  onClick={() => changeStatus(status)}
                >
                  {status}
                </p>
              ))}
            </div>
          )}
        </div>

        <Button pendingLabel="Saving" label="Save Changes" />
      </form>

      <div
        className="fixed bottom-0 left-0 right-0 top-0 h-full w-full bg-black/50"
        onClick={clearSelectedTask}
      ></div>
    </div>
  );
}

export default EditTask;
