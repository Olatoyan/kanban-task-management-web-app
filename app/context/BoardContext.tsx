"use client";

import { ReactNode, createContext, useContext, useReducer } from "react";
import { BoardType, TaskType } from "../_lib/type";

type StateType = {
  selectedTask: TaskType | null;
  selectedBoard: BoardType | null;
  isViewingTask: boolean;
  isEditingTask: boolean;
  isAddingTask: boolean;
  isAddingBoard: boolean;
  isAddingColumn: boolean;
  isEditingBoard: boolean;
  isDeletingTask: string | null;
  deletedTask: TaskType | null;
  deletedBoard: BoardType | null;
};

type ActionType =
  | { type: "SET_SELECTED_TASK"; payload: TaskType }
  // | { type: "SET_SELECTED_BOARD"; payload: BoardType }
  | { type: "SET_SELECTED_BOARD" }
  | { type: "CLEAR_SELECTED_TASK" }
  | { type: "EDIT_SELECTED_TASK" }
  | {
      type: "DELETE_SELECTED_TASK";
      payload: { data: TaskType; deletedType: string };
    }
  | {
      type: "DELETE_SELECTED_BOARD";
      payload: { data: BoardType; deletedType: string };
    }
  | { type: "ADD_NEW_TASK" }
  | { type: "ADD_NEW_BOARD" }
  | { type: "ADD_NEW_COLUMN" };

const initialState: StateType = {
  selectedTask: null,
  selectedBoard: null,
  isViewingTask: false,
  isEditingTask: false,
  isAddingTask: false,
  isAddingBoard: false,
  isAddingColumn: false,
  isEditingBoard: false,
  isDeletingTask: null,
  deletedTask: null,
  deletedBoard: null,
};

const BoardContext = createContext<{
  state: StateType;
  dispatch: React.Dispatch<ActionType>;
  setSelectedTask: (task: TaskType) => void;
  setSelectedBoard: () => void;
  // setSelectedBoard: (board: BoardType) => void;
  clearSelectedTask: () => void;
  editSelectedTask: () => void;
  deleteSelectedTask: (task: TaskType, deletedType: string) => void;
  deleteSelectedBoard: (board: BoardType, deletedType: string) => void;
  addNewTask: () => void;
  addNewBoard: () => void;
  addNewColumn: () => void;
}>({
  state: initialState,
  dispatch: () => null,
  setSelectedTask: () => {},
  setSelectedBoard: () => {},
  clearSelectedTask: () => {},
  editSelectedTask: () => {},
  deleteSelectedTask: () => {},
  deleteSelectedBoard: () => {},
  addNewTask: () => {},
  addNewBoard: () => {},
  addNewColumn: () => {},
});

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case "SET_SELECTED_TASK":
      return {
        ...state,
        selectedTask: action.payload,
        isViewingTask: true,
      };
    case "SET_SELECTED_BOARD":
      return {
        ...state,
        // selectedBoard: action.payload,
        isEditingBoard: true,
      };
    case "CLEAR_SELECTED_TASK":
      return {
        ...state,
        selectedTask: null,
        selectedBoard: null,
        isViewingTask: false,
        isEditingTask: false,
        isDeletingTask: null,
        isAddingTask: false,
        isAddingBoard: false,
        isEditingBoard: false,
        isAddingColumn: false,
      };
    case "EDIT_SELECTED_TASK":
      return { ...state, isEditingTask: true, isViewingTask: false };
    case "DELETE_SELECTED_TASK":
      return {
        ...state,
        deletedTask: action.payload.data,
        isDeletingTask: action.payload.deletedType,
        isViewingTask: false,
        isEditingTask: false,
      };
    case "DELETE_SELECTED_BOARD":
      return {
        ...state,
        deletedBoard: action.payload.data,
        isDeletingTask: action.payload.deletedType,
        isViewingTask: false,
        isEditingTask: false,
      };
    case "ADD_NEW_TASK":
      return {
        ...state,
        isAddingTask: true,
        isViewingTask: false,
        isEditingTask: false,
      };
    case "ADD_NEW_BOARD":
      return {
        ...state,
        isAddingBoard: true,
        isAddingTask: false,
        isViewingTask: false,
        isEditingTask: false,
      };
    case "ADD_NEW_COLUMN":
      return {
        ...state,
        isAddingColumn: true,
      };
    default:
      return state;
  }
};

function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  function setSelectedTask(task: TaskType) {
    dispatch({ type: "SET_SELECTED_TASK", payload: task });
  }

  function setSelectedBoard() {
    dispatch({ type: "SET_SELECTED_BOARD" });
  }

  function clearSelectedTask() {
    dispatch({ type: "CLEAR_SELECTED_TASK" });
  }

  function editSelectedTask() {
    dispatch({ type: "EDIT_SELECTED_TASK" });
  }

  function deleteSelectedTask(task: TaskType, deletedType: string) {
    dispatch({
      type: "DELETE_SELECTED_TASK",
      payload: { data: task, deletedType },
    });
  }

  function deleteSelectedBoard(board: BoardType, deletedType: string) {
    dispatch({
      type: "DELETE_SELECTED_BOARD",
      payload: { data: board, deletedType },
    });
  }

  function addNewTask() {
    dispatch({ type: "ADD_NEW_TASK" });
  }

  function addNewBoard() {
    dispatch({ type: "ADD_NEW_BOARD" });
  }

  function addNewColumn() {
    dispatch({ type: "ADD_NEW_COLUMN" });
  }

  return (
    <BoardContext.Provider
      value={{
        state,
        dispatch,
        setSelectedTask,
        setSelectedBoard,
        clearSelectedTask,
        editSelectedTask,
        deleteSelectedTask,
        deleteSelectedBoard,
        addNewTask,
        addNewBoard,
        addNewColumn,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

function useBoard() {
  const context = useContext(BoardContext);

  if (context === undefined) {
    throw new Error("useBoard must be used within a BoardProvider");
  }

  return context;
}

export { BoardProvider, useBoard };
