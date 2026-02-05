import axios from "axios";
import { parseStringPromise } from "xml2js";
import type { VercelResponse } from "@vercel/node";

const RSS_FEED_URL = "https://www.heise.de/rss/heise-Rubrik-IT-atom.xml";

export interface FeedItem {
  title: string;
  link: string;
  summary: string;
}

interface RSSEntry {
  title: string[];
  link: { $: { href: string } }[];
  summary?: { _: string }[];
  content?: { _: string }[];
}

export default async function handler(res: VercelResponse) {
  try {
    const response = await axios.get(RSS_FEED_URL);
    const result = await parseStringPromise(response.data);

    const entries = result?.feed?.entry || [];

    const getSummary = (entry: RSSEntry): string => {
      if (entry.summary && entry.summary[0]) {
        const s = entry.summary[0];
        if (typeof s === "string") return s;
        if (s._) return s._;
      }
      if (entry.content && entry.content[0]) {
        const c = entry.content[0];
        if (typeof c === "string") return c;
        if (c._) return c._;
      }
      return "";
    };

    const items: FeedItem[] = entries.map((entry: RSSEntry) => ({
      title: entry.title?.[0] || "",
      link: (entry.link && entry.link[0] && entry.link[0].$.href) || "",
      summary: getSummary(entry),
    }));

    res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching RSS feed:", err);
    res.status(500).json({ error: "Failed to fetch RSS feed" });
  }
}
