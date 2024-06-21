import User from "@/models/userModel";
import connectToDb from "./connectDb";
import Board from "@/models/boardModel";
import Task from "@/models/taskModel";
import Column from "@/models/columnModel";
import Subtask from "@/models/subtaskModel";

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

// export async function editTask({
//   id,
//   title,
//   description,
//   status,
//   subtasks,
// }: {
//   id: string;
//   title: string;
//   description: string;
//   status: string;
//   subtasks: { title: string }[];
// }) {
//   await connectToDb();

//   const updatedTask = await Task.findByIdAndUpdate(
//     id,
//     {
//       title,
//       description,
//       status,
//       subtasks,
//     },
//     { new: true },
//   );

//   console.log("Updated!!!!!!!!!!");
//   return updatedTask;
// }

// export async function getAllTasks() {
//   await connectToDb();

//   const data = await Board.find().populate("columns");
//   return data;
// }

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

  // Update the main task with the new set of subtask IDs and other details
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
