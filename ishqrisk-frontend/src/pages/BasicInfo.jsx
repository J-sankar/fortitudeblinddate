import { useState } from "react";

const templates = [
  { id: "minimal", name: "Quiet Reveal", vibe: "Minimal · Elegant" },
  { id: "cinematic", name: "Soft Cinematic", vibe: "Romantic · Emotional" },
  { id: "expressive", name: "Expressive", vibe: "Creative · Bold" },
];

export default function BasicInfo() {
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [imagePreview, setImagePreview] = useState(null);

  return (
    <div className="relative min-h-screen text-foreground overflow-hidden px-6 py-24">

      {/* ===== BASE CINEMATIC GRADIENT ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-basic-gradient" />

      {/* ===== AMBIENT GLOWS ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[10%] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#f3b6c0]/10 blur-[220px]" />
        <div className="absolute top-[45%] left-[15%] h-[400px] w-[400px] rounded-full bg-[#d8a0aa]/8 blur-[200px]" />
        <div className="absolute bottom-[20%] right-[15%] h-[380px] w-[380px] rounded-full bg-[#c98f9a]/6 blur-[200px]" />
      </div>

      {/* ===== CONTENT ===== */}
      <div className="relative mx-auto max-w-4xl">

        {/* Title */}
        <div className="mb-16 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold mb-3">
            Let’s set up your presence
          </h1>
          <p className="text-muted-foreground">
            This is how you’ll be revealed — slowly, beautifully.
          </p>
        </div>

        {/* Photo Upload */}
        <div className="mb-20 flex flex-col items-center">
          <label className="group relative flex h-48 w-48 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition hover:bg-white/10">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              <span className="text-muted-foreground text-sm text-center px-4">
                Upload a photo<br />for your reveal
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setImagePreview(URL.createObjectURL(e.target.files[0]))
              }
            />
          </label>

          <p className="mt-4 text-xs text-muted-foreground">
            This stays hidden until both of you say yes.
          </p>
        </div>

        {/* Inputs */}
        <div className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Your name" placeholder="What should we call you?" />
          <Input label="Age" type="number" placeholder="18+" />
          <Input label="Gender" placeholder="Your gender" />
          <Input label="Year / Class" placeholder="Eg: 2nd Year, CSE" />
        </div>

        
        {/* Templates */}
<div className="mb-20">
  <h2 className="mb-8 text-center text-xl font-medium">
    Choose how you’ll be revealed
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {templates.map((tpl) => (
      <button
        key={tpl.id}
        onClick={() => setSelectedTemplate(tpl.id)}
        className={`rounded-2xl border p-5 text-left transition-all duration-300
          ${
            selectedTemplate === tpl.id
              ? "border-primary bg-primary/10 shadow-lg shadow-primary/25"
              : "border-white/10 bg-white/5 hover:bg-white/10"
          }
        `}
      >
        {/* TEMPLATE PREVIEW */}
        <div className="h-40 w-full rounded-xl bg-white/10 p-4 backdrop-blur-md">

          {/* QUIET REVEAL */}
          {tpl.id === "minimal" && (
            <div className="flex flex-col gap-3">
              <div className="h-16 w-full rounded-lg bg-white/20" />
              <div className="h-3 w-24 rounded bg-white/30" />
              <div className="h-2 w-32 rounded bg-white/20" />
            </div>
          )}

          {/* SOFT CINEMATIC */}
          {tpl.id === "cinematic" && (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <div className="h-14 w-14 rounded-full bg-white/30 shadow-lg shadow-primary/30" />
              <div className="h-3 w-20 rounded bg-white/40" />
              <div className="h-2 w-28 rounded bg-white/25" />
            </div>
          )}

          {/* EXPRESSIVE */}
          {tpl.id === "expressive" && (
            <div className="relative h-full rounded-lg bg-gradient-to-br from-rose-400/40 to-pink-600/30 p-3">
              <div className="absolute top-3 right-3 h-3 w-3 rounded-full bg-white/60" />
              <div className="mt-20 h-3 w-24 rounded bg-white/80" />
            </div>
          )}
        </div>

        {/* TEXT */}
        <div className="mt-4">
          <h3 className="font-medium">{tpl.name}</h3>
          <p className="text-xs text-muted-foreground">{tpl.vibe}</p>
        </div>
      </button>
    ))}
  </div>
</div>


        {/* Continue */}
        <div className="text-center">
          <button className="rounded-full bg-primary px-10 py-3 font-semibold text-black transition hover:scale-[1.04] hover:shadow-xl hover:shadow-primary/30">
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== TEMPLATE PREVIEWS ===== */

function TemplatePreview({ type }) {
  if (type === "minimal") {
    return (
      <div className="h-32 rounded-xl bg-gradient-to-br from-white/15 to-black/30 p-3 flex flex-col justify-end">
        <div className="h-12 w-full rounded-md bg-white/10 mb-2" />
        <div className="h-2 w-24 rounded bg-white/25" />
      </div>
    );
  }

  if (type === "cinematic") {
    return (
      <div className="h-32 rounded-xl bg-gradient-to-br from-[#f3b6c0]/40 via-black to-black p-3 flex flex-col items-center justify-center">
        <div className="h-14 w-14 rounded-full bg-white/20 mb-2" />
        <div className="h-2 w-20 rounded bg-white/30" />
      </div>
    );
  }

  return (
    <div className="h-32 rounded-xl bg-gradient-to-br from-[#c96b7a]/50 to-black p-3 flex flex-col justify-between">
      <div className="h-6 w-6 rounded-full bg-white/30 self-end" />
      <div className="h-2 w-24 rounded bg-white/40" />
    </div>
  );
}

/* ===== INPUT ===== */

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-muted-foreground">{label}</label>
      <input
        {...props}
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none backdrop-blur-md transition focus:border-primary"
      />
    </div>
  );
}
