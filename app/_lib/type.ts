export type SubtaskType = {
  _id: string;
  title: string;
  isCompleted: boolean;
};

export type TaskType = {
  _id: string;
  title: string;
  status: string;
  description: string;
  subtasks: SubtaskType[];
};

export type ColumnType = {
  _id: string;
  name: string;
  tasks: TaskType[];
};

export type BoardType = {
  _id: string;
  name: string;
  columns: ColumnType[];
};
