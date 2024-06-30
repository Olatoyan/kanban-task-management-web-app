import { getAllTasks } from "./_lib/data-service";
import { BoardType } from "./_lib/type";
import MainPage from "./_components/MainPage";

export const revalidate = 0;
async function page() {
  const data: BoardType[] = (await getAllTasks()) ?? [];

  return <MainPage data={data} />;
}

export default page;
