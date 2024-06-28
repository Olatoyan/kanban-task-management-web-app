"use client";

import { useEffect, useState } from "react";
import { NewTaskFormType, TaskType } from "../_lib/type";
import AddSubtask from "./AddSubtask";
import { useBoard } from "../context/BoardContext";
import { BsChevronDown } from "react-icons/bs";
import { editTaskAction } from "../_lib/actions";
import Button from "./Button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

function EditTask({
  task,
  allStatus,
}: {
  task: TaskType;
  allStatus: string[];
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<NewTaskFormType>({
    defaultValues: {
      title: task.title,
      description: task.description,
      status: task.status,

      subtasks: task.subtasks,
    },
  });

  const { clearSelectedTask, setIsLoading } = useBoard();

  const { title, description, _id: id } = task;

  // const [subtasks, setSubtasks] = useState(task.subtasks);

  const subtasks = getValues("subtasks");
  console.log(subtasks);
  const [isAddColumn, setIsAddColumn] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    // This effect will run whenever 'subtasks' value changes after 'setValue' call
  }, [isAddColumn]);

  const [status, setStatus] = useState(task.status);

  function updateSubtasks() {
    console.log("clicked");

    const updatedSubtasks = [...subtasks, { title: "", isCompleted: false }];

    console.log({ updatedSubtasks });

    setValue("subtasks", updatedSubtasks);

    setIsAddColumn((prev) => !prev);
  }

  function removeColumn(index: number) {
    console.log(index);

    const updatedSubtasks = subtasks.filter((_, i) => index !== i);
    console.log({ updatedSubtasks });
    setValue("subtasks", updatedSubtasks);
    setIsAddColumn((prev) => !prev);
  }

  function updateColumnName(index: number, title: string) {
    const updatedSubtasks = subtasks.map((column, i) =>
      i === index ? { ...column, title } : column,
    );

    setValue("subtasks", updatedSubtasks);
    setIsAddColumn((prev) => !prev);
  }

  function changeStatus(newStatus: string) {
    setValue("status", newStatus);
    setStatus(newStatus);
    setIsExpanded(false);
  }

  async function onSubmit(data: NewTaskFormType) {
    setIsLoading(true);

    console.log({ data, id });
    // console.log({ boardId });

    try {
      const newData = await editTaskAction({ ...data, id: id! });
      console.log({ newData });

      // const newName = newData.name.split(" ").join("+");

      // router.push(`/?board=${newName}`);
    } catch (error) {
      console.error("Failed to update board:", error);
    } finally {
      clearSelectedTask();
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center">
      <form
        className={`z-[10] flex h-[55rem] w-full max-w-[50rem] flex-col gap-10 overflow-auto rounded-[0.6rem] bg-[#2b2c37] p-[3.2rem]`}
        // action={editTaskAction}
        // onSubmit={clearSelectedTask}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3 className="text-[1.8rem] font-bold text-white">Edit Task</h3>

        {/* <input type="hidden" name="status" value={status} />
        <input type="hidden" name="id" value={_id} /> */}

        <div className="flex flex-col gap-3">
          <label htmlFor="title" className="text-[1.2rem] font-bold text-white">
            Title
          </label>
          <div className="relative">
            <input
              type="text"
              id="title"
              className={`w-full rounded-[0.4rem] border bg-[#2B2C37] px-6 py-3 text-[1.3rem] font-medium leading-[2.3rem] text-white outline-[0] placeholder:text-opacity-25 ${errors?.title?.message ? "border-[#ea5555] focus:border-[#ea5555]" : "border-[rgba(130,143,163,0.25)] hover:border-[#635fc7] focus:border-[#635fc7] focus:outline-[#635fc7]"}`}
              placeholder="Enter your title here"
              defaultValue={title}
              {...register("title", {
                required: "Can't be empty",
                minLength: {
                  value: 3,
                  message: "Must be at least 3 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Must be less than 50 characters",
                },
              })}
            />
            {errors?.title?.message && (
              <ErrorMessage>{errors.title.message}</ErrorMessage>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <label
            htmlFor="description"
            className="text-[1.2rem] font-bold text-white"
          >
            Description
          </label>
          <div className="relative">
            <textarea
              rows={4}
              id="description"
              defaultValue={description}
              className={`w-full resize-none rounded-[0.4rem] border bg-[#2B2C37] px-6 py-3 text-[1.3rem] font-medium leading-[2.3rem] text-white outline-[0] placeholder:text-opacity-25 ${errors?.description?.message ? "border-[#ea5555] focus:border-[#ea5555]" : "border-[rgba(130,143,163,0.25)] hover:border-[#635fc7] focus:border-[#635fc7] focus:outline-[#635fc7]"}`}
              placeholder="Enter your description here"
              {...register("description")}
            />
            {errors?.description?.message && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[1.2rem] font-bold text-white">Subtasks</p>

          <div className="custom-scrollbar flex max-h-[16rem] flex-col gap-5 overflow-auto">
            {subtasks.map((subtask, index) => (
              <AddSubtask
                key={index}
                title={subtask.title}
                index={index}
                handleRemove={() => removeColumn(index)}
                handleChange={(name) => updateColumnName(index, name)}
                register={register}
                error={errors}
              />
            ))}
          </div>
          <p
            className="cursor-pointer rounded-[2rem] bg-white py-[0.85rem] text-center text-[1.3rem] font-bold leading-[2.3rem] text-[#635fc7]"
            onClick={updateSubtasks}
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
              {getValues("status")}
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
