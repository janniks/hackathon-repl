import * as motion from "../lib/motion";

const Page = () => {
  return (
    <>
      <div className="flex flex-col items-center text-zinc-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
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
        </motion.div>

        <div className="text-zinc-50 text-xl my-28 relative">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            Start by loading an example snippet
          </motion.p>
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="hidden lg:block absolute left-2/3"
            src="/arrow-right.svg"
            alt=""
          />
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="block lg:hidden absolute left-2/3"
            src="/arrow-down.svg"
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default Page;
