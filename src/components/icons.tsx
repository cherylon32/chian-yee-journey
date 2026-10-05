import type React from "react";
// Small inline icons (no icon library needed).
type P = { className?: string };
const base = { width: 20, height: 20, viewBox: "0 0 24 24", "aria-hidden": true } as const;

export const LinkedInIcon = ({ className }: P) => (
  <svg {...base} className={className} fill="currentColor">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.83v1.5h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13v5.43h-4v-4.82c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.9h-4v-11Z" />
  </svg>
);

export const GitHubIcon = ({ className }: P) => (
  <svg {...base} className={className} fill="currentColor">
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  </svg>
);

export const MailIcon = ({ className }: P) => (
  <svg {...base} className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const DownloadIcon = ({ className }: P) => (
  <svg {...base} className={className} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" />
  </svg>
);

export const PinIcon = ({ className }: P) => (
  <svg {...base} className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const ArrowDownIcon = ({ className }: P) => (
  <svg {...base} className={className} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14m0 0-6-6m6 6 6-6" />
  </svg>
);

// Line icons referenced by name from the data files.
const lineIcons: Record<string, React.ReactNode> = {
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  chart: <path d="M4 20V10m6 10V4m6 16v-7m4 7H3" />,
  tools: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8V20h3.2l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.4-.4-2.4 2.6-2.6Z" />,
  cap: <path d="m2 9 10-5 10 5-10 5L2 9Zm4 2v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5m4-2v6" />,
  award: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.5 13.5-1.5 7.5 5-2.5 5 2.5-1.5-7.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </>
  ),
  leaf: <path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15M5 19l7-7" />,
  gamepad: (
    <>
      <rect x="2.5" y="7" width="19" height="11" rx="5.5" />
      <path d="M7.5 10.5v4m-2-2h4" />
      <circle cx="15.5" cy="11.5" r="0.6" fill="currentColor" />
      <circle cx="17.5" cy="14" r="0.6" fill="currentColor" />
    </>
  ),
  flask: <path d="M9.5 3h5M10 3v6L4.8 18.2A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-2.8L14 9V3M7.5 15h9" />,
  sparkle: <path d="M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M18 6l-2.5 2.5m-7 7L6 18" />,
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </>
  ),
  puzzle: <path d="M4 4h5.5v1.5a1.75 1.75 0 0 0 3.5 0V4H20v6.5h-1.5a1.75 1.75 0 0 0 0 3.5H20V20h-6.5v-1.5a1.75 1.75 0 0 0-3.5 0V20H4v-6.5h1.5a1.75 1.75 0 0 0 0-3.5H4V4Z" />,
  scale: <path d="M12 4v16m-5 0h10M4 7h16M6 7l-3 6.5a3 3 0 0 0 6 0L6 7Zm12 0-3 6.5a3 3 0 0 0 6 0L18 7Z" />,
  blocks: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
      <path d="M11 7h3a2 2 0 0 1 2 2v4M13 17h-3a2 2 0 0 1-2-2v-4" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4.5" width="14" height="16.5" rx="2" />
      <path d="M9 4.5V3h6v1.5M8.5 10h7M8.5 13.5h7M8.5 17h4" />
    </>
  ),
  dna: <path d="M7 3c0 5 10 6 10 9s-10 4-10 9M17 3c0 5-10 6-10 9s10 4 10 9M9 6h6M8.5 9h7M8.5 15h7M9 18h6" />,
  chat: <path d="M4 5h16v11H9.5L4 20V5Zm4 4h8m-8 3.5h5" />,
  trophy: <path d="M8 4h8v5a4 4 0 0 1-8 0V4Zm0 2H5a3 3 0 0 0 3 4m8-4h3a3 3 0 0 1-3 4m-4 3v4m-4 3h8m-6-3h4" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  cloud: <path d="M7 18.5a4.2 4.2 0 0 1-.6-8.4A6.3 6.3 0 0 1 18.2 9a4.8 4.8 0 0 1 .3 9.5H7Z" />,
  plus: <path d="M12 6v12M6 12h12" />,
  map: <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14" />,
  link: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
  star: <path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6-4.5-4.2 6.1-.8L12 3Z" />,
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </>
  ),
};

type IconProps = { name: string; className?: string; x?: number; y?: number; width?: number; height?: number; color?: string; strokeWidth?: number };

export function Icon({ name, className = "size-5", strokeWidth = 1.8, ...svgProps }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...svgProps}>
      {lineIcons[name] ?? lineIcons.sparkle}
    </svg>
  );
}
