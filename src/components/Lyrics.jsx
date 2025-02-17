import React, { useState, useEffect } from "react";
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import styles from "./Lyrics.module.scss";

const Lyrics = ({ currentSong, currentTime }) => {
  const [lyrics, setLyrics] = useState(null);
  const [currentLyric, setCurrentLyric] = useState("");
  const [lyricToDisplay, setLyricToDisplay] = useState("");

  const { theme } = useTheme();

  useEffect(() => {
    const fetchLyrics = async () => {
      if (currentSong) {
        if (currentSong.lyrics) {
          setLyrics(currentSong.lyrics);
        } else {
          try {
            // const url = `https://lrclib.net/api/get?artist_name=${currentSong.artist}&track_name=${currentSong.title}`;
            const artistName = encodeURIComponent(currentSong.artist);
            const trackName = encodeURIComponent(currentSong.title);
            const url = `https://lrclib.net/api/get?artist_name=${artistName}&track_name=${trackName}`;
            console.log(url);
            const response = await axios.get(url);

            if (response.data.syncedLyrics) {
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
      }
    };
    fetchLyrics();
  }, [currentSong]);

  useEffect(() => {
    let lyricToDisplay = "";
    if (lyrics) {
      const startTime = currentSong.preciseStart ?? currentSong.start;
      const endTime = currentSong.preciseEnd ?? currentSong.end;

      const hasTimestamps = /\[\d{2}:\d{2}\.\d{2}\]/.test(lyrics);
      if (hasTimestamps) {
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

        lyricToDisplay = desiredLines.map(line => line.replace(/\[\d{2}:\d{2}\.\d{2}\]/, "")).join("\n");
      } else {
        lyricToDisplay = lyrics;
      }

      setLyricToDisplay(lyricToDisplay);
    }
  }, [lyrics, currentSong]);

  useEffect(() => {
    if (lyrics) {
      const lines = lyrics.split("\n");

      lines.forEach((line) => {
        const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);
        if (match) {
          const minutes = parseInt(match[1], 10);
          const seconds = parseFloat(match[2]);
          const time = minutes * 60 + seconds;

          if (time <= currentTime && time > (currentTime - 1)) {
            setCurrentLyric(match[3]);
          }
        }
      });
    }
  }, [lyrics, currentTime]);

  const highlightedLyrics = () => {
    if (lyricToDisplay && currentLyric) {
      const lines = lyricToDisplay.split("\n");
      return (
        <pre>
          {lines.map((line, index) => {
            if (line === currentLyric) {
              return (
                <React.Fragment key={index}>
                  <span className={styles.highlightedLyric}>
                    {line}
                  </span>
                  <br />
                </React.Fragment>
              );
            } else {
              return (
                <React.Fragment key={index}>
                  <span>
                    {line}
                  </span>
                  <br />
                </React.Fragment>
              );
            }
          })}
        </pre>
      );
    } else {
      return <pre>{lyricToDisplay}</pre>;
    }
  };

  return (
    <div className={`${styles.lyricsContainer} ${styles[theme.className]}`}>
      <div className={styles.lyrics}>
        {highlightedLyrics()}
      </div>
    </div>
  );
};

export default Lyrics;
