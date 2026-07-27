import React from "react";

const palette = {
  light: {
    frame: "#F7F4ED",
    primary: "#03112B",
    cutout: "#F7F4ED",
    accent: "#B7953F",
    star: "#D6B14A",
    word: "#F7F4ED",
    subword: "#A9B5C8",
  },
  dark: {
    frame: "#03112B",
    primary: "#F7F4ED",
    cutout: "#03112B",
    accent: "#D6B14A",
    star: "#EAD58F",
    word: "#03112B",
    subword: "#53647E",
  },
  oneColor: {
    frame: "currentColor",
    primary: "currentColor",
    cutout: "transparent",
    accent: "currentColor",
    star: "currentColor",
    word: "currentColor",
    subword: "currentColor",
  },
};

function PbxMark({ colors, className = "h-10 w-10" }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" aria-hidden="true">
      <rect width="128" height="128" rx="28" fill={colors.frame} />
      <path
        d="M33 30H64C76.7025 30 87 40.2975 87 53C87 65.7025 76.7025 76 64 76H50V98H33V30Z"
        fill={colors.primary}
      />
      <path
        d="M50 47V59H64C67.3137 59 70 56.3137 70 53C70 49.6863 67.3137 47 64 47H50Z"
        fill={colors.cutout}
      />
      <path
        d="M83.5 35L99 50.5L84.5 65L73.5 54L65 62.5L79.5 77L64 92.5L76 104.5L91.5 89L106 103.5L117 92.5L102.5 78L117 63.5L105 51.5L94.5 62L83.5 51L95.5 39L83.5 35Z"
        fill={colors.accent}
      />
      <path
        d="M92 22L95.3 30.7L104 34L95.3 37.3L92 46L88.7 37.3L80 34L88.7 30.7L92 22Z"
        fill={colors.star}
      />
    </svg>
  );
}

export default function BrandLogo({
  variant = "light",
  lockup = "wordmark",
  className = "",
  markClassName,
  textClassName = "",
  showDescriptor = false,
}) {
  const colors = palette[variant] || palette.light;
  const label = "PBX Exchange";
  const markSize = markClassName || (lockup === "mark" ? "h-10 w-10" : "h-9 w-9");

  return (
    <span className={`inline-flex items-center gap-3 ${className}`} aria-label={label}>
      <PbxMark colors={colors} className={markSize} />
      {lockup !== "mark" && (
        <span className={`leading-none ${textClassName}`}>
          <span
            className="block font-extrabold tracking-[-0.03em]"
            style={{ color: colors.word }}
          >
            PBX
          </span>
          <span
            className="block text-[0.72em] font-semibold tracking-[-0.015em]"
            style={{ color: colors.subword }}
          >
            Exchange
          </span>
          {showDescriptor && (
            <span className="sr-only">
              Social payments and cross-border wallets for Filipinos everywhere.
            </span>
          )}
        </span>
      )}
    </span>
  );
}

