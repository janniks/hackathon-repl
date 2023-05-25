import { cn } from "../lib/helpers";

const Button = ({
  text,
  onClick,
  disabled = false,
  className = "",
}: {
  text: string;
  onClick?: (...args: any[]) => void;
  disabled?: boolean;
  className?: string;
}) => {
  function noop() {}
  return (
    <button
      onClick={onClick || noop}
      disabled={disabled}
      className={cn(
        "mr-4 text-[#2f8a36] bg-[#C2EBC4] hover:bg-[#99dc9d] font-bold py-2 px-4 rounded transition-colors",
        disabled &&
          "text-zinc-400 bg-zinc-500 hover:bg-zinc-500 cursor-not-allowed",
        className
      )}
    >
      {text}
    </button>
  );
};
export default Button;
