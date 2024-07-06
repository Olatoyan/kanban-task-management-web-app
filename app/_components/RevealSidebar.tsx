import { BsEyeFill } from "react-icons/bs";
import { useTheme } from "@/app/_context/ThemeContext";

function RevealSidebar() {
  const { state, toggleSidebar } = useTheme();

  return (
    <div
      className={`absolute bottom-[3.2rem] left-0 flex h-[4.8rem] w-[5.6rem] cursor-pointer items-center justify-center rounded-[0_10rem_10rem_0] bg-[#635fc7] text-[2rem] text-white transition-all duration-300 hover:bg-[#A8A4FF] ${state.isSidebarHidden ? "block" : "hidden"}`}
      onClick={toggleSidebar}
    >
      <BsEyeFill />
    </div>
  );
}

export default RevealSidebar;
