import React, { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import SongList from "./SongList";
import CustomPlayer from "./CustomPlayer";
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

    if (currentSong?.preciseStart !== undefined) {
      event.target.seekTo(currentSong.preciseStart, true);
      event.target.playVideo();
      setIsPlaying(true);
      startProgressTracking();
      const time = player.getCurrentTime();
      setCurrentTime(time);
    }
  };

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
      <h1>Bridge Player</h1>
      <SongList songs={songs} setCurrentSong={setCurrentSong} />
      {currentSong && (
        <YouTube videoId={currentSong.id} opts={opts} onReady={onReady} className="video" />
      )}
      {currentSong && (
        <CustomPlayer currentSong={currentSong} isPlaying={isPlaying} handlePlayPause={handlePlayPause} currentTime={currentTime} />
      )}
    </div>
  );
};

export default BridgePlayer;
