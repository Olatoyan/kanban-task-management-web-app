"use client";

import { BoardType, isSessionType } from "@/app/_lib/type";
import BoardHeader from "@/app/_components/BoardHeader";
import BoardContainer from "@/app/_components/BoardContainer";
import Spinner from "./Spinner";
import { Suspense } from "react";
import { useTheme } from "../context/ThemeContext";
import SideBar from "./SideBar";
// import SideBarNavigation from "./SideBarNavigation";

function MainPage({
  data,
  isSession,
}: {
  data: BoardType[];
  isSession: isSessionType;
}) {
  const {
    state: { isDarkMode },
  } = useTheme();

  return (
    <>
      <SideBar data={data} />
      <section
        className={`relative h-full border-l border-[#3e3f4e] transition-all duration-300 ${isDarkMode ? "bg-[#20212c]" : "bg-[#faf7fd]"}`}
      >
        <BoardHeader data={data} isSession={isSession} />

        <Suspense fallback={<Spinner />}>
          <BoardContainer data={data} isSession={isSession} />
        </Suspense>
      </section>
    </>
  );
}

export default MainPage;
