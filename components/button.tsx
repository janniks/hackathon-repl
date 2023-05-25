const Button = ({
  text,
  onClick,
  disabled = false,
}: {
  text: string;
  onClick?: (...args: any[]) => void;
  disabled?: boolean;
}) => {
  function noop() {}
  return (
    <button
      onClick={onClick || noop}
      disabled={disabled}
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
        disabled && "bg-gray-400"
      }`}
    >
      {text}
    </button>
  );
};
export default Button;
