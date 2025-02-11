import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import YoutubePlayer from "./components/YoutubePlayer";
import SongList from "./components/SongList";
import CustomPlayer from "./components/CustomPlayer";
import { useTheme } from "./contexts/ThemeContext";
import { songs } from "./data";
import './App.scss'

function App() {
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [lyrics, setLyrics] = useState(null);
  const [currentLyric, setCurrentLyric] = useState("");
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
          // setIsPlaying(false);
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

  useEffect(() => {
    const fetchLyrics = async () => {
      if (currentSong) {
        try {
          // const url = `https://lrclib.net/api/get?artist_name=${currentSong.artist}&track_name=${currentSong.title}`;
          const artistName = encodeURIComponent(currentSong.artist);
          const trackName = encodeURIComponent(currentSong.title);
          const url = `https://lrclib.net/api/get?artist_name=${artistName}&track_name=${trackName}`;
          console.log(url);
          const response = await axios.get(url);

          if (response.data.syncedLyrics) {
            console.log(response.data.syncedLyrics);
            setLyrics(response.data.syncedLyrics);
          } else {
            const searchUrl = `https://lrclib.net/api/search?artist_name=${artistName}&track_name=${trackName}`;
            console.log(searchUrl);
            const searchResponse = await axios.get(searchUrl);

            searchResponse.data.forEach((result) => {
              if (result.syncedLyrics) {
                setLyrics(result.syncedLyrics);
                return;
              }
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchLyrics();
  }, [currentSong]);

  useEffect(() => {
    let lyricToDisplay = "";
    if (lyrics) {
      const startTime = currentSong.preciseStart ?? currentSong.start;
      const endTime = currentSong.preciseEnd ?? currentSong.end;
      const lines = lyrics.split("\n");
      const desiredLines = lines.filter(line => {
        const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);
        if (match) {
          const minutes = parseInt(match[1], 10);
          const seconds = parseFloat(match[2]);
          const time = minutes * 60 + seconds;
          return time >= startTime && time <= endTime;
        }
        return false;
      });
      lyricToDisplay = desiredLines.join("\n");

      setCurrentLyric(lyricToDisplay);
    }
  }, [lyrics, currentTime]);

  return (
    <div className={`app ${theme.className}`}>
      <div className="app-container">
        <h1 className="description">hardest hitting Taylor Swift bridges</h1>
        <SongList songs={songs} setCurrentSong={setCurrentSong} />
        <div className="lyrics-container">
        {currentLyric && (
          <p>{currentLyric}</p>
        )}
        </div>
        {currentSong && (
          <CustomPlayer currentSong={currentSong} isPlaying={isPlaying} handlePlayPause={handlePlayPause} currentTime={currentTime} />
        )}
        <YoutubePlayer currentSong={currentSong} setPlayer={setPlayer} setIsPlaying={setIsPlaying} startProgressTracking={startProgressTracking} setCurrentTime={setCurrentTime} />
      </div>
    </div>
  )
}

export default App;
