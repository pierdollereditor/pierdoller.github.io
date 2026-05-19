import { useLenis } from "./hooks/useLenis";
import Header from "./components/Header";
import Marquee from "./components/Marquee";
import GrainOverlay from "./components/GrainOverlay";
import RecIndicator from "./components/RecIndicator";
import Hero from "./components/sections/Hero";
import Manifesto from "./components/sections/Manifesto";
import Portfolio from "./components/sections/Portfolio";
import FinalCTA from "./components/sections/FinalCTA";
import Footer from "./components/Footer";

export default function App() {
  useLenis();

  return (
    <div className="bg-[#050505] text-[#C0BDB3] min-h-screen relative overflow-x-hidden">
      <GrainOverlay />
      <RecIndicator />
      <Header />

      <main>
        <Hero />
        <Marquee
          text="EVIDENCE FILE · DO NOT DISTRIBUTE · CASE №06.21"
          variant="caution"
        />
        <Manifesto />
        <Marquee
          text="CLASSIFIED · NO FUTURE · ARCHIVE ACCESS"
          variant="caution"
          speed={50}
        />
        <Portfolio />
        <Marquee
          text="ROUGH CUT · NOT FOR BROADCAST · FINAL TRANSMISSION"
          variant="caution"
          speed={40}
        />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
