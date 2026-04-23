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

                    {Array.isArray(module.resources) && module.resources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-800/50 space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Learning Resources</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {module.resources.map((res, rIdx) => (
                            <a
                              key={`${res.url}-${rIdx}`}
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/50 transition-colors group"
                            >
                              <div className="text-primary-400 group-hover:text-primary-300">
                                {res.type === "video" && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                  </svg>
                                )}
                                {res.type === "article" && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                  </svg>
                                )}
                                {res.type === "documentation" && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10.804C3.057 15.094 4.245 14.804 5.5 14.804c1.179 0 2.307.252 3.328.707L9 4.804zM11 4.804V15.511c1.021-.455 2.149-.707 3.328-.707 1.255 0 2.443.29 3.5.804V4.804A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804z" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-[11px] font-medium text-slate-200 truncate group-hover:text-white">{res.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
