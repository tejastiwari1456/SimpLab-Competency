import React from 'react';
import { TrendingUp, Award, CheckCircle2, ShieldCheck, Clock, BookOpen } from 'lucide-react';
import { CompetencyKey, COMPETENCY_DIMENSIONS, StudentSubmission } from '../../types';

interface StudentProgressViewProps {
  competencyScores: Record<CompetencyKey, number>;
  submissions: StudentSubmission[];
}

export const StudentProgressView: React.FC<StudentProgressViewProps> = ({
  competencyScores,
  submissions,
}) => {
  return (
    <div id="student-progress-view" className="space-y-6">
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs transition-colors">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            <TrendingUp className="h-3 w-3" />
            Learning Curve & Mastery
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400">Continuous Assessment History</span>
        </div>
        <h2 className="mt-1 text-xl font-bold text-stone-900 dark:text-stone-100">
          Practical Competency Trajectory
        </h2>
        <p className="text-xs text-stone-600 dark:text-stone-300">
          Track empirical precision gains, apparatus setup fidelity, and viva defense evaluations across your semester.
        </p>
      </div>

      {/* Badges & Milestones */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 font-bold">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">Precision Calibrator</span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">Zero error elimination verified</span>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-bold">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">AI Viva Defended</span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">5 practical vivas successfully defended</span>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 font-bold">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">Syllabus Complete</span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">100% of required lab units logged</span>
          </div>
        </div>
      </div>

      {/* Submission Log */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3">
          Verified Practical Assessment Log
        </h3>
        {submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-stone-100 dark:border-stone-800 text-stone-500 dark:text-stone-400 font-medium">
                <tr>
                  <th className="pb-2">Session ID</th>
                  <th className="pb-2">Experiment</th>
                  <th className="pb-2">Score</th>
                  <th className="pb-2">Readings Taken</th>
                  <th className="pb-2">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="text-stone-800 dark:text-stone-200">
                    <td className="py-2.5 font-mono text-[11px] text-stone-500">{sub.id.slice(0, 12)}</td>
                    <td className="py-2.5 font-semibold">{sub.experimentId}</td>
                    <td className="py-2.5">
                      <span className="rounded bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        {sub.totalScore}%
                      </span>
                    </td>
                    <td className="py-2.5">{sub.dataReadingsCount} data points</td>
                    <td className="py-2.5 text-stone-500">{new Date(sub.submittedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-stone-500 dark:text-stone-400">
            No lab submission records available.
          </p>
        )}
      </div>
    </div>
  );
};
