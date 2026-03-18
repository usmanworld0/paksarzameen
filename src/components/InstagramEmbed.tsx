"use client";

import { useEffect, useRef } from "react";

interface Props {
  permalink?: string;
  rawHtml?: string;
}

export default function InstagramEmbed({ permalink, rawHtml }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadScript = () => {
      if ((window as any).instgrm && (window as any).instgrm.Embeds) {
        try {
          (window as any).instgrm.Embeds.process();
        } catch (e) {}
        return;
      }

      if (document.querySelector('script[src="https://www.instagram.com/embed.js"]')) {
        // script present but not initialized yet
        try {
          (window as any).instgrm?.Embeds?.process();
        } catch (e) {}
        return;
      }

      const s = document.createElement("script");
      s.async = true;
      s.defer = true;
      s.src = "https://www.instagram.com/embed.js";
      s.onload = () => {
        try {
          (window as any).instgrm?.Embeds?.process();
        } catch (e) {}
      };
      document.body.appendChild(s);
    };

    loadScript();
  }, [permalink]);

  return (
    <div ref={rootRef}>
      {rawHtml ? (
        <div
          dangerouslySetInnerHTML={{ __html: rawHtml }}
          style={{ width: "100%", maxWidth: 1000 }}
        />
      ) : (
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
      )}
    </div>
  );
}
