import BadgeCard from "../components/BadgeCard";
import XPBar from "../components/XPBar";

export default function Gamification() {
  const badges = [
    {
      title: "First assessment completed",
      description: "Completed the initial diagnostic without skipping.",
      earned: true
    },
    {
      title: "Concept streak",
      description: "Maintained a 7-day active practice streak.",
      earned: false
    },
    {
      title: "Concept master",
      description: "Reached 80%+ mastery on three core concepts.",
      earned: false
    }
  ];

  return (
    <div className="page-shell px-4 py-8 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
              Gamified progress
            </h1>
            <p className="mt-1 text-sm text-slate-400 max-w-2xl">
              XP, levels, and badges tuned to keep you accountable without
              distracting from the work.
            </p>
          </div>
        </div>
        <XPBar />
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)]">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-100">
              Achievements
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {badges.map((b) => (
                <BadgeCard key={b.title} {...b} />
              ))}
            </div>
          </div>
          <div className="glass-panel p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-100">
              Leaderboard (sample)
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex justify-between">
                <span>Anon-01</span>
                <span className="text-slate-500">Level 6 · 2850 XP</span>
              </li>
              <li className="flex justify-between">
                <span>Anon-02</span>
                <span className="text-slate-500">Level 5 · 2400 XP</span>
              </li>
              <li className="flex justify-between">
                <span>You</span>
                <span className="text-slate-500">Level 2 · 650 XP</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

