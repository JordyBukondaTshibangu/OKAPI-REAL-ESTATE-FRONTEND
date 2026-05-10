import { Agent } from "@/features/agents/types/agent";



export default function TitleBadge({ title }: { title: Agent["title"] }) {
    const tone =
      title === "SUPERAGENT"
        ? "bg-navy text-secondary"
        : title === "AGENT EXCLUSIF"
        ? "bg-secondary text-secondary-foreground"
        : "bg-accent text-primary";
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold tracking-widest ${tone}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
          <path d="M12 2l1.9 5.9H20l-5 3.7L17 18l-5-3.6L7 18l1.9-6.4L4 7.9h6.1L12 2z" />
        </svg>
        {title}
      </span>
    );
  }