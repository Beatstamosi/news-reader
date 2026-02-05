import { useEffect, useState } from "react";
import "./App.css";
import type { FeedItem } from "../api/rss";

function App() {
  const [news, setNews] = useState<FeedItem[]>();
  const [play, setPlay] = useState(false);

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

  // pause playback and play from same
  // refresh button to fetch news
  // display article name + link

  const handlePlayPause = () => {
    setPlay((p) => !p);
  };

  return (
    <>
      <h1>Höre dir den Heise News Feed an</h1>
      <div className="card">
        <button onClick={handlePlayPause}>{play ? "⏸ Pause" : "▶︎ Play"}</button>
      </div>
      <ul>
        {news?.map((n, index) => {
          return (
            <li key={index}>
              <a href={n.link}>{n.title}</a>;
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default App;
