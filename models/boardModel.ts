import mongoose from "mongoose";
import Column from "./columnModel";

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  columns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column",
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Board = mongoose.models.Board || mongoose.model("Board", boardSchema);
export default Board;
