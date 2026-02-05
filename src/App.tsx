import { useEffect, useState, useRef } from "react";
import "./App.css";
import type { FeedItem } from "../api/rss";
import getAudio from "./getAudio";

// loading indicator
// playback from current

function App() {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<FeedItem[]>([]);
  const [playing, setPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayNews, setDisplayNews] = useState<FeedItem[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch RSS data converted to audio
  useEffect(() => {
    const saveFeed = async () => {
      const feed = await fetch("/api/rss");
      const data = await feed.json();
      console.log(data);
      setNews(data);
    };
    saveFeed();
  }, []);

  useEffect(() => {
    if (!playing || !news || currentIndex >= news?.length) return;

    const playNext = async () => {
      setLoading(true);
      const text = `${news?.[currentIndex].title} - ${news?.[currentIndex].summary}`;
      const stream = await getAudio(text);
      const url = URL.createObjectURL(stream);
      const audio = new Audio(url);
      audioRef.current = audio;

      await new Promise<void>((resolve) => {
        audio.onended = () => resolve();
        audio.oncanplaythrough = () => setLoading(false);
        audio.play();
      });

      // render title + link
      setDisplayNews((p) => [...p, news[currentIndex]]);

      // on end of play increase index
      setCurrentIndex((i) => i + 1);
    };

    playNext();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [playing, currentIndex, news]);

  const handlePlayPause = () => {
    setPlaying((p) => !p);
    if (playing && audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <>
      <h1>Höre dir den Heise News Feed an</h1>
      <div className="playBtnContainer">
        <button onClick={handlePlayPause} disabled={loading}>
          {loading ? "Loading..." : playing ? "⏸ Pause" : "▶︎ Play"}
        </button>
      </div>
      <div>
        <ul>
          {displayNews?.map((n, index) => {
            return (
              <li key={index}>
                <a href={n.link} target="_blank">
                  {n.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default App;
