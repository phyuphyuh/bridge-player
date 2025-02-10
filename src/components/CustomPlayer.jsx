import React from "react";
import styles from "./CustomPlayer.module.scss";

const CustomPlayer = ({ currentSong, isPlaying, handlePlayPause, currentTime }) => {
  return (
    <div className={styles.customPlayer}>
      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${((currentTime - currentSong.start) / (currentSong.end - currentSong.start)) * 100}%` }}
        ></div>
      </div>
      <button onClick={handlePlayPause} className={styles.playPauseButton}>{isPlaying ? "Pause" : "Play"}</button>
      <p>Playing: {currentSong.title}</p>
    </div>
  )
};

export default CustomPlayer;
