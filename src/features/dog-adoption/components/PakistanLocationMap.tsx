"use client";

type PakistanLocationMapMarker = {
  id: string;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  count?: number;
  active?: boolean;
  onSelect?: () => void;
};

type PakistanLocationMapProps = {
  markers: PakistanLocationMapMarker[];
  footer?: React.ReactNode;
};

const MAP_SILHOUETTE_PATH =
  "M53 4 66 9 75 17 79 28 89 35 84 47 73 59 69 69 63 78 64 93 56 105 58 118 50 131 39 127 28 132 19 123 20 108 12 95 17 82 11 66 16 52 11 39 19 29 31 25 35 14 46 8Z";

export function PakistanLocationMap({ markers, footer }: PakistanLocationMapProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#e5e5e5] bg-[#fafafa]">
      <div className="relative aspect-[5/6] overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(17,17,17,0.07),transparent_24%),radial-gradient(circle_at_80%_86%,rgba(17,17,17,0.08),transparent_22%),linear-gradient(180deg,#ffffff_0%,#f5f5f5_100%)]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(17,17,17,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.06) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <svg
          viewBox="0 0 100 140"
          className="absolute inset-0 h-full w-full px-[11%] py-[9%]"
          aria-hidden="true"
        >
          <path d={MAP_SILHOUETTE_PATH} fill="#111111" opacity="0.1" />
          <path
            d={MAP_SILHOUETTE_PATH}
            fill="none"
            stroke="#111111"
            strokeDasharray="2 3"
            strokeWidth="0.8"
            opacity="0.5"
          />
        </svg>

        <div className="absolute left-5 top-5 max-w-[15rem]">
          <p className="text-[1rem] font-medium uppercase tracking-[0.18em] text-[#707072]">Pakistan map</p>
          <p className="mt-2 text-[1.25rem] font-medium leading-[1.7] text-[#111111]">
            Live dog locations appear as pinned rescue points.
          </p>
        </div>

        {markers.map((marker) => {
          const interactive = typeof marker.onSelect === "function";

          const inner = (
            <>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#111111] text-[0.8rem] text-white">
                {marker.count && marker.count > 1 ? marker.count : ""}
              </span>
              <span
                className={`pointer-events-none absolute left-1/2 top-full mt-2 w-max -translate-x-1/2 whitespace-nowrap rounded-full border px-3 py-1 text-[0.95rem] font-medium tracking-[0.12em] ${
                  marker.active
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-[#cacacb] bg-white text-[#111111]"
                }`}
              >
                {marker.label}
              </span>
            </>
          );

          return interactive ? (
            <button
              key={marker.id}
              type="button"
              onClick={marker.onSelect}
              className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              aria-label={marker.sublabel ? `${marker.label}, ${marker.sublabel}` : marker.label}
            >
              <span
                className={`absolute inset-[-0.9rem] rounded-full ${
                  marker.active ? "bg-[#111111]/16" : "bg-[#111111]/8"
                }`}
              />
              {inner}
            </button>
          ) : (
            <div
              key={marker.id}
              className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              aria-label={marker.sublabel ? `${marker.label}, ${marker.sublabel}` : marker.label}
            >
              <span
                className={`absolute inset-[-0.9rem] rounded-full ${
                  marker.active ? "bg-[#111111]/16" : "bg-[#111111]/8"
                }`}
              />
              {inner}
            </div>
          );
        })}
      </div>

      {footer ? <div className="border-t border-[#e5e5e5] bg-white p-5">{footer}</div> : null}
    </div>
  );
}
