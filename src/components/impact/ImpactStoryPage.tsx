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

  const compactIntro = toCompactText(`${story.intro} ${story.summary}`, 34);
  const compactQuickFacts = story.quickFacts.slice(0, 3);
  const compactHighlights = story.highlights.slice(0, 4);
  const compactChapters = story.storyChapters.slice(0, 3).map((chapter) => ({
    ...chapter,
    body: toCompactText(chapter.body, 24),
  }));
  const compactOutcomes = story.outcomes.slice(0, 4).map((item) => toCompactText(item, 18));
  const compactRelatedStories =
    story.relatedStories
      ?.filter((item) => !isDataResearchItem(item.title) && !isDataResearchItem(item.href))
      .slice(0, 4) ?? [];
  const compactResources =
    story.resources
      ?.filter((item) => !isDataResearchItem(item.title) && !isDataResearchItem(item.href))
      .slice(0, 4) ?? [];
  const compactMedia = story.media?.slice(0, 2) ?? [];
  const compactHopeStories = story.hopeStories?.slice(0, 2) ?? [];
  const heroImage = story.gallery?.[0] ?? compactHopeStories[0]?.image;

  return (
    <main className={styles.page} style={themeStyle}>
      <div className={styles.backdrop} aria-hidden="true" />

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
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Impact in motion</p>
            <p className={styles.eyebrow}>{story.eyebrow}</p>
            <h1 className={styles.title}>{story.title}</h1>
            <p className={styles.lead}>{compactIntro}</p>

            {compactHighlights.length > 0 ? (
              <div className={styles.pillRow}>
                {compactHighlights.map((item) => (
                  <span key={item.label} className={styles.pill}>
                    <strong>{item.value}</strong>
                    <em>{item.label}</em>
                  </span>
                ))}
              </div>
            ) : null}

            <div className={styles.actionRow}>
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

          <div className={styles.heroMedia}>
            <figure className={styles.heroImageFrame}>
              {heroImage ? (
                <Image
                  src={heroImage.src}
                  alt={heroImage.alt}
                  fill
                  priority
                  sizes="(max-width: 960px) 100vw, 50vw"
                />
              ) : (
                <div className={styles.heroFallback}>
                  <span>Field story highlights</span>
                </div>
              )}
            </figure>

            {compactQuickFacts.length > 0 ? (
              <div className={styles.factGrid}>
                {compactQuickFacts.map((fact) => (
                  <article key={fact.label} className={styles.factCard}>
                    <span>{fact.label}</span>
                    <strong>{fact.value}</strong>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </header>

        <section className={styles.storySection} id={slugify(story.storyHeading)}>
          <div className={styles.sectionHeading}>
            <p className={styles.sectionEyebrow}>Story arc</p>
            <h2>{story.storyHeading}</h2>
          </div>

          <div className={styles.chapterGrid}>
            {compactChapters.map((chapter, index) => (
              <article key={chapter.title} className={styles.chapterCard}>
                <span className={styles.chapterIndex}>{String(index + 1).padStart(2, "0")}</span>
                <h3>{chapter.title}</h3>
                <p>{chapter.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.outcomeSection}>
          <div className={styles.sectionHeadingCompact}>
            <p className={styles.sectionEyebrow}>Outcomes</p>
            <h2>{story.outcomesHeading}</h2>
          </div>
          <ul className={styles.outcomeList}>
            {compactOutcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </section>

        {story.gallery && story.gallery.length > 0 ? (
          <section className={styles.gallerySection} id={slugify(story.galleryTitle ?? "In the field")}>
            <div className={styles.sectionHeadingCompact}>
              <p className={styles.sectionEyebrow}>Field frames</p>
              <h2>{story.galleryTitle ?? "In the field"}</h2>
            </div>

            <div className={styles.galleryGrid}>
              {story.gallery.slice(0, 4).map((image, index) => (
                <figure key={`${image.src}-${index}`} className={styles.galleryItem}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 980px) 100vw, 33vw"
                  />
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {compactMedia.length > 0 ? (
          <section className={styles.mediaSection} id={slugify(story.mediaHeading ?? "Community snapshots")}>
            <div className={styles.sectionHeadingCompact}>
              <p className={styles.sectionEyebrow}>Instagram</p>
              <h2>{story.mediaHeading ?? "Community snapshots"}</h2>
            </div>

            <div className={styles.mediaGrid}>
              {compactMedia.map((item) => (
                <article key={item.permalink} className={styles.mediaItem}>
                  <div className={styles.mediaMeta}>
                    <p>{item.title}</p>
                    <span>{toCompactText(item.description, 22)}</span>
                  </div>
                  <InstagramEmbed permalink={item.permalink} />
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {compactHopeStories.length > 0 ? (
          <section className={styles.hopeSection}>
            <div className={styles.sectionHeadingCompact}>
              <p className={styles.sectionEyebrow}>Stories of hope</p>
              <h2>{story.hopeStoriesHeading ?? "Personal journeys"}</h2>
            </div>
            <div className={styles.hopeGrid}>
              {compactHopeStories.map((item) => (
                <article key={item.name} className={styles.hopeCard}>
                  <h3>{item.name}</h3>
                  <p className={styles.hopeRole}>{item.role}</p>
                  <p>{toCompactText(item.summary, 20)}</p>
                  <StoryLink href={item.href} className={styles.inlineLink}>
                    Read story
                  </StoryLink>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {(compactResources.length > 0 || compactRelatedStories.length > 0) ? (
          <section className={styles.linksSection}>
            {compactResources.length > 0 ? (
              <div>
                <p className={styles.linksLabel}>{story.resourcesHeading ?? "References"}</p>
                <div className={styles.linkGrid}>
                  {compactResources.map((resource) => (
                    <StoryLink key={resource.href} href={resource.href} className={styles.linkCard}>
                      <span>{resource.title}</span>
                      <strong>Open</strong>
                    </StoryLink>
                  ))}
                </div>
              </div>
            ) : null}

            {compactRelatedStories.length > 0 ? (
              <div>
                <p className={styles.linksLabel}>{story.relatedHeading ?? "Explore next"}</p>
                <div className={styles.linkGrid}>
                  {compactRelatedStories.map((related) => (
                    <StoryLink key={related.href} href={related.href} className={styles.linkCard}>
                      <span>{related.title}</span>
                      <strong>View</strong>
                    </StoryLink>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        <section className={styles.closure}>
          <div>
            <p className={styles.sectionEyebrow}>Why it matters</p>
            <h2>{story.closing.title}</h2>
          </div>
          <p>{toCompactText(story.closing.body, 32)}</p>
          <div className={styles.actionRow}>
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
      </div>
    </main>
  );
}
