import mongoose from "mongoose";

const columnSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Column = mongoose.models.Column || mongoose.model("Column", columnSchema);
export default Column;
