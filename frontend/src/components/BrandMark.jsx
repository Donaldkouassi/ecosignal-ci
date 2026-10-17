import React from "react";

// Logo EcoSignal CI : un repère de carte dont la pointe se termine en feuille.
function BrandMark({ size = 34 }) {
  return (
    <svg
      className="brand-mark-svg"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="40" height="40" rx="11" fill="var(--lagune)" />
      <path
        d="M20 8.5c-5.2 0-9.2 3.9-9.2 8.9 0 6.4 7.6 13.2 8.6 14a1 1 0 0 0 1.2 0c1-.8 8.6-7.6 8.6-14 0-5-4-8.9-9.2-8.9Z"
        fill="#fff"
      />
      <path
        d="M16.2 19.6c0-3.4 2.6-5.6 7.2-5.8-.1 4.7-2.5 7.3-5.8 7.3-.5 0-.9 0-1.4-.2Z"
        fill="var(--feuille)"
      />
      <path d="M16.6 21.2 21 16.4" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default BrandMark;
