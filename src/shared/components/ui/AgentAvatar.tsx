"use client";

import { useState } from "react";
import { getR2ImageUrl } from "@/shared/utils/utils";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

type Props = {
  name: string;
  photo?: string | null;
  size?: number;
  className?: string;
};

export default function AgentAvatar({ name, photo, size = 40, className = "" }: Props) {
  const [imgError, setImgError] = useState(false);
  const base = `rounded-full overflow-hidden shrink-0 ${className}`;
  const style = { width: size, height: size, minWidth: size };
  const src = getR2ImageUrl(photo);

  if (src && !imgError) {
    return (
      // Using <img> intentionally — photo URLs come from the backend and may be
      // from any hostname, so Next.js <Image> (which requires configured remotePatterns) would crash.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className={`${base} object-cover bg-muted`}
        style={style}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`${base} bg-gradient-to-br from-primary to-navy flex items-center justify-center text-white font-semibold`}
      style={{ ...style, fontSize: Math.round(size * 0.35) }}
    >
      {initials(name)}
    </div>
  );
}
