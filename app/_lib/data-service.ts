import User from "@/models/userModel";
import connectToDb from "./connectDb";
import Board from "@/models/boardModel";
import Task from "@/models/taskModel";
import Column from "@/models/columnModel";
import Subtask from "@/models/subtaskModel";
import { BoardType, ColumnType } from "./type";
import mongoose from "mongoose";

export async function createUser({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  await connectToDb();
  console.log(name, email);
  const user = new User({ name, email });

  await user.save();
}

export async function getUser(email: string) {
  await connectToDb();

  const user = User.findOne({ email });

  return user;
}

export async function getAllTasks() {
  await connectToDb();

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
  // const data = await Board.find();

  // Transform the populated fields to plain objects
  return data.map((board: any) => ({
    _id: board._id.toString(),
    name: board.name,
    columns: board.columns.map((column: any) => ({
      ...column,
      _id: column._id.toString(),
      // Populate other properties of column if needed
      tasks: column.tasks.map((task: any) => ({
        ...task,
        _id: task._id.toString(),
        // Populate other properties of task if needed
        subtasks: task.subtasks.map((subtask: any) => ({
          ...subtask,
          _id: subtask._id.toString(),
          // Populate other properties of subtask if needed
        })),
      })),
    })),
  }));
}

export async function getColumn() {
  await connectToDb();

  const user = Column.findOne();

  return user;
}
export async function getTasks() {
  await connectToDb();

  const user = Task.findOne();

  return user;
}
export async function getSubtasks() {
  await connectToDb();

  const user = Subtask.findOne();

  return user;
}

export async function toggleSubtask(id: string) {
  await connectToDb();

  const subtask = await Subtask.findById(id);

  subtask.isCompleted = !subtask.isCompleted;

  await subtask.save();
}

export async function editTask({
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

  const task = await Task.findById(id).populate("subtasks").exec();
  if (!task) {
    throw new Error("Task not found");
  }

  // Track existing subtasks and IDs to keep
  const subtaskTitles = new Set(subtasks.map((subtask) => subtask.title));
  const existingSubtaskIdsToKeep = [];
  const existingSubtaskTitles = new Set();

  // Loop through existing subtasks in the task
  for (let subtask of task.subtasks) {
    if (subtaskTitles.has(subtask.title.trim())) {
      existingSubtaskIdsToKeep.push(subtask._id);
      existingSubtaskTitles.add(subtask.title);
    } else {
      // Remove subtask if it's not in the form data
      await Subtask.findByIdAndDelete(subtask._id);
    }
  }

  // Add new subtasks from the form data
  for (let subtask of subtasks) {
    const trimmedTitle = subtask.title.trim();
    if (!existingSubtaskTitles.has(trimmedTitle)) {
      let existingSubtask = await Subtask.findOne({ title: trimmedTitle });

      if (!existingSubtask) {
        existingSubtask = new Subtask({ title: trimmedTitle });
        await existingSubtask.save();
      }

      existingSubtaskIdsToKeep.push(existingSubtask._id);
    }
  }

  // Find the current column containing the task
  const currentColumn = await Column.findOne({ tasks: id }).exec();
  if (!currentColumn) {
    throw new Error("Current column not found");
  }

  // Remove the task from the current column's tasks array
  currentColumn.tasks.pull(id);
  await currentColumn.save();

  // Find the new column based on the new status
  const newColumn = await Column.findOne({ name: status }).exec();
  if (!newColumn) {
    throw new Error("New column not found");
  }

  // Add the task to the new column's tasks array
  newColumn.tasks.push(id);
  await newColumn.save();

  const updatedData = await Task.findByIdAndUpdate(
    id,
    {
      title,
      description,
      status,
      subtasks: existingSubtaskIdsToKeep,
    },
    { new: true },
  ).lean();

  console.log("Updated!!!!!!!!!!");

  return updatedData;
}

export async function addTask({
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

  // Create each subtask and collect their IDs
  const subtaskIds = [];

  for (const subtask of subtasks) {
    const trimmedTitle = subtask.title.trim();

    let existingSubtask = await Subtask.findOne({ title: trimmedTitle });

    if (!existingSubtask) {
      existingSubtask = new Subtask({ title: trimmedTitle });
      await existingSubtask.save();
    }

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

export async function deleteTask({ type, id }: { type: string; id: string }) {
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

    return {
      message:
        "Board and its columns, tasks, and subtasks have been deleted successfully",
    };
  }

  throw new Error(`Unsupported type: ${type}`);
}

export async function addBoard({
  name,
  columns,
}: {
  name: string;
  columns: { name: string }[];
}) {
  // Check if a board with the same name already exists
  const existingBoard = await Board.findOne({ name: name.trim() });
  if (existingBoard) {
    throw new Error("Board with the same name already exists");
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
  });

  await newBoard.save();

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
  }[];

  return data.map((board: any) => ({
    _id: board._id.toString(),
    name: board.name,
    columns: board.columns.map((column: any) => ({
      ...column,
      _id: column._id.toString(),
      // Populate other properties of column if needed
      tasks: column.tasks.map((task: any) => ({
        ...task,
        _id: task._id.toString(),
        // Populate other properties of task if needed
        subtasks: task.subtasks.map((subtask: any) => ({
          ...subtask,
          _id: subtask._id.toString(),
          // Populate other properties of subtask if needed
        })),
      })),
    })),
  }));
}

export async function editBoard({
  id,
  name,
  columns,
}: {
  id: string | undefined;
  name: string;
  columns: { name: string; id?: string }[];
}) {
  const board = await Board.findById(id).populate("columns");
  if (!board) {
    throw new Error("Board not found");
  }

  // Validate unique board name
  const existingBoard = await Board.findOne({ name }).exec();
  if (existingBoard && existingBoard._id.toString() !== id) {
    throw new Error("Board name already exists");
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

  console.log("Board:", board);
  console.log("Existing Column IDs:", existingColumnIds);
  console.log("Incoming Column IDs:", incomingColumnIds);
  console.log("Columns to Update:", columnsToUpdate);
  console.log("New Columns:", newColumns);
  console.log("Columns to Remove:", columnsToRemove);

  for (const column of columnsToUpdate) {
    console.log("columnToUpdate", column);
    const existingColumn = await Column.findById(column.id);
    if (!existingColumn) {
      throw new Error(`Column with ID ${column.id} not found`);
    }
    existingColumn.name = column.name;
    await existingColumn.save();

    for (const task of existingColumn.tasks) {
      console.log("THIS IS THE TASKS!!!!", task);
      const existingTask = await Task.findById(task);
      existingTask.status = column.name;
      await existingTask.save();
      // task.status = existingColumn.name; // Assuming 'column' field in Task schema represents column ID
      // await task.save();
    }
  }
  // for (const column of columnsToUpdate) {
  //   console.log("columnToUpdate", column);
  //   await Column.findByIdAndUpdate(column.id, { name: column.name });
  // }

  // Remove deleted columns and their associated tasks and subtasks
  for (const column of columnsToRemove) {
    const populatedColumn = await Column.findById(column._id).populate("tasks");
    const tasks = populatedColumn.tasks;

    for (const task of tasks) {
      console.log("task", task);
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
    console.log("newColumns", column);
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

export async function addColumnsToBoard({
  id,
  columns,
}: {
  id: string;
  columns: { name: string }[];
}) {
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
  for (const name of newColumnNames) {
    if (existingColumnNames.includes(name)) {
      throw new Error(`Column name "${name}" already exists in the board`);
    }
  }

  const newColumns = [];

  for (const column of columns) {
    const newColumn = new Column({ name: column.name.trim() });
    await newColumn.save();
    board.columns.push(newColumn._id);
    newColumns.push(newColumn);
  }

  await board.save();
  return newColumns;
}
