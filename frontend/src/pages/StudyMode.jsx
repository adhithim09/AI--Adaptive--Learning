import ReactFlow, { Background, Controls, MiniMap } from "react-flow-renderer";
import PomodoroTimer from "../components/PomodoroTimer";

const nodes = [
  {
    id: "1",
    data: { label: "Supervised learning" },
    position: { x: 0, y: 0 },
    style: {
      background: "#020617",
      color: "#e2e8f0",
      border: "1px solid #1e293b",
      borderRadius: 999,
      paddingInline: 16,
      paddingBlock: 6,
      fontSize: 11
    }
  },
  {
    id: "2",
    data: { label: "Loss functions" },
    position: { x: -80, y: 90 },
    style: {
      background: "#020617",
      color: "#e2e8f0",
      border: "1px solid #1e293b",
      borderRadius: 999,
      paddingInline: 12,
      paddingBlock: 5,
      fontSize: 11
    }
  },
  {
    id: "3",
    data: { label: "Optimization" },
    position: { x: 80, y: 90 },
    style: {
      background: "#020617",
      color: "#e2e8f0",
      border: "1px solid #1e293b",
      borderRadius: 999,
      paddingInline: 12,
      paddingBlock: 5,
      fontSize: 11
    }
  }
];

const edges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3", animated: true }
];

export default function StudyMode() {
  const flashcards = [
    {
      front: "Define bias-variance tradeoff.",
      back: "Tradeoff between error from erroneous assumptions (bias) and error from sensitivity to fluctuations in the training set (variance)."
    },
    {
      front: "Why is regularization used?",
      back: "To discourage overly complex models, reduce variance, and improve generalization."
    }
  ];

  return (
    <div className="page-shell px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
              Study mode
            </h1>
            <p className="mt-1 text-sm text-slate-400 max-w-2xl">
              Focused workspace with Pomodoro, notes, flashcards, and a live
              concept map.
            </p>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)]">
          <div className="space-y-4">
            <PomodoroTimer />
            <div className="glass-panel p-4 space-y-3">
              <h2 className="text-sm font-semibold text-slate-100">
                Concept notes
              </h2>
              <textarea
                rows={7}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none focus:border-primary-500 resize-none"
                placeholder="Capture key definitions, derivations, and edge cases here..."
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="glass-panel p-4 space-y-3">
              <h2 className="text-sm font-semibold text-slate-100">
                Flashcards (active recall)
              </h2>
              <div className="space-y-2 text-xs text-slate-300">
                {flashcards.map((card, idx) => (
                  <details
                    key={idx}
                    className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2"
                  >
                    <summary className="cursor-pointer">{card.front}</summary>
                    <p className="mt-2 text-slate-400">{card.back}</p>
                  </details>
                ))}
              </div>
            </div>
            <div className="card-muted h-64 overflow-hidden">
              <ReactFlow nodes={nodes} edges={edges} fitView>
                <MiniMap />
                <Controls />
                <Background gap={12} color="#020617" />
              </ReactFlow>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

