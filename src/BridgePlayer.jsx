import React, { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { songs } from "./data";
import "./BridgePlayer.css";

const BridgePlayer = () => {
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef(null);

  const opts = {
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      start: currentSong?.preciseStart ?? currentSong?.start,
      end: currentSong?.end,
    },
  };

  const onReady = (event) => {
    setPlayer(event.target);
    console.log('Player object:', event.target);

    if (currentSong?.preciseStart !== undefined) {
      event.target.seekTo(currentSong.preciseStart, true);
      event.target.playVideo();
      setIsPlaying(true);
      startProgressTracking();
      const time = player.getCurrentTime();
      setCurrentTime(time);
      // setCurrentTime(currentSong.preciseStart ?? currentSong.start);
    }
  };

  const startProgressTracking = () => {
    console.log("Progress tracking started");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      if (player && player.getCurrentTime) {
        const time = player.getCurrentTime();
        console.log("Current Time:", time);
        setCurrentTime(time);

        if (currentSong && time >= currentSong.end) {
          player.pauseVideo();
          setIsPlaying(false);
          clearInterval(intervalRef.current);
        }
      }
    }, 100);
  };

  const stopProgressTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
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
    console.log('Player object inside useEffect:', player);
    if (player && currentSong) {
      player.loadVideoById({
        videoId: currentSong.id,
        startSeconds: currentSong.preciseStart ?? currentSong.start,
      });
      player.playVideo();
      setIsPlaying(true);
      // setCurrentTime(currentSong.preciseStart ?? currentSong.start);
      startProgressTracking();
    }
  }, [currentSong]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      <h1>Bridge Player</h1>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            <button onClick={() => setCurrentSong(song)}>{song.title}</button>
          </li>
        ))}
      </ul>
      {currentSong && <YouTube videoId={currentSong.id} opts={opts} onReady={onReady} className="video" />}

      {currentSong && (
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
      )}
    </div>
  );
};

export default BridgePlayer;
