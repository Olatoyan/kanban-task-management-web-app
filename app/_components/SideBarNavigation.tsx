import { Suspense } from "react";
import { getAllTasks } from "../_lib/data-service";
import { BoardType } from "../_lib/type";
import SideBar from "./SideBar";
import Spinner from "./Spinner";

export const revalidate = 0;
async function SideBarNavigation() {
  const data: BoardType[] = await getAllTasks();

  // console.log(data);

  return (
    <Suspense fallback={<Spinner />}>
      <SideBar data={data} />;
    </Suspense>
  );
}

export default SideBarNavigation;
