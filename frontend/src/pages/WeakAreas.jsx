import { useEffect, useState } from "react";

export default function WeakAreas() {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const fetchAreas = async () => {
      // Demo mode: local stub (no backend call)
      setAreas([
        {
          concept: "Backpropagation",
          weakness: "High",
          recommended: ["Gradient Descent", "Partial Derivatives"]
        },
        {
          concept: "Graph traversal",
          weakness: "Medium",
          recommended: ["Breadth-first search", "Depth-first search"]
        }
      ]);
    };
    fetchAreas();
  }, []);

  return (
    <div className="page-shell px-4 py-8 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
              Weak area analysis
            </h1>
            <p className="mt-1 text-sm text-slate-400 max-w-2xl">
              Concepts prioritized for remediation based on recent assessment
              and practice history.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {areas.map((area) => (
            <div key={area.concept} className="glass-panel p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-100">
                  {area.concept}
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full border border-amber-500/50 bg-amber-500/10 text-amber-200">
                  {area.weakness} priority
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Recommended prerequisites:
              </div>
              <ul className="text-xs text-slate-300 space-y-1">
                {area.recommended.map((r) => (
                  <li key={r}>- {r}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

