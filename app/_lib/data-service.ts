import User from "@/models/userModel";
import connectToDb from "./connectDb";
import Board from "@/models/boardModel";
import Task from "@/models/taskModel";
import Column from "@/models/columnModel";
import Subtask from "@/models/subtaskModel";
import { BoardType, ColumnType, TaskType } from "./type";
import mongoose from "mongoose";
import { getSession } from "./userAuth";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function createUser({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  await connectToDb();

  const user = new User({ name, email, isVerified: true, usedOAuth: true });

  await user.save();
}

export async function getUser(email: string) {
  await connectToDb();

  const user = await User.findOne({ email });

  return user;
}

export async function getUserSession() {
  const emailSession = await getSession();

  const OAuthSession = await auth();

  if (!emailSession && !OAuthSession) return [];

  const finalEmail = emailSession?.email || OAuthSession?.user?.email;

  const getUser = await User.findOne({ email: finalEmail });

  return getUser;
}

export async function getAllTasks() {
  await connectToDb();

  const getUser = await getUserSession();

  const getBoards = getUser?.boards;

  const data = await Board.find({ _id: { $in: getBoards } })
    .populate({
      path: "columns",
      populate: {
        path: "tasks",
        populate: {
          path: "subtasks",
        },
      },
    })
    .lean();

  // Transform the populated fields to plain objects
  return data?.map((board: any) => ({
    _id: board._id.toString(),
    name: board.name,
    columns: board.columns.map((column: any) => ({
      ...column,
      _id: column._id.toString(),
      tasks: column.tasks.map((task: any) => ({
        ...task,
        _id: task._id.toString(),
        subtasks: task.subtasks.map((subtask: any) => ({
          ...subtask,
          _id: subtask._id.toString(),
        })),
      })),
    })),
  }));
}

export async function toggleSubtask(id: string) {
  await connectToDb();

  const subtask = await Subtask.findById(id);

  subtask.isCompleted = !subtask.isCompleted;

  await subtask.save();
}

export async function updateTaskDetails({
  id,
  boardId,
  title,
  description,
  status,
  subtasks,
}: {
  id: string;
  boardId: string;
  title: string;
  description: string;
  status: string;
  subtasks: { title: string; id: string }[];
}) {
  await connectToDb();

  const getUser = await getUserSession();
  if (!getUser) {
    throw new Error("User not authenticated");
  }

  const board = await Board.findById(boardId)
    .populate({
      path: "columns",
      populate: {
        path: "tasks",
        populate: {
          path: "subtasks",
        },
      },
    })
    .exec();

  const boardColumns = board.columns;

  let taskToUpdate: TaskType | undefined;

  boardColumns.forEach((column: ColumnType) => {
    const foundTask = column.tasks.find((task) => task._id!.toString() === id);
    if (foundTask) {
      taskToUpdate = foundTask;
    }
  });

  if (!taskToUpdate) {
    throw new Error("Task not found");
  }

  const task = await Task.findById(taskToUpdate!._id)
    .populate("subtasks")
    .exec();

  if (!task) {
    throw new Error("Task not found");
  }

  const subtaskTitles = new Set(
    subtasks.map((subtask) => subtask.title.trim()),
  );
  const existingSubtaskIdsToKeep: mongoose.Types.ObjectId[] = [];
  const existingSubtaskTitles = new Set();

  // Loop through existing subtasks in the task
  for (let subtask of task.subtasks) {
    if (subtaskTitles.has(subtask.title.trim())) {
      existingSubtaskIdsToKeep.push(subtask._id);
      existingSubtaskTitles.add(subtask.title.trim());
    } else {
      // Remove subtask if it's not in the form data
      await Subtask.findByIdAndDelete(subtask._id);
    }
  }

  for (let subtask of subtasks) {
    const trimmedTitle = subtask.title.trim();
    if (!existingSubtaskTitles.has(trimmedTitle)) {
      let existingSubtask = subtask.id
        ? await Subtask.findById(subtask.id)
        : null;

      if (!existingSubtask) {
        existingSubtask = new Subtask({
          title: trimmedTitle,
        });
        await existingSubtask.save();
      }
      existingSubtaskIdsToKeep.push(existingSubtask._id);
    }
  }

  // Find and remove the task from its current column
  for (let column of boardColumns) {
    const getColumn = await Column.findById(column._id);

    // Find the task in the column
    const getTask = getColumn.tasks.find(
      (task: { _id: string }) => task._id!.toString() === id,
    );
    if (getTask) {
      // Remove the task from the column's tasks array
      getColumn.tasks.pull(id);
      await getColumn.save();
      break;
    }
  }

  // Find the new column based on the updated status
  const newColumn = boardColumns.find(
    (column: { name: string }) => column.name === status,
  );

  if (!newColumn) {
    throw new Error("New column not found");
  }

  const updateColumn = await Column.findById(newColumn._id);

  if (!updateColumn) {
    throw new Error("Update column not found");
  }

  updateColumn.tasks.push(id);
  await updateColumn.save();

  // Update the task with new details
  const updatedData = await Task.findByIdAndUpdate(id, {
    title,
    description,
    status,
    subtasks: existingSubtaskIdsToKeep,
  }).lean();

  return updatedData;
}

export async function createTask({
  id,
  title,
  description,
  status,
  subtasks,
}: {
  id: string;
  title: string;
  description: string;
  status: string;
  subtasks: { title: string }[];
}) {
  await connectToDb();

  const getUser = await getUserSession();
  if (!getUser) {
    throw new Error("User not authenticated");
  }

  // Create each subtask and collect their IDs
  const subtaskIds = [];

  for (const subtask of subtasks) {
    const trimmedTitle = subtask.title.trim();

    const existingSubtask = new Subtask({
      title: trimmedTitle,
    });
    await existingSubtask.save();

    subtaskIds.push(existingSubtask._id);
  }

  // Create the main task with the collected subtask IDs
  const newTask = new Task({
    title,
    description,
    status,
    subtasks: subtaskIds,
  });

  await newTask.save();

  const currentBoard = await Board.findById(id).populate({
    path: "columns",
  });

  if (!currentBoard) {
    throw new Error(`Board with id ${id} not found`);
  }

  const findColumn = currentBoard.columns.find(
    (col: { name: string }) => col.name === status,
  );

  const column = await Column.findById(findColumn._id);

  column.tasks.push(newTask._id);

  await column.save();

  await currentBoard.save();

  const data = await Board.findById(id)
    .populate({
      path: "columns",
      populate: {
        path: "tasks",
        populate: {
          path: "subtasks",
        },
      },
    })
    .lean();

  if (!data) {
    throw new Error("Board not found");
  }
  const boardData = data as {
    _id: string;
    name: string;
    columns: {
      _id: string;
      name: string;
      tasks: {
        _id: string;
        subtasks: {
          _id: string;
        }[];
      }[];
    }[];
  };

  return {
    _id: boardData._id.toString(),
    name: boardData.name,
    columns: boardData.columns.map((column: any) => ({
      ...column,
      _id: column._id.toString(),
      tasks: column.tasks.map((task: any) => ({
        ...task,
        _id: task._id.toString(),
        subtasks: task.subtasks.map((subtask: any) => ({
          ...subtask,
          _id: subtask._id.toString(),
        })),
      })),
    })),
  };
}

export async function deleteItem({ type, id }: { type: string; id: string }) {
  await connectToDb();

  const getUser = await getUserSession();
  if (!getUser) {
    throw new Error("User not authenticated");
  }

  if (type === "task") {
    // Find the task by ID and populate its subtasks
    const task = await Task.findById(id).populate("subtasks");

    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }

    // Delete all subtasks associated with the task
    const subtaskIds = task.subtasks.map(
      (subtask: { _id: string }) => subtask._id,
    );
    await Subtask.deleteMany({ _id: { $in: subtaskIds } });

    // Delete the task itself
    await Task.findByIdAndDelete(id);

    return { message: "Task and its subtasks have been deleted successfully" };
  }

  if (type === "board") {
    const getUser = await getUserSession();

    const board = await Board.findById(id).populate("columns");

    if (!board) {
      throw new Error(`Board with ID ${id} not found`);
    }

    // For each column, find and delete its tasks and subtasks
    for (const column of board.columns) {
      const populatedColumn = await Column.findById(column._id).populate(
        "tasks",
      );
      const tasks = populatedColumn.tasks;

      for (const task of tasks) {
        const subtaskIds = task.subtasks.map(
          (subtask: { _id: string }) => subtask._id,
        );
        await Subtask.deleteMany({ _id: { $in: subtaskIds } });
        await Task.findByIdAndDelete(task._id);
      }

      // Delete the column itself
      await Column.findByIdAndDelete(column._id);
    }

    // Delete the board itself
    await Board.findByIdAndDelete(id);

    getUser.boards.pull(id);

    await getUser.save();

    return {
      message:
        "Board and its columns, tasks, and subtasks have been deleted successfully",
    };
  }

  throw new Error(`Unsupported type: ${type}`);
}

export async function createBoard({
  name,
  columns,
}: {
  name: string;
  columns: { name: string }[];
}) {
  await connectToDb();
  const getUser = await getUserSession();
  if (!getUser) {
    throw new Error("User not authenticated");
  }

  // Ensure column names are unique within the board
  const columnNames = new Set(columns.map((column) => column.name.trim()));
  if (columnNames.size !== columns.length) {
    throw new Error("Duplicate column names are not allowed");
  }

  // Create each column and collect their IDs
  const columnIds = [];

  for (const column of columns) {
    const trimmedTitle = column.name.trim();
    const newColumn = new Column({ name: trimmedTitle });
    await newColumn.save();
    columnIds.push(newColumn._id);
  }

  const newBoard = new Board({
    name,
    columns: columnIds,
    userId: getUser._id,
  });

  await newBoard.save();

  const getBoards = getUser?.boards;

  getBoards.push(newBoard._id);

  await getUser.save();

  const data = await Board.find()
    .populate({
      path: "columns",
      populate: {
        path: "tasks",
        populate: {
          path: "subtasks",
        },
      },
    })
    .lean();

  if (!data) {
    throw new Error("Board not found");
  }

  return data.map((board: any) => ({
    _id: board._id.toString(),
    name: board.name,
    columns: board.columns.map((column: any) => ({
      ...column,
      _id: column._id.toString(),
      tasks: column.tasks.map((task: any) => ({
        ...task,
        _id: task._id.toString(),
        subtasks: task.subtasks.map((subtask: any) => ({
          ...subtask,
          _id: subtask._id.toString(),
        })),
      })),
    })),
  }));
}

export async function updateBoardDetails({
  id,
  name,
  columns,
}: {
  id: string | undefined;
  name: string;
  columns: { name: string; id?: string }[];
}) {
  await connectToDb();

  if (!getUser) {
    throw new Error("User not authenticated");
  }

  const board = await Board.findById(id).populate("columns");
  if (!board) {
    throw new Error("Board not found");
  }

  // Ensure column names are unique within the board
  const columnNames = new Set(columns.map((column) => column.name.trim()));
  if (columnNames.size !== columns.length) {
    throw new Error("Duplicate column names are not allowed");
  }

  // Update the board's name
  board.name = name;

  const existingColumnIds = board.columns.map((col: { _id: string }) =>
    col._id.toString(),
  );
  const incomingColumnIds = columns
    .filter((col) => col.id)
    .map((col) => col.id);

  const columnsToUpdate = columns.filter((col) => col.id);
  const newColumns = columns.filter((col) => !col.id);
  const columnsToRemove = board.columns.filter(
    (col: { _id: string }) => !incomingColumnIds.includes(col._id.toString()),
  );

  for (const column of columnsToUpdate) {
    await Column.findByIdAndUpdate(column.id, { name: column.name });
    const existingColumn = await Column.findById(column.id);
    if (!existingColumn) {
      throw new Error(`Column with ID ${column.id} not found`);
    }

    for (const task of existingColumn.tasks) {
      await Task.findByIdAndUpdate(task._id, { status: column.name });
    }
  }

  // Remove deleted columns and their associated tasks and subtasks
  for (const column of columnsToRemove) {
    const populatedColumn = await Column.findById(column._id).populate("tasks");
    const tasks = populatedColumn.tasks;

    for (const task of tasks) {
      await Subtask.deleteMany({ _id: { $in: task.subtasks } });
      await Task.findByIdAndDelete(task._id);
    }

    await Column.findByIdAndDelete(column._id);
  }

  // Remove the column IDs from the board's columns array
  board.columns = board.columns.filter(
    (col: { _id: mongoose.Types.ObjectId }) =>
      !columnsToRemove.some((colToRemove: { _id: mongoose.Types.ObjectId }) =>
        colToRemove._id.equals(col._id),
      ),
  );

  // Add new columns
  for (const column of newColumns) {
    const newColumn = new Column({ name: column.name });
    await newColumn.save();
    board.columns.push(newColumn._id);
  }

  // Save the updated board
  await Board.findByIdAndUpdate(id, board, { new: true });

  const data = await Board.findById(id)
    .populate({
      path: "columns",
      populate: {
        path: "tasks",
        populate: {
          path: "subtasks",
        },
      },
    })
    .lean();

  if (!data) {
    throw new Error("Board not found");
  }
  const boardData = data as {
    _id: string;
    name: string;
    columns: {
      _id: string;
      name: string;
      tasks: {
        _id: string;
        subtasks: {
          _id: string;
        }[];
      }[];
    }[];
  };

  return {
    _id: boardData._id.toString(),
    name: boardData.name,
    columns: boardData.columns.map((column: any) => ({
      ...column,
      _id: column._id.toString(),
      tasks: column.tasks.map((task: any) => ({
        ...task,
        _id: task._id.toString(),
        subtasks: task.subtasks.map((subtask: any) => ({
          ...subtask,
          _id: subtask._id.toString(),
        })),
      })),
    })),
  };
}

export async function addNewColumnsToBoard({
  id,
  columns,
}: {
  id: string;
  columns: { name: string }[];
}) {
  await connectToDb();
  if (!getUser) {
    throw new Error("User not authenticated");
  }

  const board = await Board.findById(id).populate("columns");
  if (!board) {
    throw new Error("Board not found");
  }

  // Validate that there are no duplicate column names within the new columns
  const newColumnNames = columns.map((column) => column.name.trim());
  const newColumnNamesSet = new Set(newColumnNames);
  if (newColumnNamesSet.size !== newColumnNames.length) {
    throw new Error(
      "Duplicate column names are not allowed within the new columns",
    );
  }

  // Validate that there are no duplicate column names with existing columns
  const existingColumnNames = board.columns.map(
    (column: { name: string }) => column.name,
  );
  newColumnNames.forEach((name) => {
    if (existingColumnNames.includes(name)) {
      throw new Error(`Column name "${name}" already exists in the board`);
    }
  });

  const newColumns = [];

  for (const column of columns) {
    const newColumn = new Column({
      name: column.name.trim(),
    });
    await newColumn.save();
    board.columns.push(newColumn._id);
    newColumns.push(newColumn);
  }

  await board.save();
  return newColumns.map((column) => ({
    _id: column._id.toString(),
    name: column.name,
  }));
}
