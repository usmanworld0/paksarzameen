import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { ReactNode } from "react";

import InstagramEmbed from "@/components/InstagramEmbed";
import type { ImpactStoryPageData } from "@/content/impact";

import styles from "./ImpactStoryPage.module.css";

function toCompactText(text: string, maxWords = 22) {
  const firstSentence = text.split(/[.!?]/)[0]?.trim() ?? "";
  const source = firstSentence.length > 0 ? firstSentence : text.trim();
  const words = source.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return source;
  return `${words.slice(0, maxWords).join(" ")}...`;
}

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}

function StoryLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function ActionLink({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "primary" | "secondary";
}) {
  const className = variant === "primary" ? styles.buttonPrimary : styles.buttonSecondary;

  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export function ImpactStoryPage({ story }: { story: ImpactStoryPageData }) {
  const themeStyle = {
    "--accent": story.accent,
    "--accent-soft": story.accentSoft,
  } as CSSProperties;

  const compactIntro = toCompactText(story.intro, 26);
  const compactSummary = toCompactText(story.summary, 34);
  const compactQuickFacts = story.quickFacts.slice(0, 3);
  const compactChapters = story.storyChapters.slice(0, 3).map((chapter) => ({
    ...chapter,
    body: toCompactText(chapter.body, 26),
  }));
  const compactOutcomes = story.outcomes.slice(0, 3).map((item) => toCompactText(item, 24));
  const compactRelatedStories = story.relatedStories?.slice(0, 5) ?? [];
  const compactMedia = story.media?.slice(0, 3) ?? [];

  return (
    <main className={styles.page} style={themeStyle}>
      <div className={styles.container}>
        {story.breadcrumbs.length > 0 ? (
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            {story.breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`}>
                {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : crumb.label}
                {index < story.breadcrumbs.length - 1 ? (
                  <span className={styles.separator}> / </span>
                ) : null}
              </span>
            ))}
          </nav>
        ) : null}

        <div className={styles.contentGrid}>
          <section className={styles.mainRail}>
            <header className={styles.hero}>
              <p className={styles.eyebrow}>{story.eyebrow}</p>
              <h1 className={styles.title}>{story.title}</h1>
              <p className={styles.lead}>{compactIntro}</p>
              <p className={styles.summary}>{compactSummary}</p>

              <div className={styles.heroActions}>
                <ActionLink href={story.cta.href} label={story.cta.label} variant="primary" />
                {story.secondaryCta ? (
                  <ActionLink
                    href={story.secondaryCta.href}
                    label={story.secondaryCta.label}
                    variant="secondary"
                  />
                ) : null}
              </div>
            </header>

            <section className={styles.block}>
              <h2 className={styles.blockTitle}>{story.storyHeading}</h2>
              <ol className={styles.chapterList}>
                {compactChapters.map((chapter) => (
                  <li key={chapter.title} className={styles.chapterItem}>
                    <h3>{chapter.title}</h3>
                    <p>{chapter.body}</p>
                  </li>
                ))}
              </ol>
            </section>

            {story.gallery && story.gallery.length > 0 ? (
              <section className={styles.block}>
                <h2 className={styles.blockTitle}>{story.galleryTitle ?? "In the field"}</h2>
                <div className={styles.galleryGrid}>
                  {story.gallery.slice(0, 4).map((image) => (
                    <div key={image.src} className={styles.galleryItem}>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 1100px) 100vw, 60vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {compactMedia.length > 0 ? (
              <section className={styles.block}>
                <h2 className={styles.blockTitle}>{story.mediaHeading ?? "Community snapshots"}</h2>
                {story.mediaIntro ? <p className={styles.sectionIntro}>{toCompactText(story.mediaIntro, 28)}</p> : null}
                <div className={styles.mediaGrid}>
                  {compactMedia.map((item) => (
                    <article key={item.permalink} className={styles.mediaItem}>
                      <h3>{item.title}</h3>
                      <p>{toCompactText(item.description, 20)}</p>
                      <div className={styles.embedWrap}>
                        <InstagramEmbed permalink={item.permalink} />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </section>

          <aside className={styles.sideRail}>
            {compactQuickFacts.length > 0 ? (
              <section className={styles.sideBlock}>
                <p className={styles.sideLabel}>At a glance</p>
                <ul className={styles.factList}>
                  {compactQuickFacts.map((fact) => (
                    <li key={fact.label} className={styles.factItem}>
                      <span className={styles.factLabel}>{fact.label}</span>
                      <span className={styles.factValue}>{fact.value}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className={styles.sideBlock}>
              <p className={styles.sideLabel}>{story.outcomesHeading}</p>
              <ul className={styles.outcomeList}>
                {compactOutcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </section>

            {compactRelatedStories.length > 0 ? (
              <section className={styles.sideBlock}>
                <p className={styles.sideLabel}>{story.relatedHeading ?? "Explore next"}</p>
                <div className={styles.relatedList}>
                  {compactRelatedStories.map((related) => (
                    <StoryLink key={related.href} href={related.href} className={styles.relatedLink}>
                      <span>{related.title}</span>
                      <span>View</span>
                    </StoryLink>
                  ))}
                </div>
              </section>
            ) : null}

            <section className={styles.cta}>
              <h2>{story.closing.title}</h2>
              <p>{toCompactText(story.closing.body, 24)}</p>
              <div className={styles.ctaActions}>
                <ActionLink href={story.cta.href} label={story.cta.label} variant="primary" />
                {story.secondaryCta ? (
                  <ActionLink
                    href={story.secondaryCta.href}
                    label={story.secondaryCta.label}
                    variant="secondary"
                  />
                ) : null}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
