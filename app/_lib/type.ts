import { JWTPayload } from "jose";
import { Session } from "next-auth";

export type SubtaskType = {
  _id?: string;
  title: string;
  isCompleted: boolean;
};

export type TaskType = {
  _id?: string;
  title: string;
  status: string;
  description: string;
  subtasks: SubtaskType[];
};

export type ColumnType = {
  _id?: string;
  name: string;
  tasks: TaskType[];
};

export type BoardType = {
  _id?: string;
  name: string;
  columns: ColumnType[];
};

export type NewBoardFormType = {
  id?: string;
  name: string;
  columns: { name: string; id?: string }[];
};
export type NewTaskFormType = {
  id: string;
  title: string;
  description: string;
  status: string;
  subtasks: { title: string; isCompleted: boolean; _id: string }[];
  boardId: string;
};

export type isSessionType = JWTPayload | Session | null;
