import Script from "next/script";
import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";

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
  checkVideoMap,
}: {
  id: string;
  map: [number, string][];
  checkVideoMap: any;
}) => {
  const [player, setPlayer] = useState<any>();
  const [shouldUpdateCode, setShouldUpdateCode] = useState<boolean>(false);
  const [code, setCode] = useState<string>();
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
    if (shouldUpdateCode) {
      checkVideoMap(player, map);
    }
  }, 20);

  return (
    <div>
      <iframe
        id="player"
        width="640"
        height="390"
        src={`http://www.youtube.com/embed/${id}?enablejsapi=1`}
      ></iframe>
    </div>
  );
};
export default VideoPlayer;
