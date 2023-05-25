"use client";

import { base64url } from "@scure/base";
import { debounce } from "debounce";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useUpdate } from "react-use";

import WrappedEditor from "../../components/editor";
import { bytesToUtf8, utf8ToBytes } from "../../lib/helpers";
import { useHasMounted } from "../../lib/hooks";

const EditorPage = () => {
  const hasMounted = useHasMounted();
  const pathname = usePathname();
  const update = useUpdate();

  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);

  const c = searchParams.get("c");
  const code = paramToCode(c);

  // rerender if intendend code changes (e.g. URL changes)
  useEffect(update, [update, code]);

  if (!hasMounted) return null; // todo: fix this?

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
          searchParams.set("c", base64url.encode(utf8ToBytes(value ?? "")));
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

function paramToCode(param: string | null) {
  try {
    return param
      ? bytesToUtf8(base64url.decode(param))
      : "// Write your code here";
  } catch (_) {
    return "// Write your code here";
  }
}
