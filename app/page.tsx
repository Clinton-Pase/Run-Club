import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stat from "./components/Stat";
import About from "./components/About";
import Events from "./components/Events";
import Footer from "./components/Footer";
import RunClubMarquee from "./components/RunClubMarquee";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
         <main>
   <Navbar />
    <Hero />
    <Stat />
    <About />
    <Events />
    <Footer />
    <RunClubMarquee />
    </main>
    </div>
  );
}
