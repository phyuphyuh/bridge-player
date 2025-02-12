import React, { useState, useEffect, useRef } from "react";
import YoutubePlayer from "./components/YoutubePlayer";
import SongList from "./components/SongList";
import CustomPlayer from "./components/CustomPlayer";
import Lyrics from "./components/Lyrics";
import { useTheme } from "./contexts/ThemeContext";
import { songs } from "./data";
import './App.scss'

function App() {
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef(null);

  const { theme, changeTheme } = useTheme();

  useEffect(() => {
    if (currentSong) {
      changeTheme(currentSong.album);
    }
  }, [currentSong, changeTheme]);

  const startProgressTracking = () => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (player) {
        const time = player.getCurrentTime();
        setCurrentTime(time);

        if (currentSong && time >= (currentSong.preciseEnd ?? currentSong.end)) {
          player.pauseVideo();
          clearInterval(intervalRef.current);
          handleNextSong();
        }
      }
    }, 100);
  };

  const stopProgressTracking = () => clearInterval(intervalRef.current);

  const handleNextSong = () => {
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (currentIndex < songs.length - 1) {
      setCurrentSong(songs[currentIndex + 1]);
    } else {
      setIsPlaying(false);
    }
  };

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

  const handleSkipForward = () => {
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (currentIndex < songs.length - 1) {
      setCurrentSong(songs[currentIndex + 1]);
    }
  };

  const handleSkipBackward = () => {
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (currentIndex > 0) {
      setCurrentSong(songs[currentIndex - 1]);
    }
  };

  useEffect(() => {
    if (player && currentSong) {
      player.loadVideoById({
        videoId: currentSong.id,
        startSeconds: currentSong.preciseStart ?? currentSong.start,
      });
      setIsPlaying(true);
      setCurrentTime(currentSong.preciseStart ?? currentSong.start);
      startProgressTracking();
    }
  }, [currentSong]);

  useEffect(() => clearInterval(intervalRef.current), []);

  return (
    <div className={`app ${theme.className}`}>
      <div className="app-container">
        <h1 className="description">hardest hitting Taylor Swift bridges</h1>
        <SongList songs={songs} setCurrentSong={setCurrentSong} />
        <Lyrics currentSong={currentSong} />
        {currentSong && (
          <CustomPlayer currentSong={currentSong} isPlaying={isPlaying} handlePlayPause={handlePlayPause} handleSkipForward={handleSkipForward} handleSkipBackward={handleSkipBackward} currentTime={currentTime} />
        )}
        <YoutubePlayer currentSong={currentSong} setPlayer={setPlayer} setIsPlaying={setIsPlaying} startProgressTracking={startProgressTracking} setCurrentTime={setCurrentTime} />
      </div>
    </div>
  )
}

export default App;
