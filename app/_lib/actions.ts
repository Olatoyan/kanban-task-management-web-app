"use server";

import Subtask from "@/models/subtaskModel";
import { signIn } from "./auth";
import connectToDb from "./connectDb";
import Task from "@/models/taskModel";
import { addTask, deleteTask, editTask, toggleSubtask } from "./data-service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type SubtaskActionType = {
  title: string;
};

export async function signInAction() {
  await signIn("google", { redirectTo: "/" });
}

export async function toggleSubtaskAction(id: string) {
  await toggleSubtask(id);
  console.log("Done");
  revalidatePath("/");
}

export async function editTaskAction(formData: FormData) {
  const title = formData.get("title");
  const description = formData.get("description");
  const status = formData.get("status");
  const id = formData.get("id");

  const subtasks: SubtaskActionType[] = [];
  formData.forEach((value, key) => {
    if (key.startsWith("task-")) {
      const trimmedTitle = (value as string).trim();
      if (trimmedTitle) {
        subtasks.push({
          title: trimmedTitle,
        });
      }
    }
  });

  editTask({
    id: id as string,
    description: description as string,
    status: status as string,
    title: title as string,
    subtasks,
  });

  revalidatePath("/");
  // redirect("/");
}

export async function createNewTask(formData: FormData) {
  const title = formData.get("title");
  const description = formData.get("description");
  const status = formData.get("status");
  const board = formData.get("boardName");

  const subtasks: SubtaskActionType[] = [];
  formData.forEach((value, key) => {
    if (key.startsWith("task-")) {
      const trimmedTitle = (value as string).trim();
      if (trimmedTitle) {
        subtasks.push({
          title: trimmedTitle,
        });
      }
    }
  });

  addTask({
    board: board as string,
    title: title as string,
    description: description as string,
    status: status as string,
    subtasks,
  });

  // revalidatePath("/");
  revalidatePath(`/?board=${board}`);
  redirect(`/?board=${board}`);
}

export async function deleteTaskAction(id: string, type: string) {
  await deleteTask({ type, id });
  console.log("Deleted!!!!!!!!");
  revalidatePath("/");
}
