"use client";

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
  const [description, setDescription] = useState<string>();
  const [videoSrc, setVideoSrc] = useState<string>();
  const [videoMap, setVideoMap] = useState<any>();

  const [shouldUpdate, setShouldUpdate] = useState(true);

  const [editor, setEditor] = useAtom(editorAtom);
  const [player, setplayer] = useAtom(playerAtom);

  const searchParams = useSearchParams();

  const codeParam = searchParams.get("code");
  const id = searchParams.get("id");

  console.log("id", id);
  console.log("codeParam", codeParam);

  const fetchAndSetMetadata = async (id: string) => {
    const result = await fetchSnippetMetadata(id);
    if (!result) return;
    const {
      description: snippetDescription,
      videoSrc: snippetVideoSrc,
      videoMap: snippetVideoMap,
    } = JSON.parse(result);
    if (snippetDescription) {
      setDescription(snippetDescription);
    }
    if (snippetVideoSrc && snippetVideoMap) {
      setVideoSrc(snippetVideoSrc);
      setVideoMap(snippetVideoMap);
    }
  };
  useEffect(() => {
    if (hasMounted && id) fetchAndSetMetadata(id);
    return () => {
      setDescription(undefined);
      setVideoSrc(undefined);
      setVideoMap(undefined);
    };
  }, [id, hasMounted]);

  const codeDecoded = codeParam ? bytesToUtf8(base64url.decode(codeParam)) : "";

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

  return (
    <div className="p-4" key={id}>
      <h2 className="text-lg mb-3">{id}</h2>
      <div className="flex flex-col justify-between">
        {description && (
          <div className="">
            <div>Description</div>
            <p>{description}</p>
          </div>
        )}
        {videoSrc && videoMap && (
          <VideoPlayer
            key={id}
            id={videoSrc}
            map={videoMap as any}
            shouldUpdate={shouldUpdate}
          />
        )}
      </div>

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

      <div className="flex justify-between my-3">
        {editor && <RunButton />}
        {editor && (
          <Button
            onClick={() => {
              const timestamp = player?.getCurrentTime();
              const code = getWantedCode(timestamp, videoMap);
              editor?.setValue(code);
              editor?.focus();
              editor?.render(true);
              setShouldUpdate(true);
            }}
            disabled={shouldUpdate}
            text="Reset"
          />
        )}
        <div className="flex justify-center text-gray-600 cursor-default">
          <div className="flex items-center justify-center pr-0.5 w-[31px] h-[25px] border shadow-[0_1px_1px_1px_rgba(0,0,0,0.15)]  rounded-lg border-gray-400 text-gray-500 bg-gray-200">
            ⌘
          </div>
          <div className="mx-0.5">+</div>
          <div className="flex items-center justify-center w-[31px] h-[25px] border shadow-[0_1px_1px_1px_rgba(0,0,0,0.15)]  rounded-lg border-gray-400 text-gray-500 bg-gray-200 text-[12px]">
            ⏎
          </div>
        </div>
      </div>
      <div id="console-container" />
    </div>
  );
};

export default EditorPage;
