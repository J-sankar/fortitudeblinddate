import { useEffect } from "react";

export default function Waiting() {

  useEffect(() => {
    const scene = document.querySelector(".parallax-scene");

    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;

      scene.style.setProperty("--px", `${x}px`);
      scene.style.setProperty("--py", `${y}px`);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-white perspective-scene">

      {/* BASE */}
      <div className="absolute inset-0 bg-waiting-base" />

      {/* PARALLAX DEPTH */}
      <div className="absolute inset-0 -z-10 preserve-3d parallax-scene">

        <div className="depth-layer far-layer">
          <div className="glow glow-far orbit-slow" />
        </div>

        <div className="depth-layer mid-layer">
          <div className="glow glow-mid orbit-medium" />
        </div>

        <div className="depth-layer near-layer">
          <div className="glow glow-near orbit-fast" />
        </div>

      </div>

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-xl animate-fade-in">

          <p className="mb-6 text-sm tracking-wide text-white/50">
            Waiting Area
          </p>

          <h1 className="mb-6 text-3xl md:text-4xl font-medium leading-snug">
            We’re finding someone<br />
            who feels right for you
          </h1>

          <p className="mb-14 text-white/60 leading-relaxed">
            No photos. No pressure.  
            Just a quiet moment before something new begins.
          </p>

          <div className="mx-auto h-16 w-16 rounded-full heart-core">
            <div className="heart-inner" />
          </div>

          <p className="mt-14 text-xs text-white/40">
            You’ll be notified when a match is ready.
          </p>

        </div>
      </div>
    </div>
  );
}
