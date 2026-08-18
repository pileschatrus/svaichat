type P = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const PileIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 2v18.5" />
    <path d="M5.5 6.5c2.8 1.8 10.2 1.8 13 0" />
    <path d="M5.5 11c2.8 1.8 10.2 1.8 13 0" />
    <path d="M5.5 15.5c2.8 1.8 10.2 1.8 13 0" />
    <path d="M9.3 20.5 12 23l2.7-2.5" />
  </svg>
);

export const RigIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M3 21h18" />
    <path d="M6 21V3h3v18" />
    <path d="M6 7h3M6 11h3M6 15h3" />
    <path d="M9 5h6v3H9" />
    <path d="M16.5 8v13" />
    <path d="M14.5 21 16.5 18l2 3" />
  </svg>
);

export const ChatIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 4h16v12h-9.5L5 20.5V16H4z" />
    <path d="M8 9h8M8 12h5" />
  </svg>
);

export const PinIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 21.5s-6.5-5.6-6.5-10.5a6.5 6.5 0 1 1 13 0c0 4.9-6.5 10.5-6.5 10.5z" />
    <circle cx="12" cy="11" r="2.3" />
  </svg>
);

export const FactoryIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M3 21V9.5l6 4v-4l6 4V4h6v17z" />
    <path d="M7 17h2M12 17h2M17 8h2v3" />
  </svg>
);

export const CamIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 8h3.2L9 5.5h6L16.8 8H20v12H4z" />
    <circle cx="12" cy="13.5" r="3.4" />
  </svg>
);

export const WrenchIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M20.5 6.8a5 5 0 0 1-6.6 6.3l-7.2 7.2-2.9-2.9 7.2-7.2a5 5 0 0 1 6.3-6.6l-3 3 .9 2.9 2.9.9z" />
  </svg>
);

export const PhoneIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M5 3h4l2 5-2.4 1.5a12.5 12.5 0 0 0 5.9 5.9L16 13l5 2v4a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3z" />
  </svg>
);

export const MailIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M3 5h18v14H3z" />
    <path d="m3.5 6 8.5 7 8.5-7" />
  </svg>
);

export const ArrowUpRight = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

export const ArrowDown = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 4v16m-6-6 6 6 6-6" />
  </svg>
);

export const CheckIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="m4.5 12.5 5 5L19.5 6" />
  </svg>
);

export const ShieldIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="m12 2.8 7 2.9v5.1c0 5-3.4 8.5-7 10.4-3.6-1.9-7-5.4-7-10.4V5.7z" />
    <path d="m8.8 11.6 2.2 2.2 4.2-4.4" />
  </svg>
);

export const RulerIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M3 17 17 3l4 4L7 21z" />
    <path d="m8.2 15.8 1.4 1.4M11 13l1.4 1.4M13.8 10.2l1.4 1.4M16.6 7.4 18 8.8" />
  </svg>
);

export const TruckIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M2 6h11v10H2zM13 9h4.5l3.5 3.5V16h-8" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="16.5" cy="17.5" r="1.8" />
  </svg>
);

export const ClockIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5.2l3.4 2" />
  </svg>
);

export const SearchIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.8-3.8" />
  </svg>
);

export const CloseIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
  </svg>
);

export const BurgerIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 7h16M4 12h16M4 17h9" />
  </svg>
);

export const VkIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 8c.7 4.8 2.6 8.5 5.5 8.5V8" />
    <path d="M13 16.5V8m0 4.3c2.7-.2 4-1.7 4.2-4.3m-4.2 4.7c2.9.3 4.4 1.6 4.6 3.8" />
  </svg>
);

export const MaxIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 4.5h16v11.5h-9L6 20.5v-4.5H4z" />
    <path d="m8 13V9.2l4 3.2 4-3.2V13" />
  </svg>
);
