import Navbar from "../components/layout/Navbar";

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        
        {/* HERO-LOCAL GLOW (this is the key change) */}
        <div
  className="
    absolute inset-0
    flex items-center justify-center
    pointer-events-none
    -z-10
  "
>
  <div
    className="
      w-[1000px] h-[600px]
      bg-primary/14
      blur-[260px]
      rounded-full
    "
  />
</div>


        {/* Content */}
        <div className="relative z-10 max-w-3xl text-center mt-24">

          {/* Tag */}
          <div
            className="
              inline-flex items-center gap-2 px-4 py-1 mb-6
              rounded-full border border-border
              text-sm text-muted-foreground
            "
          >
            💬 Where real connections begin
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-6 font-[Playfair Display]">
            Love Starts with a{" "}
            <span className="text-primary">Conversation</span>
          </h1>

          {/* Subtext */}
          <p className="text-muted-foreground text-base md:text-lg mb-10">
            No photos. No superficial judgments.  
            Just two people talking — and seeing where it goes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="
                bg-primary text-primary-foreground
                font-semibold px-8 py-3 rounded-full
                hover:scale-[1.04]
                hover:shadow-xl hover:shadow-primary/40
                transition-all duration-300
              "
            >
              Start a Blind Date →
            </button>

            <button
              className="
                border border-border text-foreground
                px-8 py-3 rounded-full
                hover:bg-white/5 hover:scale-[1.02]
                transition-all duration-300
              "
            >
              See How It Works
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
