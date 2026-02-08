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
    <div className="relative min-h-screen bg-bg text-foreground overflow-hidden px-6 py-24">
      
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/3 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

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

        {/* Basic Info */}
        <div className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Your name" placeholder="What should we call you?" />
          <Input label="Age" type="number" placeholder="18+" />
          <Input label="Gender" placeholder="Your gender" />
          <Input label="Year / Class" placeholder="Eg: 2nd Year, CSE" />
        </div>

        {/* Template Selection */}
        <div className="mb-20">
          <h2 className="mb-6 text-center text-xl font-medium">
            Choose how you’ll be revealed
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`group relative rounded-2xl border p-5 text-left transition-all
                  ${
                    selectedTemplate === tpl.id
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }
                `}
              >
                <div className={`template-preview ${tpl.id}`} />
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
