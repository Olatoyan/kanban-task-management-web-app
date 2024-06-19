"use client";

import { ReactNode, createContext, useContext, useReducer } from "react";
import { TaskType } from "../_lib/type";

type StateType = {
  selectedTask: TaskType | null;
  isViewingTask: boolean;
};

type ActionType =
  | { type: "SET_SELECTED_TASK"; payload: TaskType }
  | { type: "CLEAR_SELECTED_TASK" };

const initialState: StateType = {
  selectedTask: null,
  isViewingTask: false,
};

const BoardContext = createContext<{
  state: StateType;
  dispatch: React.Dispatch<ActionType>;
  setSelectedTask: (task: TaskType) => void;
  clearSelectedTask: () => void;
}>({
  state: initialState,
  dispatch: () => null,
  setSelectedTask: () => {},
  clearSelectedTask: () => {},
});

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case "SET_SELECTED_TASK":
      return { ...state, selectedTask: action.payload, isViewingTask: true };
    case "CLEAR_SELECTED_TASK":
      return { ...state, selectedTask: null, isViewingTask: false };
    default:
      return state;
  }
};

function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  function setSelectedTask(task: TaskType) {
    dispatch({ type: "SET_SELECTED_TASK", payload: task });
  }

  function clearSelectedTask() {
    dispatch({ type: "CLEAR_SELECTED_TASK" });
  }

  return (
    <BoardContext.Provider
      value={{ state, dispatch, setSelectedTask, clearSelectedTask }}
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
