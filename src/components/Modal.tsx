import React from "react";

// Genre ID to title mapping
const GENRE_TITLES: { [key: number]: string } = {
  1: "Personal Growth",
  2: "Investigative Journalism",
  3: "History",
  4: "Comedy",
  5: "Entertainment",
  6: "Business",
  7: "Fiction",
  8: "News",
  9: "Kids and Family"
};

interface Podcast {
  id: number;
  title: string;
  description: string;
  image: string;
  genres: number[];
  seasons: number[];
  episodes?: { season: number; title: string; episodeNumber: number; audioUrl?: string }[];
}

interface ModalProps {
  podcast: Podcast;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ podcast, closeModal }) => {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={closeModal}>✖</button>
        <h2>{podcast.title}</h2>
        <img src={podcast.image} alt={podcast.title} />
        
        {/* Display genre names */}
        <p className="modal-genre">
          Genres: {podcast.genres.map((genreId) => GENRE_TITLES[genreId]).join(", ")}
        </p>
        <h2>{podcast.description}</h2>
        {/* Audio Player */}
        <div className="audio-player">
          <audio controls>
            <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </div>
  );
};

export default Modal;
