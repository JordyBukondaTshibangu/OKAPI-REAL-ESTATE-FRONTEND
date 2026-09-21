import { redirect } from "next/navigation";

// Legacy route — merged into the unified login page under the agent tab.
export default function AgentLoginRedirect() {
  redirect("/connexion?tab=agent");
}
