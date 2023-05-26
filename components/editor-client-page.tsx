"use client";

import VideoPlayer, { getWantedCode } from "@/components/video-player";
import { base64url } from "@scure/base";
import { debounce } from "debounce";
import { useAtom } from "jotai";
import { usePathname, useSearchParams } from "next/navigation";
import { CSSProperties, useEffect, useRef, useState } from "react";

import Button from "./button";
import WrappedEditor from "./editor";
import RunButton from "./run-button";
import { editorAtom, playerAtom } from "../lib/atoms";
import { bytesToUtf8, utf8ToBytes } from "../lib/helpers";
import { useHasMounted } from "../lib/hooks";
import { fetchSnippetMetadata } from "../lib/utils";

const EditorClientPage = () => {
  const hasMounted = useHasMounted();
  const pathname = usePathname();

  const [videoSrc, setVideoSrc] = useState<string>();
  const [videoMap, setVideoMap] = useState<any>();

  const [shouldUpdate, setShouldUpdate] = useState(true);

  const [editor, setEditor] = useAtom(editorAtom);
  const [player, setplayer] = useAtom(playerAtom);

  const titleRef = useRef<string | null>("");
  const descriptionRef = useRef<string | null>("");

  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const code = searchParams.get("code");
  const title = searchParams.get("t");
  const description = searchParams.get("d");

  const codeDecoded = code ? bytesToUtf8(base64url.decode(code)) : "";
  const titleDecoded = title ? bytesToUtf8(base64url.decode(title)) : "";
  const descriptionDecoded = description
    ? bytesToUtf8(base64url.decode(description))
    : "";

  useEffect(() => {
    titleRef.current = title;
    descriptionRef.current = description;
  }, [title, description]);

  const fetchAndSetMetadata = async (id: string) => {
    const result = await fetchSnippetMetadata(id);
    if (!result) return;
    const { videoSrc: snippetVideoSrc, videoMap: snippetVideoMap } =
      JSON.parse(result);
    if (snippetVideoSrc && snippetVideoMap) {
      setVideoSrc(snippetVideoSrc);
      setVideoMap(snippetVideoMap);
    }
  };
  useEffect(() => {
    if (hasMounted && id) fetchAndSetMetadata(id);
    return () => {
      setVideoSrc(undefined);
      setVideoMap(undefined);
    };
  }, [id, hasMounted]);

  const updateSearchParamsDebounced = debounce(() => {
    const params = new URLSearchParams([
      ["id", id ?? ""],
      ["code", base64url.encode(utf8ToBytes(editor?.getValue() ?? ""))],
      ["t", titleRef.current ?? ""],
      ["d", descriptionRef.current ?? ""],
    ]);
    window.history.pushState({}, "", `${pathname}?${params.toString()}`);
  }, 500);

  const updateTitleDebounced = debounce((value: string | undefined) => {
    titleRef.current = base64url.encode(utf8ToBytes(value ?? ""));
    updateSearchParamsDebounced();
  }, 500);

  const updateDescriptionDebounced = debounce((value: string | undefined) => {
    descriptionRef.current = base64url.encode(utf8ToBytes(value ?? ""));
    updateSearchParamsDebounced();
  }, 500);

  const consoleStyles: CSSProperties = {
    minHeight: "100px",
    background: "#232328",
    borderTop: "solid 3px #18181c",
    borderBottomLeftRadius: "4px",
    borderBottomRightRadius: "4px",
    padding: "1em",
    color: "#d6d3d2",
    overflow: "scroll",
    fontSize: "12px",
    maxHeight: "300px",
  };

  return (
    <div
      className="text-white border border-zinc-500 p-4 space-y-4 bg-zinc-700 shadow-[0_2px_2px_0_rgba(0,0,0,0.9)] rounded-lg"
      key={id}
    >
      <input
        className="text-lg bg-transparent w-full font-['Aeonik_Fono']"
        placeholder="Title"
        defaultValue={titleDecoded}
        onChange={(e) => updateTitleDebounced(e.target.value)}
      />
      <div
        contentEditable={true}
        suppressContentEditableWarning={true}
        role="textbox"
        className="fake-placeholder-description w-full text-zinc-200 bg-transparent whitespace-break-spaces"
        placeholder="Description"
        onInput={(e) => updateDescriptionDebounced(e.currentTarget.innerText)}
      >
        {descriptionDecoded}
      </div>

      {/* YOUTUBE */}
      {videoSrc && videoMap && (
        <VideoPlayer
          key={id}
          id={videoSrc}
          map={videoMap as any}
          shouldUpdate={shouldUpdate}
        />
      )}

      {/* EDITOR + CONSOLE */}
      <div>
        <div className="rounded-t-lg pt-2 bg-[#232329]">
          <WrappedEditor
            code={codeDecoded}
            onChange={(value, event) => {
              if (shouldUpdate) {
                const timestamp = player?.getCurrentTime();
                const wanted = getWantedCode(timestamp, videoMap);
                if (value !== wanted) setShouldUpdate(false);
              }
              updateSearchParamsDebounced();
            }}
          />
        </div>
        <div id="console-container" style={consoleStyles} />
      </div>

      {/* BUTTONS */}
      <div className="flex justify-between my-3">
        <div>
          {editor && <RunButton />}
          {editor && (
            <Button
              onClick={() => {
                const code = getWantedCode(player?.getCurrentTime(), videoMap);
                editor?.setValue(code);
                setShouldUpdate(true);
              }}
              disabled={shouldUpdate}
              text="Reset"
            />
          )}
        </div>
        <div className="flex justify-center text-zinc-600 cursor-default">
          <div className="flex items-center justify-center pr-0.5 w-[31px] h-[25px] border shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] rounded-lg border-zinc-700 text-zinc-600 bg-zinc-300">
            ⌘
          </div>
          <div className="mx-0.5 text-zinc-300">+</div>
          <div className="flex items-center justify-center w-[31px] h-[25px] border shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] rounded-lg border-zinc-700 text-zinc-600 bg-zinc-300 text-[12px]">
            ⏎
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorClientPage;
