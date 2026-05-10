import AgentsListClient from "./AgentsListClient";

export const metadata = {
  title: "Trouver un agent immobilier — Okapi Real Estate",
  description:
    "Recherchez un agent immobilier vérifié à Kinshasa. Filtrez par langue, nationalité et type de bien.",
};

export default function Page() {
  return <AgentsListClient />;
}
