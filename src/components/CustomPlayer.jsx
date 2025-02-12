import React from "react";
import { useTheme } from '../contexts/ThemeContext';
import styles from "./CustomPlayer.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faBackward, faShuffle } from '@fortawesome/free-solid-svg-icons';

const CustomPlayer = ({ currentSong, isPlaying, handlePlayPause, handleSkipForward, handleSkipBackward, isShuffle, setIsShuffle, currentTime }) => {
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
      <p>{formatedElapsedTime} / {formatedTotalLength}</p>
      <div className={styles.songInfo}>
        <p className={styles.playing}>Playing: <span className={styles.title}>{currentSong.title}</span></p>
        <p className={styles.playing}>Album: <span className={styles.title}>{currentSong.album}</span></p>
      </div>
      <div className={styles.buttonsContainer}>
        <div className={styles.buttonsRight}>
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
        </div>
        <button onClick={() => setIsShuffle((prev) => !prev)} className={`${styles.shuffleButton} ${isShuffle ? styles.active : ''}`}>
          <FontAwesomeIcon icon={faShuffle} />
        </button>
      </div>
    </div>
  )
};

export default CustomPlayer;
