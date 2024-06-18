import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: String,
  subtasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subtask",
    },
  ],
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
export default Task;
