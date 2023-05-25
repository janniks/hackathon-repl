"use client";

import { usePathname } from "next/navigation";
import debouce, { debounce } from "debounce";
import { base64url } from "@scure/base";
import WrappedEditor from "../../components/editor";
import { bytesToUtf8, utf8ToBytes } from "../../lib/helpers";
import { useHasMounted } from "../../lib/hooks";
import { fetchSnippetMetadata } from "../utils";
import { useEffect, useState } from "react";
import VideoPlayer from "@/components/video-player";

const EditorPage = () => {
  const hasMounted = useHasMounted();
  const pathname = usePathname();
  const [description, setDescription] = useState<string>();
  const [videoSrc, setVideoSrc] = useState<string>();
  const [videoMap, setVideoMap] = useState<string>();
  const [videoCode, setVideoCode] = useState<string>();

  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);

  const codeParam = searchParams.get("code");
  const id = searchParams.get("id");

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
    if (!hasMounted || !id) {
      setDescription(undefined);
      setVideoSrc(undefined);
      setVideoMap(undefined);
    } else {
      fetchAndSetMetadata(id);
    }
  }, [id, hasMounted]);
  if (!hasMounted) return null; // todo: fix this?

  const checkVideoMap = (player: any, map: [number, string][]) => {
    if (player) {
      const playerTimestamp: number = player.getCurrentTime();
      for (const [mapTimestamp, mapCode] of map) {
        if (playerTimestamp <= mapTimestamp) {
          setVideoCode(mapCode);
          break;
        }
      }
    }
  };

  const code = videoCode
    ? videoCode
    : codeParam
    ? bytesToUtf8(base64url.decode(codeParam))
    : "// Write your code here";

  return (
    <div className="p-4">
      <h2 className="text-lg mb-3">My Snippet</h2>
      {description ? (
        <div>
          <div>Description</div>
          <p>{description}</p>
        </div>
      ) : (
        <></>
      )}
      {videoSrc && videoMap ? (
        <VideoPlayer
          id={videoSrc}
          map={videoMap as any}
          checkVideoMap={checkVideoMap}
        ></VideoPlayer>
      ) : (
        <></>
      )}
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
