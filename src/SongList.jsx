import React from "react";

const SongList = ({ songs, setCurrentSong }) => {
  return (
    <ul>
      {songs.map((song) => (
        <li key={song.id}>
          <button onClick={() => setCurrentSong(song)}>{song.title}</button>
        </li>
      ))}
    </ul>
  );
};

export default SongList;
