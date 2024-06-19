"use client";

import { useState } from "react";
import { TaskType } from "../_lib/type";
import AddSubtask from "./AddSubtask";
import { useBoard } from "../context/BoardContext";
import { BsChevronDown } from "react-icons/bs";

function EditTask({ task }: { task: TaskType }) {
  console.log(task);
  const { clearSelectedTask } = useBoard();

  const { title, description } = task;

  const [subtasks, setSubtasks] = useState(task.subtasks);

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

  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center">
      <div className="z-[10] flex w-full max-w-[50rem] flex-col gap-10 rounded-[0.6rem] bg-[#2b2c37] p-[3.2rem]">
        <h3 className="text-[1.8rem] font-bold text-white">Edit Task</h3>

        <div className="flex flex-col gap-3">
          <label htmlFor="title" className="text-[1.2rem] font-bold text-white">
            Title
          </label>
          <input
            type="text"
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
                key={subtask.title}
                title={subtask.title}
                index={index}
                handleRemove={removeSubtask}
              />
            ))}
          </div>
          <button
            className="rounded-[2rem] bg-white py-[0.85rem] text-[1.3rem] font-bold leading-[2.3rem] text-[#635fc7]"
            onClick={addNewSubtask}
          >
            + Add New SubTask
          </button>
        </div>

        <div>
          <p className="text-[1.2rem] font-bold text-white">Status</p>

          <button className="flex w-full items-center justify-between gap-3 rounded-[0.4rem] border border-[rgba(130,143,163,0.25)] bg-[#2B2C37] px-[1.6rem] py-[0.85rem]">
            <p className="text-[1.3rem] font-bold leading-[2.3rem] text-white">
              Doing
            </p>
            <span>
              <BsChevronDown className="text-[1.5rem] text-[#828fa3]" />
            </span>
          </button>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 top-0 h-full w-full bg-black/50"
        onClick={clearSelectedTask}
      ></div>
    </div>
  );
}

export default EditTask;
