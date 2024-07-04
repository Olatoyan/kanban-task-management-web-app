import { useFormStatus } from "react-dom";

function Button({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button className="rounded-[2rem] bg-[#635fc7] py-[0.8rem] text-[1.3rem] font-bold leading-[2.3rem] text-white transition-all duration-300 hover:bg-[#a8a4ff]">
      {pending ? pendingLabel : label}
    </button>
  );
}

export default Button;
