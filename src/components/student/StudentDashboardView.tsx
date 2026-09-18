import React from 'react';
import {
  FlaskConical,
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { CurrentUser, CompetencyKey, COMPETENCY_DIMENSIONS, Assignment, StudentSubmission } from '../../types';
import { CompetencyRadar } from '../analytics/CompetencyRadar';
import { EXPERIMENTS } from '../../data/mockData';

interface StudentDashboardViewProps {
  currentUser: CurrentUser;
  competencyScores: Record<CompetencyKey, number>;
  assignments: Assignment[];
  submissions: StudentSubmission[];
  onNavigate: (path: string) => void;
  onSelectExperiment: (expId: string) => void;
  isDark: boolean;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  currentUser,
  competencyScores,
  assignments,
  submissions,
  onNavigate,
  onSelectExperiment,
  isDark,
}) => {
  // Calculate aggregate practical mastery
  const overallMastery = Math.round(
    (Object.keys(COMPETENCY_DIMENSIONS) as CompetencyKey[]).reduce(
      (sum, key) => sum + (competencyScores[key] || 75) * COMPETENCY_DIMENSIONS[key].weight,
      0
    )
  );

  // Student assigned experiments
  const assignedExperiments = EXPERIMENTS.slice(0, 3);
  const activeAssignments = assignments.filter((a) => a.status === 'active');
  const studentSubmissions = submissions.filter(
    (s) => s.studentId === currentUser.id || s.studentName.toLowerCase() === currentUser.name.toLowerCase()
  );

  return (
    <div id="student-dashboard-root" className="space-y-6">
      {/* 1. Welcome & High-Impact Competency Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs sm:flex-row sm:items-center transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/80 px-2.5 py-0.5 text-xs font-semibold text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
              <Sparkles className="h-3 w-3 text-amber-600 dark:text-amber-400" />
              Student Laboratory Workspace
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              ID: {currentUser.enrollmentCode || currentUser.id.slice(0, 10)}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-3xl">
            Welcome back, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="mt-1 text-xs text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
            Continuous empirical assessment hub for syllabus-aligned virtual laboratory experiments, auto-graded physics apparatus tasks, and AI viva defenses.
          </p>
        </div>

        {/* Overall Practical Mastery Score */}
        <div className="flex sm:flex-col items-center justify-between sm:justify-center rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 p-4 text-center min-w-[160px]">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Overall Competency
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-amber-400">
              {overallMastery}%
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">mastery</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" /> +4.2% this week
          </span>
        </div>
      </div>

      {/* 2. Grid: Assigned Experiments & Upcoming Assignments */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Assigned Experiments (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-amber-500" />
              <span>Assigned Experiments</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('/student/experiments')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {assignedExperiments.map((exp) => (
              <div
                key={exp.id}
                className="flex flex-col justify-between rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs hover:border-amber-400 dark:hover:border-amber-600 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="rounded bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 text-[10px] font-mono font-bold text-stone-700 dark:text-stone-300">
                      {exp.code}
                    </span>
                    <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                      {exp.subject}
                    </span>
                  </div>
                  <h3 className="mt-2 text-xs font-bold text-stone-900 dark:text-stone-100 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {exp.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                    {exp.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[10px] text-stone-500 dark:text-stone-400">
                    <Clock className="h-3 w-3" />
                    {exp.durationMinutes}m
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectExperiment(exp.id);
                      onNavigate('/student/experiments');
                    }}
                    className="flex items-center gap-1 rounded-md bg-stone-900 dark:bg-amber-500 px-2.5 py-1 text-[11px] font-semibold text-white dark:text-stone-950 shadow-xs hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    <span>Launch</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recommended Practice & Continue Learning Banner */}
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/40 dark:via-amber-950/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-stone-950 font-bold">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  Recommended Practice: Convex Lens Optical Bench
                </h4>
                <p className="text-[11px] text-stone-600 dark:text-stone-400">
                  Refine measurement precision and graph regression on focal length (1/u vs 1/v).
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onSelectExperiment('exp-convex-lens');
                onNavigate('/student/experiments');
              }}
              className="shrink-0 flex items-center gap-1 rounded-lg bg-stone-900 dark:bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors"
            >
              <span>Start Lab</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Upcoming Assignments & Deadlines (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-500" />
              <span>Upcoming Deadlines</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('/student/assignments')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {activeAssignments.slice(0, 3).map((asg) => (
              <div
                key={asg.id}
                className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-3.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/70 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                    Due {new Date(asg.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">
                    {asg.totalMarks} marks
                  </span>
                </div>
                <h3 className="mt-1.5 text-xs font-bold text-stone-900 dark:text-stone-100">
                  {asg.title}
                </h3>
                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500 dark:text-stone-400">
                    Attempts: {asg.attemptsAllowed} max
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectExperiment(asg.experimentId);
                      onNavigate('/student/experiments');
                    }}
                    className="font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Open Task →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Competency Progress Radar & Recent Results */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Radar Competency Chart */}
        <div className="lg:col-span-1 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Competency Radar</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('/student/competencies')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Details
            </button>
          </div>
          <div className="mt-3">
            <CompetencyRadar
              scores={competencyScores}
              benchmarkScores={{
                setup_adherence: 82,
                measurement_precision: 78,
                data_interpretation: 75,
                troubleshooting_safety: 80,
                experimental_design: 76,
              }}
              studentName="Your Score"
              height={260}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Competency Dimensions Breakdown & Recent Results (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-500" />
              <span>Competency Breakdown & Mastery Goals</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('/student/progress')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Full Progress
            </button>
          </div>

          <div className="space-y-3">
            {(Object.keys(COMPETENCY_DIMENSIONS) as CompetencyKey[]).map((dimKey) => {
              const dimension = COMPETENCY_DIMENSIONS[dimKey];
              const score = competencyScores[dimKey] || 75;
              return (
                <div key={dimKey} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {dimension.label}
                    </span>
                    <span className="font-bold font-mono text-stone-900 dark:text-amber-400">
                      {score}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">
                    {dimension.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Recent Lab Results */}
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
            <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-2">
              Recent Verified Lab Submissions
            </h3>
            {studentSubmissions.length > 0 ? (
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {studentSubmissions.slice(0, 2).map((sub) => (
                  <div key={sub.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-stone-800 dark:text-stone-200">
                        {EXPERIMENTS.find((e) => e.id === sub.experimentId)?.title || 'Virtual Lab'}
                      </p>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400">
                        Submitted on {new Date(sub.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 text-xs font-bold rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        {sub.totalScore}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 dark:text-stone-400">
                No submissions yet. Launch an assigned experiment to start earning verified competency credits!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
