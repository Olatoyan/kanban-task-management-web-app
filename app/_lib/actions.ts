"use server";

import { signIn } from "./auth";
import {
  addBoard,
  addColumn,
  addTask,
  deleteTask,
  editBoard,
  editTask,
  toggleSubtask,
} from "./data-service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getErrorMessage } from "./helper";
import { NewBoardFormType, NewTaskFormType } from "./type";

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

export async function createNewTask(data: NewTaskFormType) {
  console.log(data);
  try {
    const { title, description, status, id } = data;

    if (!title.trim() || title.length < 3) throw Error("A title is required");

    if (!id) throw Error("A board id is required");
    if (!status) throw Error("A status is required");

    const subtasks: SubtaskActionType[] = [];
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith("task-")) {
        const trimmedTitle = (value as string).trim();
        if (trimmedTitle) {
          subtasks.push({ title: trimmedTitle });
        } else {
          throw new Error("A subtask name is required");
        }
      }
    });

    console.log({ title, description, status, id, subtasks });

    // const description = formData.get("description") as string;
    // const status = formData.get("status") as string;
    // const board = formData.get("boardName") as string;
    // formData.forEach((value, key) => {
    //   if (key.startsWith("task-")) {
    //     const trimmedTitle = (value as string).trim();
    //     if (trimmedTitle) {
    //       subtasks.push({
    //         title: trimmedTitle,
    //       });
    //     }
    //   }
    // });
    // console.log(title);
    // if (!title.trim()) throw Error("A title is required");
    addTask({
      id,
      title,
      description,
      status,
      subtasks,
    });
  } catch (error) {
    return error;
  }
  revalidatePath("/");
}

export async function deleteTaskAction(id: string, type: string) {
  await deleteTask({ type, id });
  console.log("Deleted!!!!!!!!");

  revalidatePath("/");
  if (type === "board") redirect("/");
}

export async function createNewBoard(data: NewBoardFormType) {
  try {
    console.log(data);
    const name = data.name;

    const columns: ColumnActionType[] = [];
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith("task-")) {
        const trimmedTitle = (value as string).trim();
        if (trimmedTitle) {
          columns.push({ name: trimmedTitle });
        } else {
          throw new Error("A column name is required");
        }
      }
    });
    console.log(columns);
    if (!name.trim()) throw Error("A board name is required");

    addBoard({
      name,
      columns,
    });
  } catch (error) {
    console.log("ERROR!!!!!!!!!!!!!!!!!!!!!!!!!!!!💥💥💥💥💥💥", error);
    return { error: getErrorMessage(error) };
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

  const id = formData.get("id") as string;

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

  for (const column of columns) {
    await addColumn({ id, name: column.name });
  }

  revalidatePath("/");
}
