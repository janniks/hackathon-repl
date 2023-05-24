import WrappedEditor from "../components/editor";

const Page = () => {
  return (
    <div>
      <main className="flex flex-col items-center bg-slate-400 m-5 p-5">
        main
        <div className="flex flex-col">
          {["a", "b", "c"].map((item, i) => (
            <div key={i} className="border rounded">
              {item}
            </div>
          ))}
        </div>
      </main>
      <WrappedEditor defaultCode={`// my comment`} />
    </div>
  );
};

export default Page;
