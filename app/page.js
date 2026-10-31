"use client";

import { useState } from "react";
import games from "../data/catalog.json";
import TrackCover from "./TrackCover";

export default function Home() {
  const [selectedId, setSelectedId] = useState(null);
  const game = games.find((g) => g.id === selectedId);

  if (!game) {
    return (
      <main className="home">
        <div className="games">
          {games.map((g) => (
            <button
              key={g.id}
              type="button"
              className="game-button"
              onClick={() => setSelectedId(g.id)}
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
        onClick={() => setSelectedId(null)}
      >
        <span>← Voltar</span>
      </button>
      <h1 className="catalog-title">{game.title}</h1>
      {game.note && <p className="catalog-note">{game.note}</p>}
      <ol className="track-list">
        {game.tracks.map((t) => (
          <li key={`${t.artist}-${t.track}`} className="track">
            <TrackCover artist={t.artist} track={t.track} />
            <span className="track-text">
              <span className="track-artist">{t.artist}</span>{" "}
              <span className="track-name">{t.track}</span>
            </span>
            {t.pal && (
              <span className="track-pal">
                <strong>PAL</strong> — {t.pal}
              </span>
            )}
          </li>
        ))}
      </ol>
    </main>
  );
}
