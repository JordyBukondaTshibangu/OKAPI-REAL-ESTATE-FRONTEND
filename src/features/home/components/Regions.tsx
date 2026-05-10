import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

const suburbs = [
  "Gombe",
  "Limete",
  "Lemba",
  "Ngaliema",
  "Bandalungwa",
  "Kintambo",
  "Lingwala",
  "Kalamu",
];

export default function Regions() {
  return (
    <section className="bg-navy text-primary-foreground py-32 px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
            Quartiers
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Biens à vendre dans les quartiers de Kinshasa
          </h2>
          <div className="grid grid-cols-3 gap-4 text-sm text-primary-foreground/85">
            {suburbs.map((suburb) => (
              <a
                key={suburb}
                href="#"
                className="hover:text-secondary transition-colors"
              >
                {suburb}
              </a>
            ))}
          </div>
        </div>

        <Card className="bg-white text-foreground p-6 rounded-xl shadow-lg border-0">
          <p className="text-xs text-muted-foreground tracking-wide uppercase mb-1">
            Tendances en direct
          </p>
          <h2 className="text-xl font-semibold mb-4">Kinshasa</h2>
          <div className="h-24 bg-muted rounded-lg mb-4" />
          <Button variant="outlineGold" className="rounded-full">
            Tendances immobilières à Kinshasa
          </Button>
        </Card>
      </div>
    </section>
  );
}
