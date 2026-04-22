import { useEffect, useState } from "react";
import { CourseAPI } from "../services/api";

export default function Course() {
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

  if (loading) {
    return (
      <div className="page-shell px-4 py-8 md:px-8">
        <div className="max-w-5xl mx-auto glass-panel p-5 text-sm text-slate-300">
          Loading your personalized course...
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell px-4 py-8 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
            Personalized course
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Your latest generated learning path.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-100">
            {error}
          </div>
        )}

        {course && (
          <div className="space-y-4">
            <div className="glass-panel p-5 space-y-2">
              <h2 className="text-lg font-semibold text-slate-100">{course.title}</h2>
              <p className="text-sm text-slate-300">{course.description}</p>
              <p className="text-xs text-slate-500">Subject: {course.subject}</p>
            </div>

            <div className="grid gap-3">
              {Array.isArray(course.modules) &&
                course.modules.map((module, idx) => (
                  <div key={`${module.title}-${idx}`} className="card-muted p-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-100">{module.title}</h3>
                      <span className="text-[11px] px-2 py-0.5 rounded-full border border-primary-500/40 bg-primary-500/10 text-primary-200">
                        {module.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Estimated time: {module.estimatedTime}</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(module.concepts) &&
                        module.concepts.map((concept) => (
                          <span
                            key={concept}
                            className="text-[11px] px-2 py-0.5 rounded-full border border-slate-700 bg-slate-900/70 text-slate-300"
                          >
                            {concept}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
