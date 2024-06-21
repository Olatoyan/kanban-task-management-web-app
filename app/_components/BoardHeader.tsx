"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BoardType } from "../_lib/type";
import { useEffect } from "react";

function BoardHeader({ data }: { data: BoardType[] }) {
  const searchParams = useSearchParams();

  const router = useRouter();
  const pathname = usePathname();

  const boardName = searchParams.get("board") ?? data[0].name;

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

      <div>
        <button className="flex items-center gap-4 rounded-[2.4rem] bg-[#635fc7] px-[3.2rem] py-[1.4rem] text-[1.5rem] font-bold text-white">
          + Add New Task
        </button>
      </div>
    </div>
  );
}

export default BoardHeader;
