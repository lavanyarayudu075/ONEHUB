import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Organizations from "../components/Organizations";

function Home() {
  return (
    <div className="min-h-screen bg-slate-200">
      <Navbar />

      <main>
        <Hero />
        <Features />
        <Organizations />
      </main>
    </div>
  );
}

export default Home;