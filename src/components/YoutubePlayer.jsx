import React, { useEffect } from "react";
import YouTube from "react-youtube";
import styles from "./YoutubePlayer.module.scss";

const YoutubePlayer = ({ currentSong, playerRef, setIsPlaying, startProgressTracking, setCurrentTime }) => {
  const opts = {
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      start: currentSong?.preciseStart ?? currentSong?.start,
      end: currentSong?.preciseEnd ?? currentSong?.end,
    },
  };

  const onReady = (event) => {
    // setPlayer(event.target);
    playerRef.current = event.target;
    console.log("onReady", playerRef.current);

    if (currentSong?.preciseStart !== undefined) {
      event.target.seekTo(currentSong.preciseStart, true);
      event.target.playVideo();
      setIsPlaying(true);
      startProgressTracking();
      const time = playerRef.current.getCurrentTime();
      setCurrentTime(time);
      // setCurrentTime(currentSong.preciseStart ?? currentSong.start);
    }
  };

  return (
    <div>
      {currentSong && (
        <YouTube videoId={currentSong.id} opts={opts} onReady={onReady} className={styles.video} />
      )}
    </div>
  );
};

export default YoutubePlayer;
