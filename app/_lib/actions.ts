"use server";

import { auth, signIn, signOut } from "./auth";
import {
  createBoard,
  addNewColumnsToBoard,
  createTask,
  deleteItem,
  updateBoardDetails,
  updateTaskDetails,
  toggleSubtask,
} from "./data-service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getErrorMessage } from "./helper";
import { NewBoardFormType, NewTaskFormType } from "./type";
import {
  createUserWithEmailAndPassword,
  getSession,
  loginWithEmailAndPassword,
  logout,
  verifyEmail,
} from "./userAuth";

type SubtaskActionType = {
  title: string;
  id: string;
};
type ColumnActionType = {
  name: string;
  id?: string;
};

export async function signInAction() {
  const data = await signIn("google", { redirectTo: "/" });
  console.log("THIS IS THE DATA", data);
}

export async function signOutAction() {
  try {
    // Then clear the session cookie
    await logout();

    // First sign out using next-auth
    await signOut({ redirectTo: "/" });

    console.log("SUCCESSFULLY LOGGED OUT!!!!!!!");
  } catch (error) {
    console.error("Error during logout:", error);
  }
}
export async function signupWithEmailAction({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  console.log({ name, email, password });

  await createUserWithEmailAndPassword({ name, email, password });
}

export async function verifyEmailAction(token: string) {
  console.log({ token });
  const newToken = await verifyEmail(token);
  return newToken;
}

export async function loginWithEmailAction({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const result = await loginWithEmailAndPassword({ email, password });

  return result;
}

export async function toggleSubtaskAction(id: string) {
  await toggleSubtask(id);
  console.log("Done");
  revalidatePath("/");
}

export async function editTaskAction(data: NewTaskFormType) {
  const { title, description, status, id, subtasks, boardId } = data;
  console.log({ title, description, status, id, subtasks, boardId });

  if (!title.trim() || title.length < 3) throw Error("A title is required");

  if (!id) throw Error("A task id is required");
  if (!status) throw Error("A status is required");

  const filteredSubtasks: SubtaskActionType[] = subtasks
    .map((column) => ({ title: column.title.trim(), id: column._id || "" }))
    .filter((column) => column.title !== "");

  console.log({ title, description, status, id, filteredSubtasks, boardId });

  // const title = formData.get("title");
  // const description = formData.get("description");
  // const status = formData.get("status");
  // const id = formData.get("id");

  // const subtasks: SubtaskActionType[] = [];
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

  const newTask = updateTaskDetails({
    id,
    boardId,
    title,
    description,
    status,
    subtasks: filteredSubtasks,
  });

  revalidatePath("/");
  return newTask;
}

export async function createNewTaskAction(data: NewTaskFormType) {
  console.log(data);

  const { title, description, status, id, subtasks } = data;

  if (!title.trim() || title.length < 3) throw Error("A title is required");

  if (!id) throw Error("A board id is required");
  if (!status) throw Error("A status is required");

  const filteredSubtasks: SubtaskActionType[] = subtasks
    .map((column) => ({ title: column.title.trim(), id: column._id || "" }))
    .filter((column) => column.title !== "");

  console.log({ title, description, status, id, filteredSubtasks });

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
  const newTask = await createTask({
    id,
    title,
    description,
    status,
    subtasks: filteredSubtasks,
  });

  revalidatePath("/");
  return newTask;
}

export async function deleteItemAction(id: string, type: string) {
  await deleteItem({ type, id });
  console.log("Deleted!!!!!!!!");

  revalidatePath("/");
  if (type === "board") redirect("/");
}

export async function createNewBoardAction(data: NewBoardFormType) {
  try {
    console.log({ data });
    const { name, columns } = data;

    const filteredColumns: ColumnActionType[] = columns
      .map((column) => ({ name: column.name.trim() }))
      .filter((column) => column.name !== "");

    if (!name.trim()) throw new Error("A board name is required");

    const updatedBoard = await createBoard({
      name,
      columns: filteredColumns,
    });

    //   const name = data.name;

    //   const columns: ColumnActionType[] = [];
    //   Object.entries(data).forEach(([key, value]) => {
    //     if (key.startsWith("task-")) {
    //       const trimmedTitle = (value as string).trim();
    //       if (trimmedTitle) {
    //         columns.push({ name: trimmedTitle });
    //       } else {
    //         throw new Error("A column name is required");
    //       }
    //     }
    //   });
    //   console.log(columns);
    //   if (!name.trim()) throw Error("A board name is required");

    //   createBoard({
    //     name,
    //     columns,
    //   });
    return updatedBoard;
  } catch (error) {
    console.log("ERROR!!!!!!!!!!!!!!!!!!!!!!!!!!!!💥💥💥💥💥💥", error);
    return { error: getErrorMessage(error) };
  }
  revalidatePath("/");
}

export async function updateBoardAction(data: NewBoardFormType) {
  console.log(data);
  const { id, name, columns } = data;

  const filteredColumns = columns.filter((column) => column.name.trim() !== "");

  // const columnsWithNames = columns.map((column, index) => ({
  //   id: column.id || "",
  //   name: (data as any)[`task-${index}`] || "",
  // }));

  // const filteredColumns = columnsWithNames.filter(
  //   (column) => column.name.trim() !== "",
  // );

  // console.log({ columnsWithNames, filteredColumns });

  const updatedBoard = await updateBoardDetails({
    id,
    name,
    columns: filteredColumns,
  });

  revalidatePath("/");
  return updatedBoard;
}

export async function addColumnsToExistingBoardAction(data: NewBoardFormType) {
  const { id, columns } = data;

  const filteredColumns: ColumnActionType[] = columns
    .map((column) => ({ name: column.name.trim() }))
    .filter((column) => column.name !== "");

  const newColumn = await addNewColumnsToBoard({
    id: id!,
    columns: filteredColumns,
  });

  revalidatePath("/");
  return newColumn;
}
