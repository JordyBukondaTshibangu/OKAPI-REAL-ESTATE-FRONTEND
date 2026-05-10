export default function WalkIcon({ className }: { className?: string }) {
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
        <circle cx="13" cy="4" r="2" />
        <path d="M15 22l-3-9 5-4-2-5" />
        <path d="M10 9l-2 4 3 3-1 6" />
      </svg>
    );
  }