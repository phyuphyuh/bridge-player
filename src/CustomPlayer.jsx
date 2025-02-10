import React from "react";

const CustomPlayer = ({ currentSong, isPlaying, handlePlayPause, currentTime }) => {
  return (
    <div className="custom-player">
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${((currentTime - currentSong.start) / (currentSong.end - currentSong.start)) * 100}%` }}
        ></div>
      </div>
      <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
      <p>Playing: {currentSong.title}</p>
    </div>
  )
};

export default CustomPlayer;
