"use client";
import {
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
} from "@chakra-ui/react";
import VideoPlayer, { getWantedCode } from "@/components/video-player";
import { base64url } from "@scure/base";
import { debounce } from "debounce";
import { useAtom } from "jotai";
import * as monaco_editor from "monaco-editor";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Button from "../../components/button";
import WrappedEditor from "../../components/editor";
import RunButton from "../../components/run-button";
import { editorAtom, playerAtom } from "../../lib/atoms";
import { bytesToUtf8, utf8ToBytes } from "../../lib/helpers";
import { useHasMounted } from "../../lib/hooks";
import { fetchSnippetMetadata } from "../utils";

const EditorPage = () => {
  const hasMounted = useHasMounted();
  const pathname = usePathname();

  const [videoSrc, setVideoSrc] = useState<string>();
  const [videoMap, setVideoMap] = useState<any>();

  const [shouldUpdate, setShouldUpdate] = useState(true);

  const [editor, setEditor] = useAtom(editorAtom);
  const [player, setplayer] = useAtom(playerAtom);

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

  const updateSearchParamsDebounced = debounce(
    (
      value: string | undefined,
      ev: monaco_editor.editor.IModelContentChangedEvent
    ) => {
      const s = new URLSearchParams(Array.from(searchParams.entries()));
      s.set("code", base64url.encode(utf8ToBytes(value ?? "")));
      window.history.pushState({}, "", `${pathname}?${s.toString()}`);
    },
    1500
  );

  const updateTitleDebounced = debounce((value: string | undefined) => {
    const s = new URLSearchParams(Array.from(searchParams.entries()));
    s.set("t", base64url.encode(utf8ToBytes(value ?? "")));
    window.history.pushState({}, "", `${pathname}?${s.toString()}`);
  }, 500);

  const updateDescriptionDebounced = debounce((value: string | undefined) => {
    const s = new URLSearchParams(Array.from(searchParams.entries()));
    s.set("d", base64url.encode(utf8ToBytes(value ?? "")));
    window.history.pushState({}, "", `${pathname}?${s.toString()}`);
  }, 500);

  const consoleStyles = {
    minHeight: "100px",
    background: "#232328",
    borderTop: "solid 1px #18181c",
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
        className="text-lg bg-transparent w-full"
        placeholder="Title"
        defaultValue={titleDecoded}
        onChange={(e) => updateTitleDebounced(e.target.value)}
      />
      <div className="text-zinc-200 flex flex-col justify-between">
        <textarea
          className="bg-transparent"
          placeholder="Description"
          defaultValue={descriptionDecoded}
          onChange={(e) => updateDescriptionDebounced(e.target.value)}
        />
        {videoSrc && videoMap && (
          <VideoPlayer
            key={id}
            id={videoSrc}
            map={videoMap as any}
            shouldUpdate={shouldUpdate}
          />
        )}
      </div>

      {/* EDITOR + CONSOLE */}
      <div>
        <WrappedEditor
          code={codeDecoded}
          onChange={(value, event) => {
            if (shouldUpdate) {
              const timestamp = player?.getCurrentTime();
              const wanted = getWantedCode(timestamp, videoMap);
              if (value !== wanted) setShouldUpdate(false);
            }
            updateSearchParamsDebounced(value, event);
          }}
        />
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

export default EditorPage;
