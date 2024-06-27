import Link from "next/link";
import { getAllTasks } from "./_lib/data-service";
import { BoardType } from "./_lib/type";
import BoardHeader from "@/app/_components/BoardHeader";
import BoardContainer from "@/app/_components/BoardContainer";
import Spinner from "./_components/Spinner";
import { Suspense } from "react";

export const revalidate = 0;
async function page() {
  const data: BoardType[] = (await getAllTasks()) ?? [];

  return (
    <section className="relative h-full border-l border-[#3e3f4e] bg-[#20212c]">
      <BoardHeader data={data} />

      <Suspense fallback={<Spinner />}>
        <BoardContainer data={data} />
      </Suspense>
    </section>
  );
}

export default page;
