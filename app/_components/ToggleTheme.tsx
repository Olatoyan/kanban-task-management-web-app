import { BsEyeSlash, BsMoonStarsFill, BsSun } from "react-icons/bs";

function ToggleTheme() {
  return (
    <div className="mt-auto flex flex-col gap-7 px-7">
      <div className="flex items-center justify-center gap-12 rounded-lg bg-[#20212c] py-6 text-[2rem] text-white">
        <BsSun />
        <div className="relative h-[2rem] w-[4rem] rounded-full bg-[#635fc7] before:absolute before:left-[8%] before:top-[11%] before:h-[1.5rem] before:w-[1.5rem] before:rounded-full before:bg-white"></div>
        <BsMoonStarsFill />
      </div>

      <div className="flex items-center gap-4 text-[1.5rem] font-bold text-[#828fa3]">
        <BsEyeSlash />
        <p>Hide Sidebar</p>
      </div>
    </div>
  );
}

export default ToggleTheme;
