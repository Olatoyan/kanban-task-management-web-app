import { ReactNode } from "react";

function ErrorMessage({ children }: { children: ReactNode }) {
  return (
    <p className=" text-[1.2rem] font-medium leading-[2.3rem] text-[#ea5555]">
      {children}
    </p>
  );
}

export default ErrorMessage;
