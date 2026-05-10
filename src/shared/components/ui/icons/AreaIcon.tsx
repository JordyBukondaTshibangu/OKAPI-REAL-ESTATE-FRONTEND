export default function AreaIcon({ className }: { className?: string }) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M21 3H3v18h18V3z" />
        <path d="M9 3v18" />
        <path d="M15 3v18" />
        <path d="M3 9h18" />
        <path d="M3 15h18" />
      </svg>
    );
  }