'use client';

import SplitPortal from "@/components/sections/SplitPortal";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-charcoal">
      {/* 
          High-Impact Entry Portal 
          SEO Strategy: Main H1 is in SplitPortal (sr-only for portal context)
      */}
      <SplitPortal />
    </main>
  );
}
