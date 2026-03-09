import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-brand-charcoal overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-charcoal via-brand-charcoal/95 to-brand-green-dark/40" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-brand-gold/5 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-brand-green/5 blur-3xl" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-brand-gold text-xs font-semibold tracking-[0.3em] uppercase mb-6 animate-fade-in">
          By PakSarZameen
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-light text-white leading-[1.1] tracking-tight mb-6 animate-fade-in [animation-delay:100ms]">
          Commonwealth
          <br />
          <span className="text-brand-gold font-normal italic">Lab</span>
        </h1>
        <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in [animation-delay:200ms]">
          A curated marketplace connecting Pakistan&apos;s finest artisans with
          the world. Every purchase builds community wealth.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:300ms]">
          <Button asChild size="xl" variant="gold">
            <Link href="/products">Explore Collection</Link>
          </Button>
          <Button asChild size="xl" variant="outline" className="border-neutral-600 text-white hover:bg-white/5 hover:text-white">
            <Link href="/artists">Meet the Artisans</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
