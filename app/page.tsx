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
    <div className="flex min-h-screen flex-col w-full overflow-x-clip bg-zinc-50 font-sans dark:bg-black">
         <main>
   <Navbar />
    <Hero />
    <Stat />
    <About />
    <Events />
    <Footer />
    </main>


      <div className="w-full min-w-0 overflow-hidden">
        <RunClubMarquee />
      </div>
      
    </div>
  );
}
