// Desktop backdrop shown behind the window in windowed (minimized) mode,
// featuring the Lovable logo mark as the wallpaper.
const LOVABLE_LOGO = (
  <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <clipPath id="lovable-mask" clipPathUnits="userSpaceOnUse">
      <path clipRule="evenodd" d="M54.6052 0C83.9389 0 107.719 23.8424 107.719 53.2535V73.4931H125.395C154.729 73.4931 178.508 97.3355 178.508 126.747C178.508 156.158 154.729 180 125.395 180H1.4917V53.2535C1.4917 23.8424 25.2714 0 54.6052 0Z" />
    </clipPath>
    <g clipPath="url(#lovable-mask)">
      <rect x="0" y="0" width="180" height="180" fill="url(#lovable-blur0)" />
      <rect x="0" y="0" width="180" height="180" fill="url(#lovable-blur1)" />
      <rect x="0" y="0" width="180" height="180" fill="url(#lovable-blur2)" />
      <rect x="0" y="0" width="180" height="180" fill="url(#lovable-blur3)" />
    </g>
    <defs>
      <radialGradient id="lovable-blur0" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(208.43464 0 0 208.43464 79.1388 96.0857)">
        <stop offset="0" stopColor="#4B73FF" />
        <stop offset="0.52" stopColor="#4B73FF" stopOpacity="0.62" />
        <stop offset="0.7" stopColor="#4B73FF" stopOpacity="0.15" />
        <stop offset="1" stopColor="#4B73FF" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="lovable-blur1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(242.07264 0 0 208.43464 92.3162 30.3281)">
        <stop offset="0" stopColor="#FF66F4" />
        <stop offset="0.51" stopColor="#FF66F4" stopOpacity="0.69" />
        <stop offset="0.72" stopColor="#FF66F4" stopOpacity="0.12" />
        <stop offset="1" stopColor="#FF66F4" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="lovable-blur2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(208.43464 0 0 193.84164 117.345 7.77496)">
        <stop offset="0" stopColor="#FF0105" />
        <stop offset="0.5" stopColor="#FF0105" stopOpacity="0.61" />
        <stop offset="0.73" stopColor="#FF0105" stopOpacity="0.1" />
        <stop offset="1" stopColor="#FF0105" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="lovable-blur3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(160.67114 0 0 160.67114 94.4282 30.2969)">
        <stop offset="0" stopColor="#FE7B02" stopOpacity="0.97" />
        <stop offset="0.53" stopColor="#FE7B02" stopOpacity="0.26" />
        <stop offset="0.77" stopColor="#FE7B02" stopOpacity="0.02" />
        <stop offset="1" stopColor="#FE7B02" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

export const LovableBackdrop = () => (
  <div
    aria-hidden="true"
    data-window-drag={undefined}
    className="fixed inset-0 z-0 flex items-center justify-center overflow-hidden bg-background"
    style={{
      backgroundImage:
        "radial-gradient(120% 90% at 20% 10%, rgba(255,102,244,0.10), transparent 55%)," +
        "radial-gradient(120% 90% at 80% 15%, rgba(75,115,255,0.12), transparent 60%)," +
        "radial-gradient(130% 100% at 50% 110%, rgba(254,123,2,0.10), transparent 60%)",
    }}
  >
    <div
      className="pointer-events-none select-none"
      style={{
        width: "min(46vh, 46vw)",
        filter: "drop-shadow(0 30px 80px rgba(255,1,5,0.18)) drop-shadow(0 20px 60px rgba(75,115,255,0.18))",
        opacity: 0.92,
      }}
    >
      {LOVABLE_LOGO}
    </div>
  </div>
);
