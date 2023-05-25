"use client";

import dynamic from "next/dynamic";

const WithEditorClientPage = dynamic(
  () => import("../../components/editor-client-page"),
  {
    loading: () => <p className="text-zinc-400">Loading...</p>,
    ssr: false,
  }
);

const Page = () => {
  return <WithEditorClientPage />;
};

export default Page;
