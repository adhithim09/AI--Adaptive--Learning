import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizCard from "../components/QuizCard";
import ProgressBar from "../components/ProgressBar";
import { useProgress } from "../context/ProgressContext";
import { useAuth } from "../context/AuthContext";
import { CourseAPI } from "../services/api";

export default function InitialAssessment() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [generatingCourse, setGeneratingCourse] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const { addXp } = useProgress();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      // Demo mode: local stub questions (no backend call)
      setQuestions([
        {
          id: "q1",
          text: "Which loss function is commonly used for regression problems?",
          concept: "Regression",
          options: [
            { id: "a", label: "Cross-entropy loss" },
            { id: "b", label: "Mean squared error" },
            { id: "c", label: "Hinge loss" },
            { id: "d", label: "KL divergence" }
          ]
        },
        {
          id: "q2",
          text: "In binary classification, which metric is most appropriate when classes are highly imbalanced?",
          concept: "Classification",
          options: [
            { id: "a", label: "Accuracy" },
            { id: "b", label: "Precision" },
            { id: "c", label: "Recall or F1-score" },
            { id: "d", label: "MSE" }
          ]
        },
        {
          id: "q3",
          text: "Backpropagation primarily relies on which mathematical operation?",
          concept: "Neural Networks",
          options: [
            { id: "a", label: "Matrix inversion" },
            { id: "b", label: "Gradient computation via chain rule" },
            { id: "c", label: "Fourier transform" },
            { id: "d", label: "Sampling" }
          ]
        }
      ]);
    };
    fetchQuestions();
  }, []);

  const handleSelect = (optionId) => {
    const q = questions[index];
    setAnswers((prev) => ({ ...prev, [q.id]: optionId }));
  };

  const handleNext = () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");
      // Demo mode: local scoring stub (no backend call)
      const stub = {
        concepts: [
          { name: "Regression", score: 80 },
          { name: "Classification", score: 60 },
          { name: "Neural Networks", score: 30 }
        ]
      };
      setResults(stub);
      addXp(120);
    } catch (err) {
      setError(
        err?.message || "Unable to submit assessment. Please retry."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateCourse = async () => {
    if (!results) return;

    const selectedSubject = Array.isArray(user?.subjects) && user.subjects.length
      ? user.subjects[0]
      : "General";

    try {
      setGeneratingCourse(true);
      setError("");
      await CourseAPI.generate({
        subject: selectedSubject,
        assessmentResults: results
      });
      navigate("/course");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to generate personalized course. Please retry.";
      setError(message);
    } finally {
      setGeneratingCourse(false);
    }
  };

  const current = questions[index];

  return (
    <div className="page-shell px-4 py-8 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
              Initial assessment
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Short diagnostic to estimate your baseline across selected
              subjects.
            </p>
          </div>
          <div className="hidden md:block w-52">
            <ProgressBar
              label="Completion"
              value={
                questions.length
                  ? ((index + 1) / questions.length) * 100
                  : 0
              }
            />
          </div>
        </div>
        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-100">
            {error}
          </div>
        )}

        {!results && current && (
          <>
            <QuizCard
              question={current}
              index={index}
              total={questions.length}
              selectedOptionId={answers[current.id]}
              onSelect={handleSelect}
            />
            <div className="flex justify-end gap-2">
              {index < questions.length - 1 && (
                <button
                  onClick={handleNext}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-200 hover:bg-slate-900 transition-colors"
                >
                  Next question
                </button>
              )}
              {index === questions.length - 1 && (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-sm font-medium text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  Submit assessment
                </button>
              )}
            </div>
          </>
        )}

        {results && (
          <div className="grid gap-5 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)]">
            <div className="glass-panel p-5 space-y-4">
              <h2 className="text-sm font-semibold text-slate-100">
                Concept-wise performance
              </h2>
              <div className="space-y-3">
                {results.concepts.map((c) => (
                  <ProgressBar
                    key={c.name}
                    label={c.name}
                    value={c.score}
                    subtle
                  />
                ))}
              </div>
            </div>
            <div className="card-muted p-4 space-y-3">
              <h3 className="text-sm font-semibold text-slate-100">
                Next steps
              </h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  - We will prioritize concepts below 60% in your first learning
                  cycle.
                </li>
                <li>
                  - XP and levels will update as you close gaps and complete
                  practice sets.
                </li>
                <li>
                  - You can always retake diagnostics from the assessment page.
                </li>
              </ul>
              <button
                onClick={handleGenerateCourse}
                disabled={generatingCourse}
                className="w-full mt-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-sm font-medium text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
              >
                {generatingCourse && (
                  <span className="h-4 w-4 rounded-full border-2 border-white/50 border-t-white animate-spin" />
                )}
                {generatingCourse
                  ? "Generating personalized course..."
                  : "Generate Personalized Course"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

