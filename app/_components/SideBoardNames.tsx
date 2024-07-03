"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BoardType } from "../_lib/type";
import { TbLayoutBoardSplit } from "react-icons/tb";
import { useBoard } from "../context/BoardContext";
import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

function SideBoardNames({ data }: { data: BoardType[] }) {
  const { addNewBoard, setIsLoading } = useBoard();
  const {
    state: { isDarkMode },
    closeMobileNav,
  } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeBoard = searchParams.get("board") ?? data?.[0]?.name;

  console.log("activeboard!!!!!", activeBoard);

  function handleClick() {
    addNewBoard();
    closeMobileNav();
    console.log("clicked");
  }

  const handleBoardClick = (boardName: string) => {
    setIsLoading(true);
    const params = new URLSearchParams(window.location.search);
    params.set("board", boardName);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    router.refresh();
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (activeBoard === undefined) return;
    params.set("board", activeBoard);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    router.refresh();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams, activeBoard, router]);

  return (
    <ul className="flex flex-col gap-6 tablet:gap-0">
      {data.map((board) => (
        <li
          key={board._id}
          className={`flex cursor-pointer items-center gap-4 rounded-[0_10rem_10rem_0] px-[3.2rem] py-[1.4rem] text-[1.5rem] font-bold transition-all duration-300 tablet:pl-8 ${board.name === activeBoard ? "bg-[#635fc7] text-white" : "text-[#828fa3]"} ${
            isDarkMode
              ? board.name !== activeBoard &&
                "hover:bg-white hover:text-[#635fc7]"
              : board.name !== activeBoard &&
                "hover:bg-[#635fc7] hover:bg-opacity-10 hover:text-[#635fc7]"
          }`}
          onClick={() => {
            handleBoardClick(board.name);
            closeMobileNav();
          }}
        >
          <TbLayoutBoardSplit className="h-[2rem] w-[2rem]" />
          <span>{board.name}</span>
        </li>
      ))}

      <button
        className="flex items-center gap-4 pl-[3.2rem] pt-[1.4rem] text-[1.5rem] font-bold text-[#635fc7] tablet:pb-10 tablet:pl-8"
        onClick={handleClick}
      >
        <TbLayoutBoardSplit className="h-[2rem] w-[2rem]" />
        <span>+ Create New Board</span>
      </button>
    </ul>
  );
}

export default SideBoardNames;
