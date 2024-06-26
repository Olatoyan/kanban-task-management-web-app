"use client";

import { BsEyeSlash, BsMoonStarsFill, BsSun } from "react-icons/bs";
import { useTheme } from "../context/ThemeContext";

function ToggleTheme() {
  const { toggleSidebar } = useTheme();

  return (
    <div className="mt-auto flex flex-col gap-7">
      <div className="group mx-7 flex cursor-pointer items-center justify-center gap-12 rounded-lg bg-[#20212c] py-6 text-[2rem] text-white">
        <BsSun />
        <div className="relative h-[2rem] w-[4rem] rounded-full bg-[#635fc7] transition-all duration-300 before:absolute before:left-[8%] before:top-[11%] before:h-[1.5rem] before:w-[1.5rem] before:rounded-full before:bg-white group-hover:bg-[#9694d6]"></div>
        <BsMoonStarsFill />
      </div>

      <button
        className="flex items-center gap-4 rounded-[0_10rem_10rem_0] px-[3.2rem] py-[1.4rem] text-[1.5rem] font-bold text-[#828fa3] transition-all duration-300 hover:bg-white hover:text-[#635fc7]"
        onClick={toggleSidebar}
      >
        <BsEyeSlash />
        <p>Hide Sidebar</p>
      </button>
    </div>
  );
}

export default ToggleTheme;
