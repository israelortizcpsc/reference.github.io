import { useState, useEffect, useRef } from "react";

const STEPS = [
  {
    num: "01",
    title: "Define the single purpose",
    description: "Write one sentence that states what this thing does and for whom. If you can't write this sentence clearly, you haven't thought enough yet.",
    guideDesc: "Write one sentence that states what this thing does and for whom. If you can't write this sentence clearly, you haven't thought enough yet. Everything else flows from this.",
    inputType: "textarea",
    placeholder: 'e.g. "This loading screen builds anticipation before revealing the dashboard for the first time."',
    deliverable: "One sentence, written down",
    rows: 2,
    exampleLabel: "Example",
    exampleContent: '"This loading screen builds anticipation before revealing the dashboard for the first time."',
  },
  {
    num: "02",
    title: "Write all the content first",
    description: "Every heading, paragraph, button label, error message, empty state, and piece of micro-copy. Content dictates layout — not the other way around.",
    guideDesc: "Every heading, paragraph, button label, error message, empty state, and piece of micro-copy. Do it in a plain text file. Content dictates layout — not the other way around. This is the step that eliminates the \"I don't know what goes here\" feeling mid-build.",
    inputType: "textarea",
    placeholder: "Paste or write all your copy here — headlines, body text, CTAs, form labels, error/success messages, tooltips, footer links...",
    deliverable: "Complete copy document",
    rows: 8,
    exampleLabel: "Includes",
    exampleContent: "Headlines, body copy, CTAs, form labels, placeholder text, tooltips, success/error messages, loading text, 404 copy, footer links.",
  },
  {
    num: "03",
    title: "Map the user flow as a sequence",
    description: "Not wireframes. A numbered list of what happens, in order. This is your skeleton — the narrative the user moves through.",
    guideDesc: 'Not wireframes. A numbered list of what happens, in order. This is your skeleton — the narrative structure the user will move through. For something like a loading page, write out the exact beats: what appears first, second, third, and what the transition to the main content feels like.',
    inputType: "flow",
    placeholder: "e.g. User lands → sees headline + hero",
    deliverable: "Numbered step-by-step flow",
    exampleLabel: "Example",
    exampleFlow: [
      "User lands → sees headline + hero image",
      "Scrolls → three feature cards animate in",
      "Hits CTA → modal opens with signup form",
      "Submits → confirmation + redirect",
    ],
  },
  {
    num: "04",
    title: "Sketch low-fidelity layouts",
    description: "Pen and paper. Rough boxes. No colors, no fonts. The goal is spatial arrangement tied to your content and flow. Spend 10–15 minutes, not hours.",
    guideDesc: "Pen and paper. Rough boxes. No colors, no fonts, no polish. The goal is spatial arrangement tied to your content and flow. You should be able to \"walk through\" the experience in your head by looking at these. Spend 10–15 minutes, not hours.",
    inputType: "checklist",
    items: [
      "I've sketched the main layout on paper",
      "I can walk through the full experience from my sketches",
      "Spatial arrangement matches my content from Step 2",
      "Layout follows the flow from Step 3",
    ],
    deliverable: "Rough paper sketches",
  },
  {
    num: "05",
    title: "Collect visual references",
    description: "Find 3–5 screenshots of real sites or components that capture the feeling you want. Not to copy — to anchor your aesthetic decisions.",
    guideDesc: "Find 3–5 screenshots of real sites or components that capture the feeling you want. Not to copy — to anchor your aesthetic decisions before you're knee-deep in CSS and second-guessing every choice. Pin them somewhere visible while you work.",
    inputType: "references",
    placeholder: "Paste a URL or describe the reference...",
    deliverable: "3–5 pinned references",
  },
  {
    num: "06",
    title: "Lock your design constraints",
    description: "Pick your palette, type scale, and spacing system before opening the editor. This eliminates hundreds of micro-decisions that drain energy.",
    guideDesc: "Pick your color palette (2–3 colors max), type scale, and spacing system before opening the editor. This eliminates hundreds of micro-decisions that drain energy during development. Write these values down and commit to them.",
    inputType: "constraints",
    deliverable: "Design tokens / constraint sheet",
    exampleLabel: "Decide on",
    exampleContent: "2–3 colors, 1–2 typefaces, a spacing unit (e.g. 8px grid), max content width, and border-radius style.",
  },
];

/* ===================== SHARED COMPONENTS ===================== */

function StepProgress({ total, completed }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i < completed ? 24 : 16, height: 4, borderRadius: 2,
          background: i < completed ? "#c4450a" : "#d4cbbe",
          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        }} />
      ))}
    </div>
  );
}

/* ===================== INPUT COMPONENTS ===================== */

function FlowInput({ value = [], onChange }) {
  const [items, setItems] = useState(value.length > 0 ? value : [""]);
  const lastRef = useRef(null);
  const shouldFocus = useRef(false);

  useEffect(() => {
    if (shouldFocus.current && lastRef.current) { lastRef.current.focus(); shouldFocus.current = false; }
  }, [items.length]);

  const update = (idx, val) => { const n = [...items]; n[idx] = val; setItems(n); onChange(n.filter(Boolean)); };
  const add = () => { setItems([...items, ""]); shouldFocus.current = true; };
  const remove = (idx) => { if (items.length <= 1) return; const n = items.filter((_, i) => i !== idx); setItems(n); onChange(n.filter(Boolean)); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, idx) => (
        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#c4450a", opacity: 0.5, minWidth: 20, textAlign: "right" }}>{idx + 1}.</span>
          <input ref={idx === items.length - 1 ? lastRef : null} type="text" value={item}
            onChange={(e) => update(idx, e.target.value)}
            placeholder={idx === 0 ? "e.g. User lands → sees headline + hero" : "Next step..."}
            style={{ flex: 1, background: "transparent", border: "none", borderBottom: "1px solid #d4cbbe", padding: "8px 0", fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a", outline: "none" }}
          />
          {items.length > 1 && <button onClick={() => remove(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8a8070", fontSize: 18, padding: "0 4px" }}>×</button>}
        </div>
      ))}
      <button onClick={add} style={{ alignSelf: "flex-start", background: "none", border: "1px dashed #d4cbbe", padding: "6px 16px", borderRadius: 3, fontSize: 13, color: "#8a8070", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>+ Add step</button>
    </div>
  );
}

function ChecklistInput({ items, value = [], onChange }) {
  const toggle = (idx) => { onChange(value.includes(idx) ? value.filter((i) => i !== idx) : [...value, idx]); };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((item, idx) => (
        <label key={idx} onClick={() => toggle(idx)} style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", fontSize: 14, color: value.includes(idx) ? "#1a1a1a" : "#8a8070", transition: "color 0.2s" }}>
          <span style={{ width: 20, height: 20, minWidth: 20, border: value.includes(idx) ? "2px solid #c4450a" : "2px solid #d4cbbe", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", background: value.includes(idx) ? "#c4450a" : "transparent", color: "#f5f0e8", fontSize: 13, fontWeight: 700, transition: "all 0.2s", marginTop: 1 }}>
            {value.includes(idx) && "✓"}
          </span>
          {item}
        </label>
      ))}
    </div>
  );
}

function ReferencesInput({ value = [], onChange }) {
  const [items, setItems] = useState(value.length > 0 ? value : [{ url: "", note: "" }]);
  const update = (idx, field, val) => { const n = [...items]; n[idx] = { ...n[idx], [field]: val }; setItems(n); onChange(n.filter((r) => r.url || r.note)); };
  const add = () => setItems([...items, { url: "", note: "" }]);
  const remove = (idx) => { if (items.length <= 1) return; const n = items.filter((_, i) => i !== idx); setItems(n); onChange(n.filter((r) => r.url || r.note)); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {items.map((item, idx) => (
        <div key={idx} style={{ background: "#ebe4d8", borderRadius: 4, padding: 16, position: "relative" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#8a8070", marginBottom: 8 }}>Reference {idx + 1}</div>
          <input type="text" value={item.url} onChange={(e) => update(idx, "url", e.target.value)} placeholder="URL (optional)"
            style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #d4cbbe", padding: "6px 0", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "#1a1a1a", outline: "none", marginBottom: 8 }}
          />
          <input type="text" value={item.note} onChange={(e) => update(idx, "note", e.target.value)} placeholder="What feeling or pattern does this capture?"
            style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #d4cbbe", padding: "6px 0", fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a", outline: "none" }}
          />
          {items.length > 1 && <button onClick={() => remove(idx)} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer", color: "#8a8070", fontSize: 18 }}>×</button>}
        </div>
      ))}
      {items.length < 5 && <button onClick={add} style={{ alignSelf: "flex-start", background: "none", border: "1px dashed #d4cbbe", padding: "6px 16px", borderRadius: 3, fontSize: 13, color: "#8a8070", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>+ Add reference</button>}
    </div>
  );
}

function ConstraintsInput({ value = {}, onChange }) {
  const d = { colors: "", typefaces: "", spacing: "", maxWidth: "", borderRadius: "", notes: "", ...value };
  const update = (f, v) => onChange({ ...d, [f]: v });
  const fields = [
    { key: "colors", label: "Colors", placeholder: "e.g. #1a1a1a, #c4450a, #f5f0e8" },
    { key: "typefaces", label: "Typefaces", placeholder: "e.g. DM Serif Display + DM Sans" },
    { key: "spacing", label: "Spacing unit", placeholder: "e.g. 8px grid" },
    { key: "maxWidth", label: "Max content width", placeholder: "e.g. 800px" },
    { key: "borderRadius", label: "Border radius style", placeholder: "e.g. 4px (subtle) or 0 (sharp)" },
    { key: "notes", label: "Other constraints", placeholder: "Anything else — dark/light, no gradients, etc." },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {fields.map(({ key, label, placeholder }) => (
        <div key={key}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#8a8070", marginBottom: 6 }}>{label}</div>
          <input type="text" value={d[key]} onChange={(e) => update(key, e.target.value)} placeholder={placeholder}
            style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #d4cbbe", padding: "8px 0", fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a", outline: "none" }}
          />
        </div>
      ))}
    </div>
  );
}

/* ===================== GUIDE VIEW ===================== */

function GuideView() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 40px 80px" }}>
      <header style={{ marginBottom: 56, paddingBottom: 40, borderBottom: "2px solid #1a1a1a", position: "relative" }}>
        <div style={{ position: "absolute", bottom: -5, left: 0, right: 0, height: 1, background: "#1a1a1a" }} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#c4450a", marginBottom: 16, fontWeight: 500 }}>Reference Guide</div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(40px, 7vw, 64px)", lineHeight: 1.05, fontWeight: 400, letterSpacing: -1, marginBottom: 20 }}>
          Before You <em style={{ fontStyle: "italic", color: "#c4450a" }}>Code</em>
        </h1>
        <p style={{ fontSize: 17, color: "#8a8070", maxWidth: 520, lineHeight: 1.6 }}>Six steps to complete before opening your editor — so every project gets finished, not abandoned.</p>
      </header>

      {/* The Rule */}
      <div style={{ background: "#1a1a1a", color: "#f5f0e8", padding: "24px 32px", marginBottom: 56, borderRadius: 4, position: "relative" }}>
        <span style={{ position: "absolute", top: -12, left: 28, fontSize: 20, color: "#c4450a", background: "#f5f0e8", padding: "0 8px" }}>✦</span>
        <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, lineHeight: 1.55, fontWeight: 400 }}>
          If you can't narrate the entire experience out loud — from first impression to final interaction — without hesitating, you are not ready to code.
        </p>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {STEPS.map((step, idx) => (
          <div key={idx} style={{
            display: "grid", gridTemplateColumns: "64px 1fr", gap: "0 24px",
            padding: "36px 0",
            borderTop: "1px solid #d4cbbe",
            borderBottom: idx === STEPS.length - 1 ? "1px solid #d4cbbe" : "none",
          }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 48, color: "#c4450a", lineHeight: 1, opacity: 0.35, textAlign: "right", paddingTop: 2, userSelect: "none" }}>{step.num}</div>
            <div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, marginBottom: 10, lineHeight: 1.25 }}>{step.title}</h2>
              <p style={{ fontSize: 15, color: "#8a8070", marginBottom: 16, lineHeight: 1.65 }}>{step.guideDesc}</p>

              {step.exampleLabel && !step.exampleFlow && (
                <div style={{ background: "#ebe4d8", borderLeft: "3px solid #d4cbbe", padding: "14px 18px", marginBottom: 14, borderRadius: "0 4px 4px 0" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#8a8070", marginBottom: 6, fontWeight: 500 }}>{step.exampleLabel}</div>
                  <p style={{ fontSize: 14, color: "#1a1a1a", lineHeight: 1.6, fontStyle: "italic" }}>{step.exampleContent}</p>
                </div>
              )}

              {step.exampleFlow && (
                <div style={{ background: "#ebe4d8", borderLeft: "3px solid #d4cbbe", padding: "14px 18px", marginBottom: 14, borderRadius: "0 4px 4px 0" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#8a8070", marginBottom: 6, fontWeight: 500 }}>{step.exampleLabel}</div>
                  <ol style={{ fontSize: 14, color: "#1a1a1a", lineHeight: 1.6, fontStyle: "italic", paddingLeft: 20 }}>
                    {step.exampleFlow.map((f, i) => <li key={i} style={{ marginBottom: 3 }}>{f}</li>)}
                  </ol>
                </div>
              )}

              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: 0.5, color: "#c4450a", background: "#e8673220", padding: "6px 14px", borderRadius: 3, marginTop: 4, textTransform: "uppercase", fontWeight: 500 }}>
                <span>→</span> {step.deliverable}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Litmus Test */}
      <div style={{ marginTop: 56, padding: 32, border: "2px solid #1a1a1a", position: "relative" }}>
        <div style={{ position: "absolute", top: -13, left: 24, background: "#f5f0e8", padding: "0 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontWeight: 500, color: "#1a1a1a" }}>Litmus Test</div>
        <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, lineHeight: 1.5, textAlign: "center" }}>
          Can you narrate the <em style={{ color: "#c4450a", fontStyle: "italic" }}>entire experience</em> out loud — from first impression to final interaction — without hesitating?<br />If yes, open your editor. If no, go back.
        </p>
      </div>

      <footer style={{ marginTop: 48, textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#8a8070", letterSpacing: 1 }}>
        Content → Flow → Layout → Aesthetics → Code
      </footer>
    </div>
  );
}

/* ===================== PROJECT EDITOR ===================== */

function ProjectEditor({ project, onBack, onUpdate, isStepComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const containerRef = useRef(null);

  const step = STEPS[currentStep];
  const stepData = project.steps[currentStep] || {};
  const completedCount = STEPS.reduce((a, _, i) => a + (isStepComplete(project, i) ? 1 : 0), 0);
  const allComplete = completedCount === 6;

  const goToStep = (idx) => {
    setCurrentStep(idx);
    if (containerRef.current) containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateStepData = (idx, data) => {
    const newSteps = project.steps.map((s, i) => (i === idx ? data : s));
    onUpdate({ ...project, steps: newSteps });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{
        borderBottom: "1px solid #d4cbbe", padding: "14px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12, position: "sticky", top: 0, background: "#f5f0e8", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#8a8070", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>← Back</button>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, fontWeight: 400 }}>{project.name}</span>
        </div>
        <StepProgress total={6} completed={completedCount} />
      </div>

      {/* Step pills */}
      <div style={{ padding: "16px 28px", display: "flex", gap: 6, overflowX: "auto", borderBottom: "1px solid #d4cbbe" }}>
        {STEPS.map((s, idx) => {
          const complete = isStepComplete(project, idx);
          const active = idx === currentStep;
          return (
            <button key={idx} onClick={() => goToStep(idx)} style={{
              background: active ? "#1a1a1a" : complete ? "#c4450a15" : "transparent",
              color: active ? "#f5f0e8" : complete ? "#c4450a" : "#8a8070",
              border: active ? "none" : "1px solid #d4cbbe",
              borderRadius: 4, padding: "8px 14px", fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace", cursor: "pointer",
              whiteSpace: "nowrap", transition: "all 0.2s", fontWeight: 500,
            }}>
              {s.num} {complete && !active ? "✓" : ""}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div ref={containerRef} style={{ flex: 1, overflow: "auto", padding: "40px 28px 80px", maxWidth: 700, margin: "0 auto", width: "100%" }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 48, color: "#c4450a", opacity: 0.25, marginBottom: -8 }}>{step.num}</div>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 400, marginBottom: 12, lineHeight: 1.2 }}>{step.title}</h2>
        <p style={{ fontSize: 15, color: "#8a8070", lineHeight: 1.65, marginBottom: 28, maxWidth: 540 }}>{step.description}</p>

        <div style={{ background: "#fff", borderRadius: 6, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: 24 }}>
          {step.inputType === "textarea" && (
            <textarea value={stepData.value || ""} onChange={(e) => updateStepData(currentStep, { value: e.target.value })}
              placeholder={step.placeholder} rows={step.rows || 4}
              style={{ width: "100%", background: "transparent", border: "none", resize: "vertical", fontSize: 15, lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a", outline: "none", minHeight: step.rows ? step.rows * 28 : 112 }}
            />
          )}
          {step.inputType === "flow" && <FlowInput value={stepData.value || []} onChange={(v) => updateStepData(currentStep, { value: v })} />}
          {step.inputType === "checklist" && <ChecklistInput items={step.items} value={stepData.value || []} onChange={(v) => updateStepData(currentStep, { value: v })} />}
          {step.inputType === "references" && <ReferencesInput value={stepData.value || []} onChange={(v) => updateStepData(currentStep, { value: v })} />}
          {step.inputType === "constraints" && <ConstraintsInput value={stepData.value || {}} onChange={(v) => updateStepData(currentStep, { value: v })} />}
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 0.5, color: "#c4450a", background: "#c4450a12", padding: "6px 14px", borderRadius: 3, textTransform: "uppercase", fontWeight: 500, marginBottom: 32 }}>
          <span>→</span> {step.deliverable}
          {isStepComplete(project, currentStep) && <span style={{ marginLeft: 6 }}>✓</span>}
        </div>

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, borderTop: "1px solid #d4cbbe" }}>
          <button onClick={() => goToStep(currentStep - 1)} disabled={currentStep === 0}
            style={{ background: "none", border: "none", fontSize: 14, color: currentStep === 0 ? "#d4cbbe" : "#8a8070", cursor: currentStep === 0 ? "default" : "pointer", fontFamily: "'DM Sans', sans-serif", padding: "8px 0" }}>
            ← Previous
          </button>
          {currentStep < 5 ? (
            <button onClick={() => goToStep(currentStep + 1)}
              style={{ background: "#1a1a1a", color: "#f5f0e8", border: "none", padding: "10px 24px", borderRadius: 4, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
              Next step →
            </button>
          ) : (
            <div style={{ textAlign: "right" }}>
              {allComplete ? (
                <div style={{ background: "#c4450a", color: "#f5f0e8", padding: "12px 28px", borderRadius: 4, fontFamily: "'DM Serif Display', serif", fontSize: 18 }}>
                  You're ready to code ✦
                </div>
              ) : (
                <div style={{ fontSize: 14, color: "#8a8070", fontStyle: "italic" }}>Complete all steps to unlock</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===================== MAIN APP ===================== */

export default function App() {
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [view, setView] = useState("home"); // home | guide | project
  const [tab, setTab] = useState("projects"); // projects | guide (on home)
  const [newName, setNewName] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("predev-projects");
        if (result && result.value) setProjects(JSON.parse(result.value));
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try { await window.storage.set("predev-projects", JSON.stringify(projects)); } catch (e) {}
    })();
  }, [projects, loaded]);

  const isStepComplete = (project, idx) => {
    const data = project.steps[idx];
    if (!data) return false;
    switch (idx) {
      case 0: return !!(data.value && data.value.trim().length > 10);
      case 1: return !!(data.value && data.value.trim().length > 20);
      case 2: return Array.isArray(data.value) && data.value.filter(Boolean).length >= 2;
      case 3: return Array.isArray(data.value) && data.value.length >= 3;
      case 4: return Array.isArray(data.value) && data.value.filter((r) => r.url || r.note).length >= 1;
      case 5: { const v = data.value || {}; return !!(v.colors && v.typefaces); }
      default: return false;
    }
  };

  const getCompletedCount = (project) => STEPS.reduce((a, _, i) => a + (isStepComplete(project, i) ? 1 : 0), 0);

  const createProject = () => {
    if (!newName.trim()) return;
    const project = { id: Date.now().toString(), name: newName.trim(), createdAt: new Date().toISOString(), steps: [{}, {}, {}, {}, {}, {}] };
    setProjects([project, ...projects]);
    setActiveProjectId(project.id);
    setView("project");
    setNewName("");
  };

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProjectId === id) { setView("home"); setActiveProjectId(null); }
  };

  const updateProject = (updated) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  if (!loaded) return null;

  // --- PROJECT EDITOR ---
  if (view === "project") {
    const project = projects.find((p) => p.id === activeProjectId);
    if (!project) { setView("home"); return null; }
    return (
      <div style={{ minHeight: "100vh", background: "#f5f0e8", fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <ProjectEditor
          project={project}
          onBack={() => { setView("home"); setActiveProjectId(null); }}
          onUpdate={updateProject}
          isStepComplete={isStepComplete}
        />
      </div>
    );
  }

  // --- GUIDE VIEW ---
  if (view === "guide") {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f0e8", fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        {/* Sticky back bar */}
        <div style={{ borderBottom: "1px solid #d4cbbe", padding: "14px 28px", position: "sticky", top: 0, background: "#f5f0e8", zIndex: 10 }}>
          <button onClick={() => setView("home")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#8a8070", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>← Back</button>
        </div>
        <GuideView />
      </div>
    );
  }

  // --- HOME VIEW ---
  const tabStyle = (active) => ({
    background: "none", border: "none", cursor: "pointer",
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: 1.5,
    textTransform: "uppercase", fontWeight: 500,
    color: active ? "#1a1a1a" : "#8a8070",
    borderBottom: active ? "2px solid #c4450a" : "2px solid transparent",
    padding: "12px 4px", marginRight: 24,
    transition: "all 0.2s",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "60px 32px 80px" }}>
        {/* Header */}
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#c4450a", marginBottom: 16, fontWeight: 500 }}>Pre-Dev Checklist</div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(36px, 7vw, 56px)", lineHeight: 1.08, fontWeight: 400, letterSpacing: -1, marginBottom: 16 }}>
          Before You <em style={{ fontStyle: "italic", color: "#c4450a" }}>Code</em>
        </h1>
        <p style={{ fontSize: 16, color: "#8a8070", maxWidth: 460, lineHeight: 1.6, marginBottom: 36 }}>
          Six steps to complete before opening your editor — so every project gets finished, not abandoned.
        </p>

        {/* Tabs */}
        <div style={{ borderBottom: "1px solid #d4cbbe", marginBottom: 36, display: "flex" }}>
          <button style={tabStyle(tab === "projects")} onClick={() => setTab("projects")}>My Projects</button>
          <button style={tabStyle(tab === "guide")} onClick={() => setTab("guide")}>The Guide</button>
        </div>

        {tab === "guide" && (
          <div>
            <p style={{ fontSize: 15, color: "#8a8070", lineHeight: 1.65, marginBottom: 24 }}>
              The full reference for every step — what to do, why it matters, and what "done" looks like.
            </p>
            <button onClick={() => setView("guide")} style={{
              background: "#1a1a1a", color: "#f5f0e8", border: "none",
              padding: "14px 28px", borderRadius: 4, fontSize: 15,
              fontFamily: "'DM Serif Display', serif", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              Read the full guide <span style={{ opacity: 0.5 }}>→</span>
            </button>
          </div>
        )}

        {tab === "projects" && (
          <div>
            {/* New Project */}
            <div style={{ background: "#1a1a1a", borderRadius: 6, padding: 28, marginBottom: 36 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#8a8070", marginBottom: 14 }}>New Project</div>
              <div style={{ display: "flex", gap: 12 }}>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createProject()}
                  placeholder="What are you building?"
                  style={{ flex: 1, background: "transparent", border: "none", borderBottom: "1px solid #444", padding: "10px 0", fontSize: 16, fontFamily: "'DM Sans', sans-serif", color: "#f5f0e8", outline: "none" }}
                />
                <button onClick={createProject} disabled={!newName.trim()}
                  style={{ background: newName.trim() ? "#c4450a" : "#333", color: "#f5f0e8", border: "none", padding: "10px 24px", borderRadius: 4, fontSize: 14, fontWeight: 500, cursor: newName.trim() ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s" }}>
                  Start
                </button>
              </div>
            </div>

            {/* List */}
            {projects.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {projects.map((project) => {
                  const count = getCompletedCount(project);
                  const done = count === 6;
                  return (
                    <div key={project.id}
                      onClick={() => { setActiveProjectId(project.id); setView("project"); }}
                      style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", background: "#ebe4d8", borderRadius: 4, cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#e4dcd0")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#ebe4d8")}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
                          {project.name}
                          {done && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 1, background: "#c4450a", color: "#f5f0e8", padding: "2px 8px", borderRadius: 2, textTransform: "uppercase" }}>Ready to code</span>}
                        </div>
                        <StepProgress total={6} completed={count} />
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#8a8070", fontSize: 18, padding: "0 4px", opacity: 0.5 }}
                        title="Delete project">×</button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: 15, color: "#8a8070", fontStyle: "italic" }}>No projects yet. Name one above to get started.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
