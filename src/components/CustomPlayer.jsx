import React from "react";
import styles from "./CustomPlayer.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faBackward } from '@fortawesome/free-solid-svg-icons';

const CustomPlayer = ({ currentSong, isPlaying, handlePlayPause, handleSkipForward, handleSkipBackward, currentTime }) => {
  return (
    <div className={styles.customPlayer}>
      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${((currentTime - currentSong.start) / (currentSong.end - currentSong.start)) * 100}%` }}
        ></div>
      </div>
      <button onClick={handleSkipBackward} className={styles.skipButton}>
        <FontAwesomeIcon icon={faBackward} />
      </button>
      <button onClick={handlePlayPause} className={styles.playPauseButton}>
        {isPlaying ? (
          <FontAwesomeIcon icon={faPause} />
        ) : (
          <FontAwesomeIcon icon={faPlay} />
        )}
      </button>
      <button onClick={handleSkipForward} className={styles.skipButton}>
        <FontAwesomeIcon icon={faForward} />
      </button>
      <p>Playing: {currentSong.title}</p>
    </div>
  )
};

export default CustomPlayer;
