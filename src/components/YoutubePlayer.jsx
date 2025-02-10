import React from "react";
import YouTube from "react-youtube";
import styles from "./YoutubePlayer.module.scss";

const YoutubePlayer = ({ currentSong, setPlayer, setIsPlaying, startProgressTracking, setCurrentTime }) => {
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
    setPlayer(event.target);

    if (currentSong?.preciseStart !== undefined) {
      event.target.seekTo(currentSong.preciseStart, true);
      event.target.playVideo();
      setIsPlaying(true);
      startProgressTracking();
      const time = player.getCurrentTime();
      setCurrentTime(time);
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
