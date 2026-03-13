export default function CommonwealthLabLoading() {
  return (
    <div className="loading-skeleton commonwealth-loading" aria-label="Loading marketplace">
      <div className="skeleton-hero">
        <div className="skeleton-pulse skeleton-hero-bg" />
        <div className="skeleton-hero-content">
          <div className="skeleton-pulse skeleton-line skeleton-line-sm" />
          <div className="skeleton-pulse skeleton-line skeleton-line-lg" />
        </div>
      </div>
      <div className="skeleton-body">
        <div className="skeleton-grid skeleton-grid-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-pulse skeleton-card-img skeleton-card-img-tall" />
              <div className="skeleton-card-body">
                <div className="skeleton-pulse skeleton-line skeleton-line-md" />
                <div className="skeleton-pulse skeleton-line skeleton-line-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
