"use client";

import { Smartphone } from "lucide-react";
import AppleIcon from "./AppleIcon";
import PlayIcon from "./PlayIcon";

export default function MobileApp() {
  return (
    <section className="relative bg-navy text-white py-48 px-6 overflow-visible">
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent"
        aria-hidden="true"
      />
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="relative flex justify-center">
          <div className="relative w-72 md:w-96 aspect-[4/3] bg-white rounded-2xl shadow-lg overflow-hidden border-4 border-gray-800">
            <div className="h-8 bg-primary flex items-center px-3 gap-2">
              <span className="text-white font-bold text-sm">
                Okapi Real Estate
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1 p-2 h-[calc(100%-2rem)]">
              <div className="bg-primary-light rounded-md flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-primary" />
              </div>
              <div className="bg-gray-100 rounded-md" />
              <div className="bg-gray-100 rounded-md col-span-2" />
            </div>
          </div>

          <div className="absolute -right-2 md:right-12 -bottom-6 w-24 md:w-32 aspect-[9/19] bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-gray-800">
            <div className="h-6 bg-primary" />
            <div className="p-1.5 space-y-1">
              <div className="h-12 bg-primary-light rounded" />
              <div className="h-2 bg-gray-200 rounded w-3/4" />
              <div className="h-2 bg-gray-200 rounded w-1/2" />
              <div className="h-12 bg-gray-100 rounded" />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
            Application mobile
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-5 leading-tight">
            Okapi Real Estate sur Mobile <br className="hidden md:block" /> et
            Tablette
          </h2>
          <p className="text-sm text-white/80 leading-relaxed max-w-md mb-8">
            Retrouvez tous les biens à vendre ou à louer des principales agences
            immobilières de Kinshasa sur votre appareil Android ou Apple. Grâce
            à l&apos;interface intuitive de Okapi Real Estate, trouvez et gérez
            vos biens favoris en toute simplicité. Téléchargez
            l&apos;application pour commencer.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-black hover:bg-black/80 transition-colors text-white rounded-lg px-4 py-2.5"
            >
              <AppleIcon className="w-7 h-7" />
              <div className="leading-tight">
                <p className="text-[10px] opacity-80">Télécharger sur</p>
                <p className="text-base font-semibold -mt-0.5">App Store</p>
              </div>
            </a>

            <a
              href="#"
              className="inline-flex items-center gap-3 bg-black hover:bg-black/80 transition-colors text-white rounded-lg px-4 py-2.5"
            >
              <PlayIcon className="w-7 h-7" />
              <div className="leading-tight">
                <p className="text-[10px] opacity-80">DISPONIBLE SUR</p>
                <p className="text-base font-semibold -mt-0.5">Google Play</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
