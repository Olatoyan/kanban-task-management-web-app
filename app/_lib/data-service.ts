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
      _id: column._id.toString(),
      // Populate other properties of column if needed
      tasks: column.tasks.map((task: any) => ({
        _id: task._id.toString(),
        // Populate other properties of task if needed
        subtasks: task.subtasks.map((subtask: any) => ({
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

// export async function getAllTasks() {
//   await connectToDb();

//   const data = await Board.find().populate("columns");
//   return data;
// }
