"use server";

import Subtask from "@/models/subtaskModel";
import { signIn } from "./auth";
import connectToDb from "./connectDb";
import Task from "@/models/taskModel";
import { toggleSubtask } from "./data-service";
import { revalidatePath } from "next/cache";

export async function signInAction() {
  await signIn("google", { redirectTo: "/" });
}

export async function toggleSubtaskAction(id: string) {
  await toggleSubtask(id);
  console.log("Done");
  revalidatePath("/");
}

export async function editTaskAction(formData: FormData) {
  console.log(formData);
}
