"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BoardType, isSessionType } from "../_lib/type";
import { useState } from "react";
import { BsThreeDotsVertical, BsChevronDown } from "react-icons/bs";
import { useBoard } from "../context/BoardContext";
import { useTheme } from "../context/ThemeContext";
import Image from "next/image";

import { BsPlus } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";

import MobileLogo from "@/public/logo-mobile.svg";
import { signOutAction } from "../_lib/actions";

function BoardHeader({
  data,
  isSession,
}: {
  data: BoardType[];
  isSession: isSessionType;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { addNewTask, setSelectedBoard, deleteSelectedBoard, setIsLoading } =
    useBoard();

  const {
    state: { isDarkMode, isMobileNavOpen },
    toggleMobileNav,
  } = useTheme();

  const boardName = searchParams.get("board") ?? data?.[0]?.name ?? "";

  const currentBoardData = data?.find((board) => board.name === boardName);

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  function handleOpenOptionsBtn() {
    setIsOptionsOpen((prev) => !prev);
  }

  function handleCloseOptionsBtn() {
    setIsOptionsOpen(false);
  }

  // useEffect(() => {
  //   if (!boardName) return;
  //   const currentBoard = searchParams.get("board");
  //   if (currentBoard !== boardName) {
  //     const params = new URLSearchParams(window.location.search);
  //     params.set("board", boardName);
  //     router.push(`${pathname}?${params.toString()}`, { scroll: false });
  //   }
  // }, [boardName, searchParams, pathname, router]);

  async function logUserOut() {
    setIsLoading(true);
    await signOutAction();
    router.push("/", { scroll: false });
    setIsLoading(false);
  }

  return (
    <div
      className={`flex items-center justify-between border-b px-20 py-11 transition-all duration-200 tablet:px-6 ${isDarkMode ? "border-[#3e3f4e] bg-[#2b2c37]" : "border-[#e4ebfa] bg-white"}`}
    >
      <div className="flex items-center gap-6">
        <Image src={MobileLogo} alt="logo" className="hidden tablet:block" />
        <h1
          className={`flex items-center gap-4 text-[2.4rem] font-bold transition-all duration-300 tablet:text-[1.8rem] ${isDarkMode ? "text-white" : "text-[#000112]"}`}
          onClick={toggleMobileNav}
        >
          <span>{boardName === undefined ? "" : boardName}</span>

          <span>
            <BsChevronDown
              className={`hidden text-[#635fc7] transition-all duration-300 tablet:inline-block ${isMobileNavOpen ? "rotate-180" : "rotate-0"}`}
            />
          </span>
        </h1>
      </div>

      <div className="relative flex items-center gap-6">
        {isSession && (
          <button className="pr-20" onClick={logUserOut}>
            <CiLogout className="text-[3rem] text-[#828fa3]" />
          </button>
        )}

        <button
          className="flex items-center gap-4 rounded-[2.4rem] bg-[#635fc7] px-[3.2rem] py-[1.4rem] text-[1.5rem] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 tablet:px-4 tablet:py-2"
          onClick={addNewTask}
          disabled={data.length === 0 || currentBoardData!.columns.length === 0}
        >
          <BsPlus className={`text-[3rem]`} />
          <span className="tablet:hidden">Add New Task</span>
        </button>

        <button
          disabled={data.length === 0}
          className={`rounded-[1rem] py-4 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${isDarkMode ? "hover:bg-[#20212c]" : "hover:bg-[#E4EBFA]"}`}
        >
          <BsThreeDotsVertical
            className="text-[2rem] text-[#828fa3] tablet:text-[2.5rem]"
            onClick={handleOpenOptionsBtn}
          />
        </button>

        {isOptionsOpen && (
          <div
            className={`absolute right-0 top-[7rem] flex w-full flex-col gap-[1.6rem] p-[1.6rem] shadow-[0px_10px_20px_0px_rgba(54,78,126,0.25)] tablet:w-[16rem] ${isDarkMode ? "bg-[#20212c]" : "bg-white"}`}
          >
            <p
              className="cursor-pointer text-[1.3rem] font-medium leading-[2.3rem] text-[#828fa3]"
              onClick={() => {
                handleCloseOptionsBtn();
                setSelectedBoard();
              }}
            >
              Edit Board
            </p>
            <p
              className="cursor-pointer text-[1.3rem] font-medium leading-[2.3rem] text-[#ea5555]"
              onClick={() => {
                handleCloseOptionsBtn();
                deleteSelectedBoard(currentBoardData!, "board");
              }}
            >
              Delete Board
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BoardHeader;
