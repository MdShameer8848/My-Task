import "../styles/Home.css";

import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { Preview } from "../components/Preview";
import { Footer } from "../components/Footer";

export function Home() {
  return (
    <div className="home">
      <Navbar />

      <main>
        <Hero />

        <Features />

        <Preview />
      </main>

      <Footer />
    </div>
  );
}
