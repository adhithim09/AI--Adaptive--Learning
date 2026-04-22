import { useEffect, useState } from "react";
import { CourseAPI } from "../services/api";

export default function CourseDashboard() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await CourseAPI.myCourse();
        setCourse(data);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load your course right now.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  return (
    <div className="page-shell px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="glass-panel p-5 md:p-6 shadow-sm shadow-slate-950/30">
          <p className="text-xs uppercase tracking-wide text-primary-300">Course Dashboard</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-50">
            {course?.title || "Personalized learning path"}
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            {course?.description ||
              "Your generated course appears here once available."}
          </p>
        </header>

        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300 shadow-sm shadow-slate-950/30">
            Loading your latest course...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100 shadow-sm shadow-red-950/30">
            {error}
          </div>
        )}

        {!loading && !error && course && (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.isArray(course.modules) &&
              course.modules.map((module, idx) => (
                <article
                  key={`${module.title}-${idx}`}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm shadow-slate-950/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-base font-semibold text-slate-100">{module.title}</h2>
                    <span className="rounded-full border border-primary-500/40 bg-primary-500/10 px-2.5 py-0.5 text-[11px] font-medium text-primary-200">
                      {module.level}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Estimated time: <span className="text-slate-300">{module.estimatedTime}</span>
                  </p>

                  <div className="mt-4">
                    <p className="text-xs font-medium text-slate-300">Concepts</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-400">
                      {Array.isArray(module.concepts) &&
                        module.concepts.map((concept) => <li key={concept}>{concept}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
          </section>
        )}
      </div>
    </div>
  );
}
