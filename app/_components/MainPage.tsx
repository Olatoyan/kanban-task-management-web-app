"use client";

import { BoardType } from "@/app/_lib/type";
import BoardHeader from "@/app/_components/BoardHeader";
import BoardContainer from "@/app/_components/BoardContainer";
import Spinner from "./Spinner";
import { Suspense } from "react";
import { useTheme } from "../context/ThemeContext";

function MainPage({ data }: { data: BoardType[] }) {
  const {
    state: { isDarkMode },
  } = useTheme();

  return (
    <section
      className={`relative h-full border-l border-[#3e3f4e] transition-all duration-300 ${isDarkMode ? "bg-[#20212c]" : "bg-[#faf7fd]"}`}
    >
      <BoardHeader data={data} />

      <Suspense fallback={<Spinner />}>
        <BoardContainer data={data} />
      </Suspense>
    </section>
  );
}

export default MainPage;
