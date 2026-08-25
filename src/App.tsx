"use client";

import { useLenis } from "./hooks/useLenis";
import Header from "./components/Header";
import GrainOverlay from "./components/GrainOverlay";
import CustomCursor from "./components/CustomCursor";
import Hero from "./components/sections/Hero";
import Manifesto from "./components/sections/Manifesto";
import Intermission from "./components/sections/Intermission";
import FinalCTA from "./components/sections/FinalCTA";
import Footer from "./components/Footer";
import { FEATURES } from "./config/features";
import LoadingScreen from "./components/LoadingScreen";
import { useDeviceTilt } from "./hooks/useDeviceTilt";

export default function App() {
  useLenis();
  useDeviceTilt();

  return (
    <div className="bg-[#050505] text-[#C0BDB3] min-h-screen relative overflow-x-hidden">
      <LoadingScreen />
      <GrainOverlay />
      <CustomCursor />
      <Header />

      <main>
        <Hero />
        <Manifesto />
        {FEATURES.resultsSection && <Intermission />}
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
