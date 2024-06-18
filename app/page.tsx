import Link from "next/link";
import { getAllTasks } from "./_lib/data-service";
import Data from "./_components/Data";

async function page() {

  return (
    <div>
      <Link href="/login">Login</Link>
    </div>
  );
}

export default page;
