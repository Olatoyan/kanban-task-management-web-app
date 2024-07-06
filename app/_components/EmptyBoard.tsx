import { useBoard } from "@/app/_context/BoardContext";

function EmptyBoard() {
  const { addNewBoard } = useBoard();

  return (
    <section className="flex h-full items-center justify-center">
      <section className="flex flex-col gap-[3.2rem] pr-[2.4rem] text-center">
        <h2 className="text-[1.8rem] font-bold text-[#828fa3]">
          You currently don&#39;t have any boards. Create a new board to get
          started
        </h2>

        <button
          className="rounded-[2.4rem] bg-[#635fc7] px-7 py-6 text-[1.5rem] font-bold text-white transition-all duration-300 hover:bg-[#a8a4ff]"
          onClick={addNewBoard}
        >
          + Create New Board
        </button>
      </section>
    </section>
  );
}

export default EmptyBoard;
