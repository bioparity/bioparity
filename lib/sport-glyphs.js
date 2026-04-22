// Monochrome, stroke-based sport glyphs. 24×24 viewBox, 1.5px stroke,
// currentColor — inherit text color at render site. One mark per sport
// category; seven marks cover all 19 events in the ledger.

function Svg({ size = 20, className = '', children, label }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

export function SprintGlyph({ size, className }) {
  return (
    <Svg size={size} className={className} label="Sprint">
      <path d="M3 20h18" />
      <path d="M6 20v-4l7-4" />
      <path d="M13 12l5-6" />
      <path d="M18 6l2 2" />
    </Svg>
  );
}

export function MiddleGlyph({ size, className }) {
  return (
    <Svg size={size} className={className} label="Middle distance">
      <path d="M3 16c0-5 4-9 9-9s9 4 9 9" />
      <path d="M7 20c0-3 2-5 5-5s5 2 5 5" />
    </Svg>
  );
}

export function DistanceGlyph({ size, className }) {
  return (
    <Svg size={size} className={className} label="Distance">
      <path d="M12 22s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </Svg>
  );
}

export function HurdlesGlyph({ size, className }) {
  return (
    <Svg size={size} className={className} label="Hurdles">
      <path d="M5 20V9" />
      <path d="M19 20V9" />
      <path d="M3 9h18" />
      <path d="M3 20h4" />
      <path d="M17 20h4" />
    </Svg>
  );
}

export function HighJumpGlyph({ size, className }) {
  return (
    <Svg size={size} className={className} label="High jump">
      <path d="M3 20h18" />
      <path d="M6 20V8" />
      <path d="M18 20V8" />
      <path d="M6 11h12" />
      <path d="M4 18c3-10 13-10 16 0" strokeDasharray="2 2" />
    </Svg>
  );
}

export function LongJumpGlyph({ size, className }) {
  return (
    <Svg size={size} className={className} label="Long jump">
      <path d="M2 20h20" />
      <path d="M4 20v-2" />
      <path d="M4 18c4-12 12-12 16 2" strokeDasharray="2 2" />
      <path d="M19 20l1-3" />
    </Svg>
  );
}

export function SteeplechaseGlyph({ size, className }) {
  return (
    <Svg size={size} className={className} label="Steeplechase">
      {/* Track baseline */}
      <path d="M2 20h20" />
      {/* Water pit (shallow rectangle below baseline) */}
      <path d="M13 20v2h8v-2" />
      {/* Fixed barrier sitting on the baseline, ahead of the water */}
      <path d="M5 20v-6h8v6" />
      {/* Horizontal top rail of the barrier */}
      <path d="M5 14h8" />
      {/* Wavy line inside the water pit */}
      <path d="M13 22q1.5-1 3 0t3 0" />
    </Svg>
  );
}

export function ArcheryGlyph({ size, className }) {
  return (
    <Svg size={size} className={className} label="Archery">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
    </Svg>
  );
}

// Pick a glyph for an event by id + sport_category. Mapping is driven by the
// event id because sport_category conflates high/long jump under field-jump.
// Steeplechase gets its own glyph because a barrier + water pit is visually
// and functionally distinct from a flat hurdle. 5000m and 10000m reuse
// DistanceGlyph — the shape (map pin) reads as "long distance" and adding a
// separate long-distance glyph would fragment the palette without gaining
// much signal; the track-length chips and event name carry the distinction.
export function glyphForEvent(event) {
  const id = event.event_id || '';
  const cat = event.sport_category || '';
  if (id.includes('steeplechase') || cat === 'track-steeplechase') return SteeplechaseGlyph;
  if (id.includes('archery') || cat === 'archery') return ArcheryGlyph;
  if (id.includes('hurdles') || cat === 'track-hurdles') return HurdlesGlyph;
  if (id.includes('high-jump')) return HighJumpGlyph;
  if (id.includes('long-jump')) return LongJumpGlyph;
  if (
    id.includes('marathon') ||
    id.includes('5000m') ||
    id.includes('10000m') ||
    cat === 'athletics' ||
    cat === 'track-endurance'
  ) {
    return DistanceGlyph;
  }
  if (cat === 'track-middle-distance') return MiddleGlyph;
  if (cat === 'track-sprint') return SprintGlyph;
  return SprintGlyph;
}
