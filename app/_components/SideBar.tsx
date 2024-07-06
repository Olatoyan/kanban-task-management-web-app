"use client";

import { getAllTasks } from "@/app/_lib/data-service";
import { BoardType, isSessionType } from "@/app/_lib/type";
import Logo from "./Logo";
import { TbLayoutBoardSplit } from "react-icons/tb";
import ToggleTheme from "./ToggleTheme";
import SideBoardNames from "./SideBoardNames";
import { useTheme } from "@/app/_context/ThemeContext";

function SideBar({
  data,
  isSession,
}: {
  data: BoardType[];
  isSession: isSessionType;
}) {
  
  const {
    state: { isDarkMode, isSidebarHidden, isMobileNavOpen },
    closeMobileNav,
  } = useTheme();

  return (
    <>
      <aside
        className={`w-[30rem] flex-none flex-col pt-[3.2rem] transition-all duration-300 laptop:w-[26rem] ${isSidebarHidden ? "hidden" : "flex"} ${isDarkMode ? "bg-[#2B2C37]" : "bg-white"} ${isMobileNavOpen ? "tablet:fixed tablet:left-1/2 tablet:top-[10rem] tablet:z-20 tablet:h-[50rem] tablet:-translate-x-1/2 tablet:overflow-auto tablet:rounded-[0.8rem] tablet:py-[1.6rem] tablet:shadow-[0_1rem_2rem_0_rgba(54,78,126,0.25)]" : "tablet:hidden"}`}
      >
        <Logo />
        <nav className="mt-[5.4rem] flex flex-col gap-8 pr-[2.3rem] tablet:mt-0">
          <h2 className="px-[3.2rem] text-[1.2rem] font-bold tracking-[0.24rem] text-[#828fa3] tablet:pl-8">
            {data.length > 0 ? `All Boards (${data.length})` : "No Boards"}
          </h2>

          <SideBoardNames data={data} isSession={isSession} />
        </nav>

        <ToggleTheme />
      </aside>
      <div
        className={`tablet:fixed tablet:bottom-0 tablet:left-0 tablet:right-0 tablet:top-0 tablet:z-[3] tablet:h-full tablet:w-full tablet:bg-black/50 ${isMobileNavOpen ? "tablet:block" : "tablet:hidden"}`}
        onClick={closeMobileNav}
      ></div>
    </>
  );
}

export default SideBar;
