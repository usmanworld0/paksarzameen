import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import InstagramEmbed from "@/components/InstagramEmbed";
import type { ImpactStoryLink, ImpactStoryPageData } from "@/content/impact";

import styles from "./ImpactStoryPage.module.css";

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
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

function CardLink({
  card,
  type,
}: {
  card: ImpactStoryLink;
  type: "related" | "resource";
}) {
  const isFeaturedRelated =
    type === "related" &&
    Boolean(
      card.instagramPermalink ||
        card.image ||
        card.eyebrow ||
        card.meta ||
        (card.bullets && card.bullets.length > 0)
    );
  const className =
    type === "related"
      ? `${styles.relatedCard}${isFeaturedRelated ? ` ${styles.relatedCardFeatured}` : ""}`
      : styles.resourceCard;
  const linkClassName = type === "related" ? styles.relatedLink : styles.resourceLink;
  const label = card.ctaLabel ?? (type === "related" ? "Read story" : "Open resource");

  if (isFeaturedRelated) {
    return (
      <article className={className}>
        {card.instagramPermalink ? (
          <div className={styles.relatedEmbed}>
            <InstagramEmbed permalink={card.instagramPermalink} />
          </div>
        ) : card.image ? (
          <div className={styles.relatedMedia}>
            <Image
              src={card.image.src}
              alt={card.image.alt}
              fill
              sizes="(max-width: 720px) 100vw, (max-width: 1120px) 50vw, 33vw"
            />
          </div>
        ) : null}
        <div className={styles.relatedBody}>
          {type === "related" && (card.eyebrow || card.meta) ? (
            <div className={styles.relatedTopline}>
              {card.eyebrow ? <span className={styles.relatedEyebrow}>{card.eyebrow}</span> : null}
              {card.meta ? <span className={styles.relatedMeta}>{card.meta}</span> : null}
            </div>
          ) : null}
          <h3>{card.title}</h3>
          <p>{card.description}</p>
          {type === "related" && card.bullets && card.bullets.length > 0 ? (
            <ul className={styles.relatedBulletList}>
              {card.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
          {isExternalHref(card.href) ? (
            <a href={card.href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
              {label}
            </a>
          ) : (
            <Link href={card.href} className={linkClassName}>
              {label}
            </Link>
          )}
        </div>
      </article>
    );
  }

  const content = (
    <>
      <div>
        <h3>{card.title}</h3>
        <p>{card.description}</p>
        <span className={linkClassName}>{label}</span>
      </div>
    </>
  );

  if (isExternalHref(card.href)) {
    return (
      <a href={card.href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={card.href} className={className}>
      {content}
    </Link>
  );
}

export function ImpactStoryPage({ story }: { story: ImpactStoryPageData }) {
  const themeStyle = {
    "--accent": story.accent,
    "--accent-soft": story.accentSoft,
  } as CSSProperties;
  const hasFeaturedRelatedStories = Boolean(
    story.relatedStories?.some(
      (item) =>
        item.instagramPermalink ||
        item.image ||
        item.eyebrow ||
        item.meta ||
        (item.bullets && item.bullets.length > 0)
    )
  );

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

        <section className={styles.hero}>
          <div className={styles.heroCard}>
            <p className={styles.eyebrow}>{story.eyebrow}</p>
            <h1 className={styles.title}>{story.title}</h1>
            <p className={styles.lead}>{story.intro}</p>
            <p className={styles.summary}>{story.summary}</p>

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

          <aside className={styles.sideCard}>
            <div className={styles.sideHeader}>
              <span className={styles.sideAccent} aria-hidden="true" />
              <h2>At a glance</h2>
            </div>

            <dl className={styles.factList}>
              {story.quickFacts.map((fact) => (
                <div key={fact.label} className={styles.factItem}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        {story.highlights.length > 0 ? (
          <section className={styles.highlights} aria-label="Key highlights">
            {story.highlights.map((highlight) => (
              <article key={`${highlight.value}-${highlight.label}`} className={styles.highlightCard}>
                <span className={styles.highlightValue}>{highlight.value}</span>
                <span className={styles.highlightLabel}>{highlight.label}</span>
              </article>
            ))}
          </section>
        ) : null}

        <section className={styles.sectionPanel}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Story arc</p>
            <h2>{story.storyHeading}</h2>
          </div>

          <div className={styles.storyGrid}>
            {story.storyChapters.map((chapter, index) => (
              <article key={chapter.title} className={styles.storyCard}>
                <span className={styles.storyIndex}>{String(index + 1).padStart(2, "0")}</span>
                <h3>{chapter.title}</h3>
                <p>{chapter.body}</p>
              </article>
            ))}
          </div>
        </section>

        {story.gallery && story.gallery.length > 0 ? (
          <section className={styles.sectionPanel}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionEyebrow}>Field moments</p>
              <h2>{story.galleryTitle ?? "In the field"}</h2>
              {story.galleryIntro ? <p className={styles.sectionIntro}>{story.galleryIntro}</p> : null}
            </div>

            <div className={styles.galleryGrid}>
              {story.gallery.map((image) => (
                <div key={image.src} className={styles.galleryCard}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 1120px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className={styles.sectionPanel}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>What changed</p>
            <h2>{story.outcomesHeading}</h2>
          </div>

          <div className={styles.outcomesGrid}>
            <ul className={styles.outcomeList}>
              {story.outcomes.map((outcome) => (
                <li key={outcome} className={styles.outcomeItem}>
                  <span className={styles.outcomeMarker} aria-hidden="true" />
                  <p className={styles.outcomeText}>{outcome}</p>
                </li>
              ))}
            </ul>

            {story.note ? (
              <aside className={styles.noteCard}>
                <p className={styles.sectionEyebrow}>Why this matters</p>
                <h3>{story.note.title}</h3>
                <p>{story.note.body}</p>
              </aside>
            ) : null}
          </div>
        </section>

        {story.resources && story.resources.length > 0 ? (
          <section className={styles.sectionPanel}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionEyebrow}>Supporting context</p>
              <h2>{story.resourcesHeading ?? "Learn more"}</h2>
              {story.resourcesIntro ? <p className={styles.sectionIntro}>{story.resourcesIntro}</p> : null}
            </div>

            <div className={styles.resourcesGrid}>
              {story.resources.map((resource) => (
                <CardLink key={resource.href} card={resource} type="resource" />
              ))}
            </div>
          </section>
        ) : null}

        {story.media && story.media.length > 0 ? (
          <section className={styles.sectionPanel}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionEyebrow}>Community snapshots</p>
              <h2>{story.mediaHeading ?? "Voices from the field"}</h2>
              {story.mediaIntro ? <p className={styles.sectionIntro}>{story.mediaIntro}</p> : null}
            </div>

            <div className={styles.mediaGrid}>
              {story.media.map((item) => (
                <article key={item.permalink} className={styles.mediaCard}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className={styles.embedWrap}>
                    <InstagramEmbed permalink={item.permalink} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {story.relatedStories && story.relatedStories.length > 0 ? (
          <section className={styles.sectionPanel}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionEyebrow}>Explore next</p>
              <h2>{story.relatedHeading ?? "More impact stories"}</h2>
              {story.relatedIntro ? <p className={styles.sectionIntro}>{story.relatedIntro}</p> : null}
            </div>

            <div
              className={`${styles.relatedGrid}${hasFeaturedRelatedStories ? ` ${styles.relatedGridFeatured}` : ""}`}
            >
              {story.relatedStories.map((related) => (
                <CardLink key={related.href} card={related} type="related" />
              ))}
            </div>
          </section>
        ) : null}

        <section className={styles.ctaPanel}>
          <div>
            <p className={styles.ctaEyebrow}>Continue the story</p>
            <h2>{story.closing.title}</h2>
            <p>{story.closing.body}</p>
          </div>

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
      </div>
    </main>
  );
}
