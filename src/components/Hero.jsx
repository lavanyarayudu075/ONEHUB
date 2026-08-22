import { ArrowRight, Sparkles } from "lucide-react";

function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-slate-950 pt-20"
    >

      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 text-center">

        {/* Badge */}
        <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300 backdrop-blur">
          <Sparkles className="h-4 w-4" />
          AI-Powered Organisation Management
        </div>

        {/* Heading */}
        <h1 className="mx-auto max-w-5xl text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">

          One Platform.
          <br />

          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent">
            Every Organisation.
          </span>

        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
          ONEHUB is an AI-powered multi-tenant organisation management
          platform designed to bring people, data, workflows and intelligence
          together in one powerful hub.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

          <button className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-3.5 font-semibold text-slate-950 transition hover:scale-105">
            Get Started

            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </button>

          <button className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/10">
            Explore Platform
          </button>

        </div>

      </div>
    </section>
  );
}

export default Hero;