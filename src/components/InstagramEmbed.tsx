"use client";

import { useEffect, useRef } from "react";
import styles from "./InstagramEmbed.module.css";

interface Props {
  permalink?: string;
  rawHtml?: string;
}

type InstagramWindow = Window & {
  instgrm?: {
    Embeds?: {
      process: () => void;
    };
  };
};

export default function InstagramEmbed({ permalink, rawHtml }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const instagramWindow = window as InstagramWindow;

    const loadScript = () => {
      if (instagramWindow.instgrm?.Embeds) {
        try {
          instagramWindow.instgrm.Embeds.process();
        } catch {}
        return;
      }

      if (document.querySelector('script[src="https://www.instagram.com/embed.js"]')) {
        // script present but not initialized yet
        try {
          instagramWindow.instgrm?.Embeds?.process();
        } catch {}
        return;
      }

      const s = document.createElement("script");
      s.async = true;
      s.defer = true;
      s.src = "https://www.instagram.com/embed.js";
      s.onload = () => {
        try {
          instagramWindow.instgrm?.Embeds?.process();
        } catch {}
      };
      document.body.appendChild(s);
    };

    loadScript();
  }, [permalink, rawHtml]);

  return (
    <div ref={rootRef} className={styles.wrapper}>
      {rawHtml ? (
        <div
          className={styles.embed}
          dangerouslySetInnerHTML={{ __html: rawHtml }}
          style={{ width: "100%", maxWidth: 1000 }}
        />
      ) : (
        <div className={styles.embed}>
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={permalink}
            data-instgrm-version="14"
            style={{ background: "#FFF", border: 0 }}
          >
            <div style={{ padding: 16, textAlign: "center" }}>
              <a href={permalink} target="_blank" rel="noopener noreferrer">
                View post on Instagram
              </a>
            </div>
          </blockquote>
        </div>
      )}
    </div>
  );
}
