"use client";

import { BsEyeSlash, BsMoonStarsFill, BsSun } from "react-icons/bs";
import { useTheme } from "@/app/_context/ThemeContext";

function ToggleTheme() {
  const {
    toggleSidebar,
    toggleDarkMode,
    state: { isDarkMode },
  } = useTheme();

  return (
    <div className="mt-auto flex flex-col gap-7">
      <div
        className={`group mx-7 flex cursor-pointer items-center justify-center gap-12 rounded-lg py-6 text-[2rem] transition-all duration-300 ${isDarkMode ? "bg-[#20212c] text-white" : "bg-[#F4F7FD] text-[#20212c]"}`}
        onClick={toggleDarkMode}
      >
        <BsSun />
        <div
          className={`relative h-[2rem] w-[4rem] rounded-full bg-[#635fc7] before:absolute before:top-[11%] before:h-[1.5rem] before:w-[1.5rem] before:rounded-full before:bg-white before:transition-all before:duration-300 group-hover:bg-[#9694d6] ${isDarkMode ? "before:translate-x-[2rem]" : "before:translate-x-[0.4rem]"}`}
        ></div>
        <BsMoonStarsFill />
      </div>

      <button
        className={`flex items-center gap-4 rounded-[0_10rem_10rem_0] px-[3.2rem] py-[1.4rem] text-[1.5rem] font-bold text-[#828fa3] transition-all duration-300 hover:text-[#635fc7] tablet:hidden ${isDarkMode ? "hover:bg-white" : "hover:bg-[#635fc7] hover:bg-opacity-10"}`}
        onClick={toggleSidebar}
      >
        <BsEyeSlash />
        <p>Hide Sidebar</p>
      </button>
    </div>
  );
}

export default ToggleTheme;
