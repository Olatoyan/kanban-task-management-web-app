"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BoardType } from "../_lib/type";
import { TbLayoutBoardSplit } from "react-icons/tb";

function SideBoardNames({ data }: { data: BoardType[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeBoard = searchParams.get("board") ?? data[0].name;

  const handleBoardClick = (boardName: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("board", boardName);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    router.refresh();
  };

  return (
    <>
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
    </>
  );
}

export default SideBoardNames;
