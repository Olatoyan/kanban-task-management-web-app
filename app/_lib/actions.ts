"use server";

import Subtask from "@/models/subtaskModel";
import { signIn } from "./auth";
import connectToDb from "./connectDb";
import Task from "@/models/taskModel";

export async function signInAction() {
  await signIn("google", { redirectTo: "/" });
}

export async function testing() {
  await connectToDb();

  const newTask = new Task({
    title: "test",
    status: "doing",
    description: "ok",
    subtasks: ["666b7fb97e5fbf2c382699f4"],
  });

  await newTask.save();
}
