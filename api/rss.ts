import axios from "axios";
import { parseStringPromise } from "xml2js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

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

type XmlField = Array<
  string | { _: string; $?: Record<string, string> } | undefined
>;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await axios.get(RSS_FEED_URL);
    const result = await parseStringPromise(response.data);

    const entries: RSSEntry[] = result?.feed?.entry || [];

    //filter out advertisements
    const filteredEntries = entries.filter(
      (entry) => !entry.title.some((t) => t.includes("heise-Angebot")),
    );

    const getText = (field?: XmlField): string => {
      if (!field || !field[0]) return "";

      const f = field[0];

      if (typeof f === "string") return f;
      if (f && typeof f._ === "string") return f._;

      return "";
    };

    const items: FeedItem[] = filteredEntries.map((entry: RSSEntry) => ({
      title: getText(entry.title),
      link: entry.link?.[0]?.$?.href || "",
      summary: getText(entry.summary) || getText(entry.content),
    }));

    res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching RSS feed:", err);
    res.status(500).json({ error: "Failed to fetch RSS feed" });
  }
}
