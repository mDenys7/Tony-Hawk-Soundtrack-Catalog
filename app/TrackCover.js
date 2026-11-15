"use client";

import { useEffect, useRef, useState } from "react";

const memory = new Map();

const normalize = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, " ").trim();

async function fetchCover(artist, track) {
  const key = `cover:${artist}|${track}`;
  if (memory.has(key)) return memory.get(key);

  try {
    const cached = localStorage.getItem(key);
    if (cached !== null) {
      memory.set(key, cached || null);
      return cached || null;
    }
  } catch {}

  const mainArtist = artist.split(/\s+(?:feat\.|&)\s+/i)[0];
  const term = encodeURIComponent(`${mainArtist} ${track}`);
  let url = null;
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${term}&entity=song&limit=5`
    );
    if (res.ok) {
      const { results } = await res.json();
      const word = normalize(track).split(" ").find((w) => w.length >= 3);
      const hit = results.find(
        (r) =>
          normalize(r.artistName).includes(normalize(mainArtist).split(" ")[0]) &&
          (!word || normalize(r.trackName).includes(word))
      );
      if (hit?.artworkUrl100) {
        url = hit.artworkUrl100.replace("100x100", "200x200");
      }
    } else {
      return null;
    }
  } catch {
    return null;
  }

  memory.set(key, url);
  try {
    localStorage.setItem(key, url || "");
  } catch {}
  return url;
}

const gameFallbacks = {
  thps1: "/images/game-fallbacks/thps1.svg",
  thps2: "/images/game-fallbacks/thps2.svg",
  thps3: "/images/game-fallbacks/thps3.svg",
  thps4: "/images/game-fallbacks/thps4.svg",
};

export default function TrackCover({ artist, track, gameId, gameTitle }) {
  const ref = useRef(null);
  const [src, setSrc] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        fetchCover(artist, track).then((u) => {
          if (!cancelled) setSrc(u);
        });
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [artist, track]);

  const fallbackSrc = gameFallbacks[gameId];

  return (
    <span ref={ref} className="track-cover">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src || fallbackSrc}
        alt={
          src
            ? `Capa de ${track}, de ${artist}`
            : `Arte gráfica de apoio para ${gameTitle}`
        }
        loading="lazy"
        onError={src ? () => setSrc(null) : undefined}
      />
    </span>
  );
}
