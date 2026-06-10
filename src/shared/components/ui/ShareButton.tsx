"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export default function ShareButton({
  title,
  onShare,
  className = "inline-flex items-center gap-1.5 px-3 h-9 rounded-md hover:bg-muted text-foreground/80 transition-colors",
}: {
  title?: string;
  /** Called once a share actually happened (native share or link copied). */
  onShare?: () => void;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    const shareTitle = title ?? document.title;

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url });
        onShare?.();
        return;
      } catch {
        // user cancelled — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      onShare?.();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <button onClick={handleShare} className={className}>
      {copied ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <Share2 className="w-4 h-4" />
      )}
      {copied ? "Lien copié !" : "Partager"}
    </button>
  );
}
