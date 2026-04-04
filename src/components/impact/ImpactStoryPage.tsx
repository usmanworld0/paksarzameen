import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { ReactNode } from "react";

import InstagramEmbed from "@/components/InstagramEmbed";
import type { ImpactStoryPageData } from "@/content/impact";

import styles from "./ImpactStoryPage.module.css";

function toCompactText(text: string, maxWords = 28) {
  const firstSentence = text.split(/[.!?]/)[0]?.trim() ?? "";
  const source = firstSentence.length > 0 ? firstSentence : text.trim();
  const words = source.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return source;
  return `${words.slice(0, maxWords).join(" ")}...`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}

function isDataResearchItem(value: string) {
  return /(data-assessment|research)/i.test(value);
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

  const compactIntro = toCompactText(story.intro, 34);
  const compactSummary = toCompactText(story.summary, 46);
  const compactQuickFacts = story.quickFacts.slice(0, 4);
  const compactHighlights = story.highlights.slice(0, 4);
  const compactChapters = story.storyChapters.slice(0, 4).map((chapter) => ({
    ...chapter,
    body: toCompactText(chapter.body, 44),
  }));
  const compactOutcomes = story.outcomes.slice(0, 6).map((item) => toCompactText(item, 26));
  const compactRelatedStories =
    story.relatedStories
      ?.filter((item) => !isDataResearchItem(item.title) && !isDataResearchItem(item.href))
      .slice(0, 6) ?? [];
  const compactResources =
    story.resources
      ?.filter((item) => !isDataResearchItem(item.title) && !isDataResearchItem(item.href))
      .slice(0, 4) ?? [];
  const compactMedia = story.media?.slice(0, 4) ?? [];

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

        <header className={styles.hero}>
          <div className={styles.heroMain}>
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
          </div>

          {compactQuickFacts.length > 0 ? (
            <div className={styles.heroPanel}>
              <p className={styles.sideLabel}>At a glance</p>
              <ul className={styles.factList}>
                {compactQuickFacts.map((fact) => (
                  <li key={fact.label} className={styles.factItem}>
                    <span className={styles.factLabel}>{fact.label}</span>
                    <span className={styles.factValue}>{fact.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </header>

        {compactHighlights.length > 0 ? (
          <section className={styles.highlightRail}>
            {compactHighlights.map((item) => (
              <article key={item.label} className={styles.highlightCard}>
                <p className={styles.highlightValue}>{item.value}</p>
                <p className={styles.highlightLabel}>{item.label}</p>
              </article>
            ))}
          </section>
        ) : null}

        <div className={styles.contentGrid}>
          <section className={styles.mainRail}>
            <section className={styles.block} id={slugify(story.storyHeading)}>
              <h2 className={styles.blockTitle}>{story.storyHeading}</h2>
              <div className={styles.chapterList}>
                {compactChapters.map((chapter, index) => (
                  <details
                    key={chapter.title}
                    className={styles.chapterCard}
                    open={index === 0}
                  >
                    <summary>
                      <span className={styles.chapterIndex}>{String(index + 1).padStart(2, "0")}</span>
                      <span className={styles.chapterTitle}>{chapter.title}</span>
                    </summary>
                    <p>{chapter.body}</p>
                  </details>
                ))}
              </div>
            </section>

            {story.gallery && story.gallery.length > 0 ? (
              <section className={styles.block} id={slugify(story.galleryTitle ?? "In the field") }>
                <h2 className={styles.blockTitle}>{story.galleryTitle ?? "In the field"}</h2>
                {story.galleryIntro ? (
                  <p className={styles.sectionIntro}>{toCompactText(story.galleryIntro, 42)}</p>
                ) : null}
                <div className={styles.galleryGrid}>
                  {story.gallery.slice(0, 6).map((image, index) => (
                    <figure
                      key={`${image.src}-${index}`}
                      className={`${styles.galleryItem} ${index % 3 === 0 ? styles.galleryWide : ""}`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 1100px) 100vw, 60vw"
                      />
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}

            {compactMedia.length > 0 ? (
              <section className={styles.block} id={slugify(story.mediaHeading ?? "Community snapshots") }>
                <h2 className={styles.blockTitle}>{story.mediaHeading ?? "Community snapshots"}</h2>
                {story.mediaIntro ? <p className={styles.sectionIntro}>{toCompactText(story.mediaIntro, 40)}</p> : null}
                <div className={styles.mediaGrid}>
                  {compactMedia.map((item) => (
                    <article key={item.permalink} className={styles.mediaItem}>
                      <div className={styles.mediaMeta}>
                        <h3>{item.title}</h3>
                        <p>{toCompactText(item.description, 26)}</p>
                      </div>
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
            <section className={styles.sideBlock}>
              <p className={styles.sideLabel}>{story.outcomesHeading}</p>
              <ul className={styles.outcomeList}>
                {compactOutcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </section>

            {compactResources.length > 0 ? (
              <section className={styles.sideBlock}>
                <p className={styles.sideLabel}>{story.resourcesHeading ?? "References"}</p>
                <div className={styles.relatedList}>
                  {compactResources.map((resource) => (
                    <StoryLink key={resource.href} href={resource.href} className={styles.relatedLink}>
                      <span>{resource.title}</span>
                      <span>Open</span>
                    </StoryLink>
                  ))}
                </div>
              </section>
            ) : null}

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
              <p>{toCompactText(story.closing.body, 28)}</p>
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
