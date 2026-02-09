import { useEffect, useRef, useState } from "react";

export default function Waiting() {
  const canvasRef = useRef(null);
  const [matchFound, setMatchFound] = useState(false);

  /* ---------------- MOCK MATCH FOUND (REMOVE LATER) ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setMatchFound(true);
    }, 15000); // simulate backend response

    return () => clearTimeout(timer);
  }, []);

  /* ---------------- SNOW + SURGE SYSTEM ---------------- */
  useEffect(() => {
    if (matchFound) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const snowflakes = [];
    const BASE_SNOW = 220;
    const MAX_SNOW = 380;

    let wind = 0;
    let windTarget = 0;
    let surge = 0;
    let surgeTarget = 0;
    let surgeTimer = 0;

    const SLOW_ZONE = {
      x: width * 0.25,
      y: height * 0.35,
      w: width * 0.5,
      h: 200,
    };

    const rand = (min, max) => Math.random() * (max - min) + min;

    function createSnowflake() {
      return {
        x: rand(0, width),
        y: rand(-height, 0),
        r: rand(0.7, 2.2),
        speed: rand(0.6, 1.6),
        drift: rand(-0.3, 0.3),
        opacity: rand(0.35, 0.9),
      };
    }

    for (let i = 0; i < BASE_SNOW; i++) {
      snowflakes.push(createSnowflake());
    }

    function inSlowZone(f) {
      return (
        f.x > SLOW_ZONE.x &&
        f.x < SLOW_ZONE.x + SLOW_ZONE.w &&
        f.y > SLOW_ZONE.y &&
        f.y < SLOW_ZONE.y + SLOW_ZONE.h
      );
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      /* --- SURGE LOGIC --- */
      surgeTimer++;
      if (surgeTimer > rand(1500, 2600)) {
        surgeTarget = 1;
        surgeTimer = 0;
      }
      if (surge > 0.95) surgeTarget = 0;
      surge += (surgeTarget - surge) * 0.002;

      /* --- WIND --- */
      windTarget = surge * rand(-0.6, 0.6);
      wind += (windTarget - wind) * 0.01;

      /* --- DYNAMIC SNOW COUNT --- */
      const desiredCount =
        BASE_SNOW + Math.floor((MAX_SNOW - BASE_SNOW) * surge);

      while (snowflakes.length < desiredCount)
        snowflakes.push(createSnowflake());
      while (snowflakes.length > desiredCount) snowflakes.pop();

      /* --- DRAW SNOW --- */
      for (const f of snowflakes) {
        const slowFactor = inSlowZone(f) ? 0.35 : 1;
        const speedBoost = 1 + surge * 0.6;

        f.y += f.speed * speedBoost * slowFactor;
        f.x += (f.drift + wind) * slowFactor;

        if (f.y > height) {
          f.y = -10;
          f.x = rand(0, width);
        }
        if (f.x < -10) f.x = width + 10;
        if (f.x > width + 10) f.x = -10;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${f.opacity})`;
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }

    animate();
  }, [matchFound]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {!matchFound && (
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      )}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 text-center">
        {!matchFound ? (
          /* ---------------- WAITING STATE ---------------- */
          <div>
            <p className="mb-3 text-xs tracking-[0.3em] text-white/40">
              WAITING
            </p>

            <h1
              className="max-w-xl text-3xl md:text-4xl text-white/90 leading-tight"
              style={{
                fontFamily: "Satisfy, cursive",
                letterSpacing: "0.02em",
              }}
            >
              We’re finding someone<br />who feels right for you
            </h1>

            <p className="mt-5 text-sm text-white/60">
              Just a quiet moment before something new begins.
            </p>

            <div className="mt-14 heart-pulse" />
          </div>
        ) : (
          /* ---------------- MATCH FOUND STATE ---------------- */
          <div className="floating-card">
            <p className="mb-3 text-xs tracking-widest text-white/50">
              MATCH FOUND
            </p>

            <div className="card-glass">
              <div className="illustration" />

              <h2
                className="mt-7 text-3xl"
                style={{ fontFamily: "Satisfy, cursive" }}
              >
                @moonlitSoul
              </h2>

              <p className="mt-3 text-sm text-white/60">
                A quiet presence.  
                A soft conversation.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- STYLES ---------------- */}
      <style>{`
        .heart-pulse {
          width: 22px;
          height: 22px;
          background: #f3b6c0;
          transform: rotate(-45deg);
          margin: 0 auto;
          animation: pulse 3s ease-in-out infinite;
          box-shadow: 0 0 30px rgba(243,182,192,0.45);
        }
        .heart-pulse::before,
        .heart-pulse::after {
          content: "";
          position: absolute;
          width: 22px;
          height: 22px;
          background: #f3b6c0;
          border-radius: 50%;
        }
        .heart-pulse::before {
          top: -11px;
          left: 0;
        }
        .heart-pulse::after {
          left: 11px;
          top: 0;
        }

        .floating-card {
          animation: float 7.5s ease-in-out infinite;
        }

        .card-glass {
          width: 360px;
          padding: 36px 32px;
          border-radius: 28px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(22px);
          box-shadow:
            0 30px 80px rgba(0,0,0,0.6),
            inset 0 0 0 1px rgba(255,255,255,0.08);
        }

        .illustration {
          height: 180px;
          border-radius: 20px;
          background: linear-gradient(
            135deg,
            rgba(243,182,192,0.45),
            rgba(255,255,255,0.06)
          );
        }

        @keyframes pulse {
          0% { transform: rotate(-45deg) scale(1); opacity: 0.8; }
          50% { transform: rotate(-45deg) scale(1.15); opacity: 1; }
          100% { transform: rotate(-45deg) scale(1); opacity: 0.8; }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}
