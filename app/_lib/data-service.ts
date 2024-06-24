import User from "@/models/userModel";
import connectToDb from "./connectDb";
import Board from "@/models/boardModel";
import Task from "@/models/taskModel";
import Column from "@/models/columnModel";
import Subtask from "@/models/subtaskModel";
import { BoardType, ColumnType } from "./type";

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
    if (subtaskTitles.has(subtask.title)) {
      existingSubtaskIdsToKeep.push(subtask._id);
      existingSubtaskTitles.add(subtask.title);
    } else {
      // Remove subtask if it's not in the form data
      await Subtask.findByIdAndDelete(subtask._id);
    }
  }

  // Add new subtasks from the form data
  for (let subtask of subtasks) {
    if (!existingSubtaskTitles.has(subtask.title)) {
      const newSubtask = new Subtask({ title: subtask.title });
      await newSubtask.save();
      existingSubtaskIdsToKeep.push(newSubtask._id);
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

  const updatedTask = await Task.findByIdAndUpdate(
    id,
    {
      title,
      description,
      status,
      subtasks: existingSubtaskIdsToKeep,
    },
    { new: true },
  );

  console.log("Updated!!!!!!!!!!");
  return updatedTask;
}

export async function addTask({
  board,
  title,
  description,
  status,
  subtasks,
}: {
  board: string;
  title: string;
  description: string;
  status: string;
  subtasks: { title: string }[];
}) {
  await connectToDb();

  // Create each subtask and collect their IDs
  const subtaskIds = [];
  for (const subtask of subtasks) {
    const newSubtask = new Subtask({ title: subtask.title });
    await newSubtask.save();
    subtaskIds.push(newSubtask._id);
  }

  // Create the main task with the collected subtask IDs
  const newTask = new Task({
    title,
    description,
    status,
    subtasks: subtaskIds,
  });

  await newTask.save();

  // Retrieve the current board
  const currentBoard = await Board.findOne({ name: board }).populate({
    path: "columns",
  });

  if (!currentBoard) {
    throw new Error(`Board with name ${board} not found`);
  }

  const findColumn = currentBoard.columns.find(
    (col: { name: string }) => col.name === status,
  );

  const column = await Column.findById(findColumn._id);

  column.tasks.push(newTask._id);

  await column.save();

  // Save the updated board
  await currentBoard.save();

  return newTask;
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

  throw new Error(`Unsupported type: ${type}`);
}
