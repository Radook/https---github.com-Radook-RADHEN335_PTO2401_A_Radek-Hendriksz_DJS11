import React, { useState, useEffect } from "react";
import "./ShowList.css";
import Modal from './Modal';

interface Podcast {
  id: number;
  title: string;
  description: string;
  image: string;
  genres: number[];
  updated: string;
  seasons: number[];
  episodes?: { season: number; title: string; episodeNumber: number; audioUrl?: string }[];
}

const ShowList: React.FC = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"A-Z" | "Z-A" | "Newest" | "Oldest">("A-Z");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const podcastsPerPage = 6;

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await fetch(`https://podcast-api.netlify.app/?page=${currentPage}&limit=${podcastsPerPage}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setPodcasts(data);
          setTotalPages(Math.ceil(data.length / podcastsPerPage));
        } else {
          console.error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      }
    };

    fetchPodcasts();
  }, [currentPage]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(savedFavorites);
  }, []);

  const filteredPodcasts = podcasts
    .filter((podcast) =>
      podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedGenre === null || podcast.genres.includes(selectedGenre))
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "A-Z":
          return a.title.localeCompare(b.title);
        case "Z-A":
          return b.title.localeCompare(a.title);
        case "Newest":
          return new Date(b.updated).getTime() - new Date(a.updated).getTime();
        case "Oldest":
          return new Date(a.updated).getTime() - new Date(b.updated).getTime();
        default:
          return 0;
      }
    });

  const handlePodcastClick = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
  };

  const closeModal = () => {
    setSelectedPodcast(null);
  };

  const toggleFavorite = (podcastId: number) => {
    const updatedFavorites = favorites.includes(podcastId)
      ? favorites.filter((id) => id !== podcastId)
      : [...favorites, podcastId];

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  return (
    <div className="show-list">
      <input
        type="text"
        placeholder="Search podcasts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {/* Sort Options */}
      <div className="sort-options">
        <label>Sort by:</label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value as typeof sortOption)}>
          <option value="A-Z">Title: A-Z</option>
          <option value="Z-A">Title: Z-A</option>
          <option value="Newest">Most Recently Updated</option>
          <option value="Oldest">Oldest Updated</option>
        </select>
      </div>

      {/* Genre Filter */}
      <div className="genre-filter">
        <label>Filter by Genre:</label>
        <select value={selectedGenre || ""} onChange={(e) => setSelectedGenre(Number(e.target.value) || null)}>
          <option value="">All Genres</option>
          <option value={1}>Personal Growth</option>
          <option value={2}>Investigative Journalism</option>
          <option value={3}>History</option>
          <option value={4}>Comedy</option>
          <option value={5}>Entertainment</option>
          <option value={6}>Business</option>
          <option value={7}>Fiction</option>
          <option value={8}>News</option>
          <option value={9}>Kids and Family</option>
        </select>
      </div>

      <div className="show-items">
        {filteredPodcasts.length > 0 ? (
          filteredPodcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="show-item"
              onClick={() => handlePodcastClick(podcast)}
            >
              <img src={podcast.image} alt={podcast.title} />
              <h3>{podcast.title}</h3>
              <p>{podcast.description.slice(0, 100)}...</p>
              <p><strong>Seasons:</strong> {podcast.seasons.length}</p> {/* Displaying the season count */}
              <button onClick={(e) => { e.stopPropagation(); toggleFavorite(podcast.id); }}>
                {favorites.includes(podcast.id) ? "Remove from Favorites" : "Add to Favorites"}
              </button>
            </div>
          ))
        ) : (
          <p>No podcasts available.</p>
        )}
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {/* Conditionally render the Modal */}
      {selectedPodcast && <Modal podcast={selectedPodcast} closeModal={closeModal} />}
    </div>
  );
};

export default ShowList;
