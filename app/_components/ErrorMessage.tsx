import { ReactNode } from "react";

function ErrorMessage({ children }: { children: ReactNode }) {
  return (
    <p className="absolute right-[1.5rem] top-1/2 -translate-y-1/2 text-[1.2rem] font-medium leading-[2.3rem] text-[#ea5555]">
      {children}
    </p>
  );
}

export default ErrorMessage;
