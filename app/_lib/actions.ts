"use server";

import Subtask from "@/models/subtaskModel";
import { signIn } from "./auth";
import connectToDb from "./connectDb";
import Task from "@/models/taskModel";
import {
  addBoard,
  addTask,
  deleteTask,
  editBoard,
  editTask,
  toggleSubtask,
} from "./data-service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type SubtaskActionType = {
  title: string;
};
type ColumnActionType = {
  name: string;
  id?: string;
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
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const board = formData.get("boardName") as string;

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
    console.log(title);
    if (!title.trim()) throw Error("A title is required");

    addTask({
      board,
      title,
      description,
      status,
      subtasks,
    });
  } catch (error) {
    return error;
  }
  // revalidatePath("/");
  revalidatePath("/");
  // redirect(`/?board=${board}`);
}
// export async function createNewTask(formData: FormData) {
//   const title = formData.get("title");
//   const description = formData.get("description");
//   const status = formData.get("status");
//   const board = formData.get("boardName");

//   const subtasks: SubtaskActionType[] = [];
//   formData.forEach((value, key) => {
//     if (key.startsWith("task-")) {
//       const trimmedTitle = (value as string).trim();
//       if (trimmedTitle) {
//         subtasks.push({
//           title: trimmedTitle,
//         });
//       }
//     }
//   });

//   addTask({
//     board: board as string,
//     title: title as string,
//     description: description as string,
//     status: status as string,
//     subtasks,
//   });

//   // revalidatePath("/");
//   revalidatePath("/");
//   // redirect(`/?board=${board}`);
// }

export async function deleteTaskAction(id: string, type: string) {
  await deleteTask({ type, id });
  console.log("Deleted!!!!!!!!");

  revalidatePath("/");
  if (type === "board") redirect("/");
}

export async function createNewBoard(formData: FormData) {
  try {
    const name = formData.get("name") as string;

    const columns: ColumnActionType[] = [];
    formData.forEach((value, key) => {
      if (key.startsWith("task-")) {
        const trimmedTitle = (value as string).trim();
        if (trimmedTitle) {
          columns.push({
            name: trimmedTitle,
          });
        }
      }
    });
    console.log(name);
    if (!name.trim()) throw Error("A board name is required");

    addBoard({
      name,
      columns,
    });
  } catch (error) {
    return error;
  }
  // revalidatePath("/");
  revalidatePath("/");
}

export async function editBoardAction(formData: FormData) {
  // Convert FormData to an array
  const formEntries = Array.from(formData.entries());

  console.log(formEntries);
  // Initialize variables to store the board name and columns
  let boardName = "";
  let boardId = "";
  const columns: { name: string; id: string }[] = [];

  // Iterate over the form entries to extract the board name and columns
  formEntries.forEach(([key, value]) => {
    if (key === "name") {
      boardName = value.toString();
    } else if (key === "id") {
      boardId = value.toString();
    } else if (key.startsWith("task-")) {
      const index = parseInt(key.split("-")[1], 10);
      columns[index] = { ...columns[index], name: value.toString() };
    } else if (key.startsWith("id-")) {
      const index = parseInt(key.split("-")[1], 10);
      columns[index] = { ...columns[index], id: value.toString() };
    }
  });

  // console.log(boardName);
  // console.log(boardId);
  // console.log(columns);

  editBoard({
    id: boardId,
    name: boardName,
    columns,
  });
}

export async function createColumn(formData: FormData) {
  console.log(formData);
}
