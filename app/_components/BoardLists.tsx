import { ColumnType } from "@/app/_lib/type";

import BoardItem from "./BoardItem";

const colors = [
  "bg-[#FF5733]",
  "bg-[#FFC300]",
  "bg-[#DAF7A6]",
  "bg-[#FF33F6]",
  "bg-[#33FFF3]",
  "bg-[#FF3333]",
  "bg-[#Fd5679]",
  "bg-[#3380FF]",
  "bg-[#C70039]",
  "bg-[#9D38BD]",
  "bg-[#7CFC00]",
  "bg-[#F0E68C]",
  "bg-[#00C853]",
  "bg-[#EAECC6]",
  "bg-[#EE82EE]",
];

function BoardLists({ data, index }: { data: ColumnType; index: number }) {
  const color = colors[index % colors.length];

  return (
    <div className="flex w-[28rem] flex-col gap-8">
      <div className="flex items-center gap-4 pb-2">
        <p className={`h-[1.5rem] w-[1.5rem] rounded-full ${color}`}></p>
        <span className="text-[1.2rem] font-bold tracking-[0.24rem] text-[#828fa3]">
          {data.name} ({data.tasks.length})
        </span>
      </div>

      {data.tasks.map((task) => (
        <BoardItem key={task._id} task={task} />
      ))}
    </div>
  );
}

export default BoardLists;
