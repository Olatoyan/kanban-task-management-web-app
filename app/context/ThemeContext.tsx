"use client";

import { ReactNode, createContext, useContext, useReducer } from "react";

type StateType = {
  isSidebarHidden: boolean;
};

type ActionType = { type: "TOGGLE_SIDEBAR" };

const initialState: StateType = {
  isSidebarHidden: false,
};

const ThemeContext = createContext<{
  state: StateType;
  toggleSidebar: () => void;
}>({
  state: initialState,
  toggleSidebar: () => {},
});

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        isSidebarHidden: !state.isSidebarHidden,
      };
    default:
      return state;
  }
};

function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  function toggleSidebar() {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  }

  return (
    <ThemeContext.Provider value={{ state, toggleSidebar }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

export { ThemeProvider, useTheme };
