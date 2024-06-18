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
});

const Board = mongoose.models.Board || mongoose.model("Board", boardSchema);
export default Board;
