export default function Loading() {
  return (
    <div className="loading-skeleton page-loading-state" aria-label="Loading content">
      <div className="page-loading-wheel-wrap" aria-hidden="true">
        <div className="page-loading-wheel" />
      </div>
      <div className="skeleton-hero">
        <div className="skeleton-pulse skeleton-hero-bg" />
        <div className="skeleton-hero-content">
          <div className="skeleton-pulse skeleton-line skeleton-line-sm" />
          <div className="skeleton-pulse skeleton-line skeleton-line-lg" />
          <div className="skeleton-pulse skeleton-line skeleton-line-md" />
        </div>
      </div>
      <div className="skeleton-body">
        <div className="skeleton-section">
          <div className="skeleton-pulse skeleton-line skeleton-line-md" />
          <div className="skeleton-pulse skeleton-line skeleton-line-full" />
          <div className="skeleton-pulse skeleton-line skeleton-line-full" />
          <div className="skeleton-pulse skeleton-line skeleton-line-lg" />
        </div>
      </div>
    </div>
  );
}
