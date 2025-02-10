import React from "react";
import styles from "./SongList.module.scss";

const SongList = ({ songs, setCurrentSong }) => {
  return (
    <ul className={styles.songList}>
      {songs.map((song) => (
        <li key={song.id} className={styles.songItem}>
          <a onClick={() => setCurrentSong(song)} className={styles.songLink}>{song.title}</a>
        </li>
      ))}
    </ul>
  );
};

export default SongList;
