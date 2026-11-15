"use client";

import { useState } from "react";
import games from "../data/catalog.json";
import TrackCover from "./TrackCover";

export default function Home() {
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const game = games.find((g) => g.id === selectedId);

  function chooseGame(id) {
    setSelectedTrack(null);
    setSelectedId(id);
  }

  if (!game) {
    return (
      <main className="home">
        <div className="games">
          {games.map((g) => (
            <button
              key={g.id}
              type="button"
              className="game-button"
              onClick={() => chooseGame(g.id)}
            >
              <span>{g.label}</span>
            </button>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="catalog">
      <button
        type="button"
        className="game-button back-button"
        onClick={() => chooseGame(null)}
      >
        <span>← Voltar</span>
      </button>
      <h1 className="catalog-title">{game.title}</h1>
      {game.note && <p className="catalog-note">{game.note}</p>}
      <ol className="track-list">
        {game.tracks.map((t, index) => (
          <li key={`${t.artist}-${t.track}`} className="track">
            <button
              type="button"
              className="track-toggle"
              aria-expanded={selectedTrack === index}
              aria-controls={`track-services-${index}`}
              onClick={() => setSelectedTrack(selectedTrack === index ? null : index)}
            >
              <TrackCover
                artist={t.artist}
                track={t.track}
                gameId={game.id}
                gameTitle={game.title}
              />
              <span className="track-text">
                <span className="track-artist">{t.artist}</span>{" "}
                <span className="track-name">{t.track}</span>
                {t.pal && (
                  <span className="track-pal">
                    <strong>PAL</strong> — {t.pal}
                  </span>
                )}
              </span>
              <span className="track-action" aria-hidden="true">
                {selectedTrack === index ? "−" : "+"}
              </span>
            </button>
            <div
              id={`track-services-${index}`}
              className="track-services"
              hidden={selectedTrack !== index}
            >
              <p>Buscar esta faixa no serviço escolhido:</p>
              <div className="service-links">
                {[
                  ["YouTube Music", `https://music.youtube.com/search?q=${encodeURIComponent(`${t.artist} ${t.track}`)}`],
                  ["Spotify", `https://open.spotify.com/search/${encodeURIComponent(`${t.artist} ${t.track}`)}`],
                  ["Apple Music", `https://music.apple.com/br/search?term=${encodeURIComponent(`${t.artist} ${t.track}`)}`],
                  ["Deezer", `https://www.deezer.com/search/${encodeURIComponent(`${t.artist} ${t.track}`)}`],
                ].map(([name, url]) => (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer">
                    {name}
                  </a>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
