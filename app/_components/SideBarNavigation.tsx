import { getAllTasks } from "../_lib/data-service";
import { BoardType } from "../_lib/type";
import Logo from "./Logo";
import { TbLayoutBoardSplit } from "react-icons/tb";
import ToggleTheme from "./ToggleTheme";
import SideBoardNames from "./SideBoardNames";

async function SideBarNavigation() {
  const data: BoardType[] = await getAllTasks();

  // console.log(data);

  return (
    <aside className="flex w-full max-w-[30rem] flex-col bg-[#2B2C37] pt-[3.2rem]">
      <Logo />
      <nav className="mt-[5.4rem] flex flex-col gap-8 pr-[2.3rem]">
        <h2 className="px-[3.2rem] text-[1.2rem] font-bold tracking-[0.24rem] text-[#828fa3]">
          All Boards ({data.length})
        </h2>

        <ul className="flex flex-col gap-6">
          <SideBoardNames data={data} />

          <button className="flex items-center gap-4 px-[3.2rem] pt-[1.4rem] text-[1.5rem] font-bold text-[#635fc7]">
            <TbLayoutBoardSplit className="h-[2rem] w-[2rem]" />
            <span>+ Create New Board</span>
          </button>
        </ul>
      </nav>

      <ToggleTheme />
    </aside>
  );
}

export default SideBarNavigation;
