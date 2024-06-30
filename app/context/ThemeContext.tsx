"use client";

import { ReactNode, createContext, useContext, useReducer } from "react";

type StateType = {
  isSidebarHidden: boolean;
  isDarkMode: boolean;
};

type ActionType = { type: "TOGGLE_SIDEBAR" } | { type: "TOGGLE_DARK_MODE" };

const initialState: StateType = {
  isSidebarHidden: false,
  isDarkMode: true,
};

const ThemeContext = createContext<{
  state: StateType;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
}>({
  state: initialState,
  toggleSidebar: () => {},
  toggleDarkMode: () => {},
});

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        isSidebarHidden: !state.isSidebarHidden,
      };
    case "TOGGLE_DARK_MODE":
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
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

  function toggleDarkMode() {
    dispatch({ type: "TOGGLE_DARK_MODE" });
  }

  return (
    <ThemeContext.Provider value={{ state, toggleSidebar, toggleDarkMode }}>
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
