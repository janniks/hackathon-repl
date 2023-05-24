"use client";

import { usePathname } from "next/navigation";
import debouce, { debounce } from "debounce";
import { base64url } from "@scure/base";
import WrappedEditor from "../../components/editor";
import { bytesToUtf8, utf8ToBytes } from "../../lib/helpers";
import { useHasMounted } from "../../lib/hooks";

const EditorPage = () => {
  const hasMounted = useHasMounted();
  const pathname = usePathname();

  if (!hasMounted) return null; // todo: fix this?

  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);

  const param = searchParams.get("code");

  const code = param
    ? bytesToUtf8(base64url.decode(param))
    : "// Write your code here";

  return (
    <div className="p-4">
      <h2 className="text-lg mb-3">My Snippet</h2>
      <div>
        <div>Description</div>
        <p>My snippy</p>
      </div>
      <WrappedEditor
        code={code}
        onChange={debounce((value) => {
          searchParams.set("code", base64url.encode(utf8ToBytes(value ?? "")));
          window.history.pushState(
            {},
            "",
            `${pathname}?${searchParams.toString()}`
          );
        }, 1500)}
      />
    </div>
  );
};

export default EditorPage;
