import Script from "next/script";
import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import * as monaco_editor from "monaco-editor";
import { editorAtom, playerAtom } from "../lib/atoms";
import { useAtom } from "jotai";

enum PlayerStates {
  ended = 0,
  playing = 1,
  paused = 2,
  buffering = 3,
  cued = 5,
  unstarted = -1,
}
const VideoPlayer = ({
  id,
  map,
  shouldUpdate,
}: {
  id: string;
  map: [number, string][];
  shouldUpdate: boolean;
}) => {
  const [editor, setEditor] = useAtom(editorAtom);
  const [player, setPlayer] = useAtom(playerAtom);

  const [shouldUpdateCode, setShouldUpdateCode] = useState<boolean>(false);

  async function playerStateChange({ data }: { data: PlayerStates }) {
    if (data === PlayerStates.playing) {
      setShouldUpdateCode(true);
    } else {
      setShouldUpdateCode(false);
    }
  }

  useEffect(() => {
    if (player) return;
    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      // @ts-ignore
      const player = new window.YT.Player("player", {
        videoId: id,
        events: {
          onStateChange: playerStateChange,
          onReady: (event: any) => {
            setPlayer(event.target);
          },
        },
      });
      setPlayer(player);
    };
  });

  useInterval(() => {
    if (!(shouldUpdate && player && editor && shouldUpdateCode)) return;

    const playerTimestamp: number = player.getCurrentTime();
    const wanted = getWantedCode(playerTimestamp, map);
    const current = editor?.getValue();
    if (wanted !== current) editor?.setValue(wanted);
  }, 300);

  return (
    <div className="flex-1 aspect-video mb-4" key={id}>
      <iframe
        id="player"
        className="w-full h-full"
        src={`http://www.youtube.com/embed/${id}?enablejsapi=1`}
      />
    </div>
  );
};
export default VideoPlayer;

export function getWantedCode(timestamp: number, map: [number, string][]) {
  for (const [mapTimestamp, mapCode] of map) {
    if (timestamp <= mapTimestamp) return mapCode;
  }
  return map?.[map.length - 1]?.[1] ?? "";
}
