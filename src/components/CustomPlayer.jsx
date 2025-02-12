import React from "react";
import { useTheme } from '../contexts/ThemeContext';
import styles from "./CustomPlayer.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faBackward } from '@fortawesome/free-solid-svg-icons';

const CustomPlayer = ({ currentSong, isPlaying, handlePlayPause, handleSkipForward, handleSkipBackward, currentTime }) => {
  const { theme } = useTheme();

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const totalLength = currentSong ? ((currentSong.preciseEnd ?? currentSong.end) - (currentSong.preciseStart ?? currentSong.start)) : 0;
  const formatedElapsedTime = formatTime(currentTime - (currentSong.preciseStart ?? currentSong.start));
  const formatedTotalLength = formatTime(totalLength);

  return (
    <div className={`${styles.customPlayer} ${styles[theme.className]}`}>
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
      <p>{formatedElapsedTime} / {formatedTotalLength}</p>
      <p>Playing: {currentSong.title}</p>
    </div>
  )
};

export default CustomPlayer;
