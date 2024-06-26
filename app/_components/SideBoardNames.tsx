"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BoardType } from "../_lib/type";
import { TbLayoutBoardSplit } from "react-icons/tb";
import { useBoard } from "../context/BoardContext";

function SideBoardNames({ data }: { data: BoardType[] }) {
  const { addNewBoard } = useBoard();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeBoard = searchParams.get("board") ?? data?.[0]?.name;

  function handleClick() {
    addNewBoard();
    console.log("clicked");
  }

  const handleBoardClick = (boardName: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("board", boardName);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    router.refresh();
  };

  return (
    <ul className="flex flex-col gap-6">
      {data.map((board) => (
        <li
          key={board._id}
          className={`flex cursor-pointer items-center gap-4 rounded-[0_10rem_10rem_0] px-[3.2rem] py-[1.4rem] text-[1.5rem] font-bold text-white transition-all duration-300 ${board.name === activeBoard ? "bg-[#635fc7]" : "hover:bg-white hover:text-[#635fc7]"}`}
          onClick={() => handleBoardClick(board.name)}
        >
          <TbLayoutBoardSplit className="h-[2rem] w-[2rem]" />
          <span>{board.name}</span>
        </li>
      ))}

      <button
        className="flex items-center gap-4 px-[3.2rem] pt-[1.4rem] text-[1.5rem] font-bold text-[#635fc7]"
        onClick={handleClick}
      >
        <TbLayoutBoardSplit className="h-[2rem] w-[2rem]" />
        <span>+ Create New Board</span>
      </button>
    </ul>
  );
}

export default SideBoardNames;
