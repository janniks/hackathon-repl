"use client";

import { base64url } from "@scure/base";
import WrappedEditor from "../../components/editor";
import { bytesToUtf8 } from "../../lib/helpers";
import { useHasMounted } from "../../lib/hooks";

const EditorPage = () => {
  const hasMounted = useHasMounted();

  if (!hasMounted) return null; // todo: fix this?

  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);

  const param = searchParams.get("code");

  const code = param
    ? bytesToUtf8(base64url.decode(param))
    : "// Write your code here";

  return (
    <div>
      <h2 className="text-lg mb-3">My Snippet</h2>
      <div>
        <div>Description</div>
        <p>My snippy</p>
      </div>
      <WrappedEditor code={code} />
    </div>
  );
};

export default EditorPage;
