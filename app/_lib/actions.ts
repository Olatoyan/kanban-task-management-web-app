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
}

export async function signOutAction() {
  
    
    await logout();

    await signOut({ redirectTo: "/" });

    
   
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
  

  await createUserWithEmailAndPassword({ name, email, password });
}

export async function verifyEmailAction(token: string) {
  
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
 
  revalidatePath("/");
}

export async function editTaskAction(data: NewTaskFormType) {
  const { title, description, status, id, subtasks, boardId } = data;


  if (!title.trim() || title.length < 3) throw Error("A title is required");

  if (!id) throw Error("A task id is required");
  if (!status) throw Error("A status is required");

  const filteredSubtasks: SubtaskActionType[] = subtasks
    .map((column) => ({ title: column.title.trim(), id: column._id || "" }))
    .filter((column) => column.title !== "");


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
  

  const { title, description, status, id, subtasks } = data;

  if (!title.trim() || title.length < 3) throw Error("A title is required");

  if (!id) throw Error("A board id is required");
  if (!status) throw Error("A status is required");

  const filteredSubtasks: SubtaskActionType[] = subtasks
    .map((column) => ({ title: column.title.trim(), id: column._id || "" }))
    .filter((column) => column.title !== "");



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

  revalidatePath("/");
  if (type === "board") redirect("/");
}

export async function createNewBoardAction(data: NewBoardFormType) {
  try {
    const { name, columns } = data;

    const filteredColumns: ColumnActionType[] = columns
      .map((column) => ({ name: column.name.trim() }))
      .filter((column) => column.name !== "");

    if (!name.trim()) throw new Error("A board name is required");

    const updatedBoard = await createBoard({
      name,
      columns: filteredColumns,
    });

    return updatedBoard;
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function updateBoardAction(data: NewBoardFormType) {
  const { id, name, columns } = data;

  const filteredColumns = columns.filter((column) => column.name.trim() !== "");

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
