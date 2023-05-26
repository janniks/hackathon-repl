const Page = () => {
  return (
    <>
      <div className="flex flex-col items-center text-zinc-50">
        <div className="px-10 py-8 bg-zinc-600 rounded-xl border border-zinc-500 text-center space-y-3">
          <p className="text-2xl font-['Aeonik_Fono']">
            👋 Welcome to the Stacks.js{" "}
            <strong className="text-[#FF9ECF]">Playground</strong>
          </p>
          <p>A magical place to run Stacks.js code from the browser ✨</p>
        </div>
        <p className="text-center mt-4 text-zinc-400 font-['Aeonik_Fono']">
          More coming soon! <span className="opacity-80">🤫</span>
        </p>

        <p className="text-zinc-50 text-xl my-28 relative">
          Start by loading an example snippet
          <img
            className="hidden lg:block absolute left-2/3"
            src="/arrow-right.svg"
            alt=""
          />
          <img
            className="block lg:hidden absolute left-2/3"
            src="/arrow-down.svg"
            alt=""
          />
        </p>
      </div>
    </>
  );
};

export default Page;
