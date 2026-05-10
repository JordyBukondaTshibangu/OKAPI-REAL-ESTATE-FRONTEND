"use client";

import Image from "next/image";

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
  const base = `rounded-full overflow-hidden shrink-0 ${className}`;
  const style = { width: size, height: size, minWidth: size };

  if (photo) {
    return (
      <div className={`${base} bg-muted`} style={style}>
        <Image
          src={photo}
          alt={name}
          width={size}
          height={size}
          className="w-full h-full object-cover"
        />
      </div>
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
