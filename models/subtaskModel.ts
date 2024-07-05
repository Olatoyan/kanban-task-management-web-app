import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Subtask =
  mongoose.models.Subtask || mongoose.model("Subtask", subtaskSchema);
export default Subtask;
