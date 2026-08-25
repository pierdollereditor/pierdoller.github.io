import { useLenis } from "./hooks/useLenis";
import Header from "./components/Header";
import Marquee from "./components/Marquee";
import GrainOverlay from "./components/GrainOverlay";
import Hero from "./components/sections/Hero";
import Manifesto from "./components/sections/Manifesto";
import Portfolio from "./components/sections/Portfolio";
import FinalCTA from "./components/sections/FinalCTA";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  useLenis();

  return (
    <div className="bg-[#050505] text-[#C0BDB3] min-h-screen relative overflow-x-hidden">
      <LoadingScreen />
      <GrainOverlay />
      <Header />

      <main>
        <Hero />
        <Marquee
          text="EVIDENCE FILE · DO NOT DISTRIBUTE · CASE №06.21"
          variant="caution"
          speed={72}
          stackVariant={0}
        />
        <Manifesto />
        <Marquee
          text="CLASSIFIED · NO FUTURE · ARCHIVE ACCESS"
          variant="caution"
          speed={88}
          stackVariant={1}
        />
        <Portfolio />
        <Marquee
          text="ROUGH CUT · NOT FOR BROADCAST · FINAL TRANSMISSION"
          variant="caution"
          speed={78}
          stackVariant={2}
        />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
