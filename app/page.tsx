import { getAllTasks } from "./_lib/data-service";
import { BoardType } from "./_lib/type";
import MainPage from "./_components/MainPage";
import { getSession } from "./_lib/userAuth";
import { auth } from "./_lib/auth";

export const revalidate = 0;
async function page() {
  const data: BoardType[] = (await getAllTasks()) ?? [];
  const session = await getSession();
  const OAuthSession = await auth();

  const isSession = session || OAuthSession;

  return <MainPage data={data} isSession={isSession} />;
}

export default page;
