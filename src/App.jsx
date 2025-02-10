import React, { useState, useEffect, useRef } from "react";
import YoutubePlayer from "./components/YoutubePlayer";
import SongList from "./components/SongList";
import CustomPlayer from "./components/CustomPlayer";
import { songs } from "./data";
import './App.css'

function App() {
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef(null);

  const startProgressTracking = () => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (player) {
        const time = player.getCurrentTime();
        setCurrentTime(time);

        if (currentSong && time >= currentSong.end) {
          player.pauseVideo();
          setIsPlaying(false);
          clearInterval(intervalRef.current);
        }
      }
    }, 100);
  };

  const stopProgressTracking = () => clearInterval(intervalRef.current);

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
        setIsPlaying(false);
        stopProgressTracking();
      } else {
        player.playVideo();
        setIsPlaying(true);
        startProgressTracking();
      }
    }
  };

  useEffect(() => {
    if (player && currentSong) {
      player.loadVideoById({
        videoId: currentSong.id,
        startSeconds: currentSong.preciseStart ?? currentSong.start,
      });
      player.playVideo();
      setIsPlaying(true);
      setCurrentTime(currentSong.preciseStart ?? currentSong.start);
      startProgressTracking();
    }
  }, [currentSong]);

  useEffect(() => clearInterval(intervalRef.current), []);

  return (
    <div>
      <SongList songs={songs} setCurrentSong={setCurrentSong} />
      {currentSong && (
        <CustomPlayer currentSong={currentSong} isPlaying={isPlaying} handlePlayPause={handlePlayPause} currentTime={currentTime} />
      )}
      <YoutubePlayer currentSong={currentSong} setPlayer={setPlayer} setIsPlaying={setIsPlaying} startProgressTracking={startProgressTracking} setCurrentTime={setCurrentTime} />
    </div>
  )
}

export default App;
