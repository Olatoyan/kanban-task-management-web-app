"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";

type StateType = {
  isSidebarHidden: boolean;
  isDarkMode: boolean;
  isMobileNavOpen: boolean;
};

type ActionType =
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "TOGGLE_DARK_MODE" }
  | { type: "TOGGLE_MOBILE_NAV" }
  | { type: "CLOSE_MOBILE_NAV" }
  | { type: "SET_DARK_MODE"; payload: boolean };

const initialState: StateType = {
  isSidebarHidden: false,
  isDarkMode: true,
  isMobileNavOpen: false,
};

const ThemeContext = createContext<{
  state: StateType;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;
}>({
  state: initialState,
  toggleSidebar: () => {},
  toggleDarkMode: () => {},
  toggleMobileNav: () => {},
  closeMobileNav: () => {},
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
    case "TOGGLE_MOBILE_NAV":
      return {
        ...state,
        isMobileNavOpen: !state.isMobileNavOpen,
      };
    case "CLOSE_MOBILE_NAV":
      return {
        ...state,
        isMobileNavOpen: false,
      };
    case "SET_DARK_MODE":
      return { ...state, isDarkMode: action.payload };
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

  function toggleMobileNav() {
    dispatch({ type: "TOGGLE_MOBILE_NAV" });
  }

  function closeMobileNav() {
    dispatch({ type: "CLOSE_MOBILE_NAV" });
  }

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );


    if (darkModeMediaQuery.matches) {
      dispatch({ type: "SET_DARK_MODE", payload: true });
    } else {
      dispatch({ type: "SET_DARK_MODE", payload: false });
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        state,
        toggleSidebar,
        toggleDarkMode,
        toggleMobileNav,
        closeMobileNav,
      }}
    >
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
