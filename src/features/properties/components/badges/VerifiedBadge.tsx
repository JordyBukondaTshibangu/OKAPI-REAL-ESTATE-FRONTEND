export default function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-primary text-white text-[10px] font-semibold px-2 py-1 rounded-md">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
        <path d="M12 2l2.39 4.84L20 8.27l-3.91 3.81.92 5.38L12 14.93l-4.99 2.53.92-5.38L4 8.27l5.61-1.43L12 2z" />
      </svg>
      Vérifié
    </span>
  );
}