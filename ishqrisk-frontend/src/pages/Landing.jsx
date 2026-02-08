import Navbar from "../components/layout/Navbar";

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />

      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-3xl text-center mt-24">

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
                hover:shadow-xl hover:shadow-primary/30
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
