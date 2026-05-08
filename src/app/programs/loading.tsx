export default function ProgramsLoading() {
  return (
    <div className="loading-skeleton" aria-label="Loading programs">
      <div className="skeleton-hero">
        <div className="skeleton-pulse skeleton-hero-bg" />
        <div className="skeleton-hero-content">
          <div className="skeleton-pulse skeleton-line skeleton-line-sm" />
          <div className="skeleton-pulse skeleton-line skeleton-line-lg" />
          <div className="skeleton-pulse skeleton-line skeleton-line-md" />
        </div>
      </div>
      <div className="skeleton-body">
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-pulse skeleton-card-img" />
              <div className="skeleton-card-body">
                <div className="skeleton-pulse skeleton-line skeleton-line-md" />
                <div className="skeleton-pulse skeleton-line skeleton-line-full" />
                <div className="skeleton-pulse skeleton-line skeleton-line-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
