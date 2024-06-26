"use client";

import { getAllTasks } from "../_lib/data-service";
import { BoardType } from "../_lib/type";
import Logo from "./Logo";
import { TbLayoutBoardSplit } from "react-icons/tb";
import ToggleTheme from "./ToggleTheme";
import SideBoardNames from "./SideBoardNames";
import { useTheme } from "../context/ThemeContext";

function SideBar({ data }: { data: BoardType[] }) {
  const { state } = useTheme();
  // console.log(data);

  return (
    <aside
      className={`w-full max-w-[30rem] flex-col bg-[#2B2C37] pt-[3.2rem] ${state.isSidebarHidden ? "hidden" : "flex"}`}
    >
      <Logo />
      <nav className="mt-[5.4rem] flex flex-col gap-8 pr-[2.3rem]">
        <h2 className="px-[3.2rem] text-[1.2rem] font-bold tracking-[0.24rem] text-[#828fa3]">
          All Boards ({data.length})
        </h2>

        <SideBoardNames data={data} />
      </nav>

      <ToggleTheme />
    </aside>
  );
}

export default SideBar;
