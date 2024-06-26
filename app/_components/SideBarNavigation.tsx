import { getAllTasks } from "../_lib/data-service";
import { BoardType } from "../_lib/type";
import SideBar from "./SideBar";

async function SideBarNavigation() {
  const data: BoardType[] = await getAllTasks();

  // console.log(data);

  return <SideBar data={data} />;
}

export default SideBarNavigation;
