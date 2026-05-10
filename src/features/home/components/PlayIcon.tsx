type IconProps = { className?: string };

export default function PlayIcon({ className }: IconProps) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.609 1.814L13.792 12 3.61 22.186a1 1 0 0 1-.61-.92V2.733a1 1 0 0 1 .609-.92zM14.5 12.707l2.598 2.598-10.51 5.991 7.912-8.589zM14.5 11.293l-7.91-8.589 10.51 5.991-2.6 2.598zm6.302 4.04l-3.146-1.793L18.95 12l-1.295-1.54 3.146-1.793a1 1 0 0 1 0 1.66z" />
      </svg>
    );
  }
  