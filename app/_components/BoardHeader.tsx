"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BoardType } from "../_lib/type";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useBoard } from "../context/BoardContext";

function BoardHeader({ data }: { data: BoardType[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { addNewTask, setSelectedBoard } = useBoard();

  const boardName = searchParams.get("board") ?? data[0].name;

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  function handleOpenOptionsBtn() {
    setIsOptionsOpen((prev) => !prev);
  }

  function handleCloseOptionsBtn() {
    setIsOptionsOpen(false);
  }

  useEffect(() => {
    const currentBoard = searchParams.get("board");
    if (currentBoard !== boardName) {
      const params = new URLSearchParams(window.location.search);
      params.set("board", boardName);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [boardName, searchParams, pathname, router]);

  return (
    <div className="flex items-center justify-between bg-[#2b2c37] px-20 py-11">
      <h1 className="text-[2.4rem] font-bold text-white">{boardName}</h1>

      <div className="relative flex items-center gap-6">
        <button
          className="flex items-center gap-4 rounded-[2.4rem] bg-[#635fc7] px-[3.2rem] py-[1.4rem] text-[1.5rem] font-bold text-white"
          onClick={addNewTask}
        >
          + Add New Task
        </button>

        <button>
          <BsThreeDotsVertical
            className="cursor-pointer text-[2rem] text-[#828fa3]"
            onClick={handleOpenOptionsBtn}
          />
        </button>

        {isOptionsOpen && (
          <div className="absolute right-0 top-[7rem] flex w-full flex-col gap-[1.6rem] bg-[#20212c] p-[1.6rem] shadow-[0px_10px_20px_0px_rgba(54,78,126,0.25)]">
            <p
              className="cursor-pointer text-[1.3rem] font-medium leading-[2.3rem] text-[#828fa3]"
              onClick={setSelectedBoard}
            >
              Edit Board
            </p>
            <p className="text-[1.3rem] font-medium leading-[2.3rem] text-[#ea5555]">
              Delete Board
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BoardHeader;
