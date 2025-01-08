"use client";

import About from "@/components/home/About";
import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 sm:gap-12">
      <Hero />
      <About />
    </div>
  );
}
