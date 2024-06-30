"use client";

import { getAllTasks } from "../_lib/data-service";
import { BoardType } from "../_lib/type";
import Logo from "./Logo";
import { TbLayoutBoardSplit } from "react-icons/tb";
import ToggleTheme from "./ToggleTheme";
import SideBoardNames from "./SideBoardNames";
import { useTheme } from "../context/ThemeContext";

function SideBar({ data }: { data: BoardType[] }) {
  const {
    state: { isDarkMode, isSidebarHidden },
  } = useTheme();
  console.log("SIDEBAR!!!!!!!!!!!!!!!!", data);

  return (
    <aside
      className={`w-full max-w-[30rem] flex-col pt-[3.2rem] transition-all duration-300 ${isSidebarHidden ? "hidden" : "flex"} ${isDarkMode ? "bg-[#2B2C37]" : "bg-white"} `}
    >
      <Logo />
      <nav className="mt-[5.4rem] flex flex-col gap-8 pr-[2.3rem]">
        <h2 className="px-[3.2rem] text-[1.2rem] font-bold tracking-[0.24rem] text-[#828fa3]">
          {data.length > 0 ? `All Boards (${data.length})` : "No Boards"}
        </h2>

        <SideBoardNames data={data} />
      </nav>

      <ToggleTheme />
    </aside>
  );
}

export default SideBar;
