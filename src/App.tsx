import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Compass,
  CheckCircle2,
  Users,
  BookOpen,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  Award,
  BookMarked,
  Layers,
  HelpCircle,
  BarChart3,
  Cpu,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { OhmsLawSim } from './components/simulations/OhmsLawSim';
import { TitrationSim } from './components/simulations/TitrationSim';
import { PhotoelectricSim } from './components/simulations/PhotoelectricSim';
import { ConvexLensSim } from './components/simulations/ConvexLensSim';
import { PcrGelSim } from './components/simulations/PcrGelSim';
import { AutoGradedTaskPanel } from './components/tasks/AutoGradedTaskPanel';
import { ScenarioModuleView } from './components/scenarios/ScenarioModuleView';
import { StudentAnalytics } from './components/analytics/StudentAnalytics';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { LabMentorChat } from './components/mentor/LabMentorChat';
import {
  EXPERIMENTS,
  SCENARIO_MODULES,
  INITIAL_CLASSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
} from './data/mockData';
import {
  UserRole,
  CompetencyKey,
  Assignment,
  StudentSubmission,
  COMPETENCY_DIMENSIONS,
} from './types';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('simlab_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync dark class on root document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('simlab_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('simlab_theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  // Navigation and Role
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('experiments');
  const [selectedExpId, setSelectedExpId] = useState<string>('exp-convex-lens');
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  // Health and AI status
  const [geminiActive, setGeminiActive] = useState<boolean>(false);

  // App State
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(INITIAL_SUBMISSIONS);
  const classes = INITIAL_CLASSES;

  // Active student's demonstrated competencies
  const [studentCompetencyScores, setStudentCompetencyScores] = useState<Record<CompetencyKey, number>>({
    setup_adherence: 95,
    measurement_precision: 88,
    data_interpretation: 94,
    troubleshooting_safety: 90,
    experimental_design: 92,
  });

  // Check health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.geminiConfigured) {
          setGeminiActive(true);
        }
      })
      .catch(() => {
        setGeminiActive(false);
      });
  }, []);

  const activeExperiment = EXPERIMENTS.find((e) => e.id === selectedExpId) || EXPERIMENTS[0];
  const activeScenario = SCENARIO_MODULES.find((s) => s.id === activeScenarioId);

  // Handle task completion in lab
  const handleTaskCompleted = (taskId: string, score: number, competency: CompetencyKey) => {
    setStudentCompetencyScores((prev) => {
      const currentVal = prev[competency] || 75;
      const boost = Math.min(99, currentVal + Math.round(score * 0.2));
      return {
        ...prev,
        [competency]: boost,
      };
    });
  };

  // Handle full experiment submission
  const handleAllTasksCompleted = (totalScore: number, maxScore: number) => {
    const newSub: StudentSubmission = {
      id: `sub-active-${Date.now()}`,
      assignmentId: 'asg-1',
      studentId: 'stu-active',
      studentName: 'Aarav Sharma',
      experimentId: activeExperiment.id,
      submittedAt: new Date().toISOString(),
      attemptNumber: 1,
      totalScore: Math.round((totalScore / maxScore) * 100),
      maxScore: 100,
      competencyScores: { ...studentCompetencyScores },
      taskResponses: {},
      dataReadingsCount: 8,
      instructorFeedback: 'Verified authentic laboratory competence via interactive simulation and AI viva defense.',
    };

    setSubmissions((prev) => [newSub, ...prev]);
  };

  // Teacher creates an assignment
  const handleCreateAssignment = (
    newAsg: Omit<Assignment, 'id' | 'completedCount' | 'totalStudents'>
  ) => {
    const created: Assignment = {
      ...newAsg,
      id: `asg-${Date.now()}`,
      completedCount: 0,
      totalStudents: 42,
    };
    setAssignments((prev) => [created, ...prev]);
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top App Header */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        geminiActive={geminiActive}
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 sm:px-6">
        {/* STUDENT PERSPECTIVE */}
        {currentRole === 'student' && (
          <>
            {/* VIEW 1: Virtual Experiment Simulations */}
            {activeTab === 'experiments' && (
              <div className="space-y-6">
                {/* Syllabus Experiment Selector Bar */}
                <div className="flex flex-col gap-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      Syllabus Experiment:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {EXPERIMENTS.map((exp) => (
                        <button
                          key={exp.id}
                          type="button"
                          onClick={() => setSelectedExpId(exp.id)}
                          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            selectedExpId === exp.id
                              ? 'bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 shadow-xs'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                          }`}
                        >
                          <span>{exp.title.split('&')[0].trim()}</span>
                          <span className="rounded bg-black/10 dark:bg-black/20 px-1 text-[10px]">{exp.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-stone-600 dark:text-stone-400">
                    Syllabus Unit: <strong className="text-stone-900 dark:text-stone-200">{activeExperiment.syllabusTag}</strong>
                  </div>
                </div>

                {/* Experiment Description & Theory Pills */}
                <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                    <h1 className="text-base font-bold text-stone-900 dark:text-stone-100 sm:text-lg">
                      {activeExperiment.title}
                    </h1>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-amber-50 dark:bg-amber-950/70 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                        {activeExperiment.subject}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-stone-600 dark:text-stone-400">
                        <Clock className="h-3.5 w-3.5" />
                        {activeExperiment.durationMinutes} mins
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {activeExperiment.description}
                  </p>

                  {/* Core Governing Formulas */}
                  <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 self-center">
                      Governing Laws:
                    </span>
                    {activeExperiment.keyFormulas.map((f, i) => (
                      <div
                        key={i}
                        className="rounded-md border border-stone-200 dark:border-stone-700/80 bg-stone-50 dark:bg-stone-800/70 px-2.5 py-1 text-xs text-stone-800 dark:text-stone-200"
                      >
                        <span className="text-stone-500 dark:text-stone-400 mr-1.5">{f.label}:</span>
                        <code className="font-mono font-bold text-stone-900 dark:text-amber-400">{f.formula}</code>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Virtual Simulation Apparatus */}
                {activeExperiment.id === 'exp-ohms-law' && (
                  <OhmsLawSim isDark={isDark} />
                )}

                {activeExperiment.id === 'exp-titration' && (
                  <TitrationSim isDark={isDark} />
                )}

                {activeExperiment.id === 'exp-photoelectric' && (
                  <PhotoelectricSim isDark={isDark} />
                )}

                {activeExperiment.id === 'exp-convex-lens' && (
                  <ConvexLensSim isDark={isDark} />
                )}

                {activeExperiment.id === 'exp-pcr-gel' && (
                  <PcrGelSim isDark={isDark} />
                )}

                {/* Auto-Graded Tasks & AI Viva Section */}
                <AutoGradedTaskPanel
                  tasks={activeExperiment.tasks}
                  experimentTitle={activeExperiment.title}
                  onTaskCompleted={handleTaskCompleted}
                  onAllCompleted={handleAllTasksCompleted}
                />

                {/* Floating Context-Aware Lab Mentor Chat */}
                <LabMentorChat experiment={activeExperiment} isDark={isDark} />
              </div>
            )}

            {/* VIEW 2: Scenario-Based Learning Modules */}
            {activeTab === 'scenarios' && (
              <div className="space-y-6">
                {activeScenarioId && activeScenario ? (
                  <ScenarioModuleView
                    scenario={activeScenario}
                    onBackToScenarios={() => setActiveScenarioId(null)}
                    onScenarioCompleted={(scenId, score) => {
                      handleTaskCompleted(scenId, score, 'experimental_design');
                    }}
                  />
                ) : (
                  <>
                    <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 dark:bg-purple-950/70 px-2 py-0.5 text-xs font-semibold text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                          <Compass className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                          Scenario-Based Modules
                        </span>
                        <span className="text-xs text-stone-500 dark:text-stone-400">Problem-Centric Learning</span>
                      </div>
                      <h2 className="mt-1 text-xl font-bold text-stone-900 dark:text-stone-100">
                        Real-World Engineering & Scientific Problem Scenarios
                      </h2>
                      <p className="text-xs text-stone-600 dark:text-stone-300">
                        Apply your empirical lab data to solve authentic industrial constraints, circuit fault diagnoses, and process optimizations.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {SCENARIO_MODULES.map((scen) => (
                        <div
                          key={scen.id}
                          className="flex flex-col justify-between rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs space-y-4 transition-colors"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="rounded bg-purple-100 dark:bg-purple-950/80 px-2 py-0.5 text-[11px] font-bold text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                                {scen.badge}
                              </span>
                              <span className="text-xs text-stone-500 dark:text-stone-400">{scen.domain}</span>
                            </div>
                            <h3 className="mt-2 text-base font-bold text-stone-900 dark:text-stone-100">
                              {scen.title}
                            </h3>
                            <p className="mt-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                              Role: {scen.realWorldRole}
                            </p>
                            <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                              {scen.brief}
                            </p>
                          </div>

                          <div className="border-t border-stone-100 dark:border-stone-800 pt-4 flex items-center justify-between">
                            <span className="text-xs text-stone-500 dark:text-stone-400">
                              {scen.tasks.length} Decision Steps
                            </span>
                            <button
                              type="button"
                              onClick={() => setActiveScenarioId(scen.id)}
                              className="flex items-center gap-1 rounded-lg bg-stone-900 dark:bg-amber-500 px-4 py-2 text-xs font-semibold text-white dark:text-stone-950 shadow-xs hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors"
                            >
                              <span>Launch Scenario</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* VIEW 3: Student Competency Profile */}
            {activeTab === 'competencies' && (
              <StudentAnalytics
                submissions={submissions}
                activeScores={studentCompetencyScores}
                classAverageScores={classes[0].averageCompetencies}
                isDark={isDark}
              />
            )}
          </>
        )}

        {/* TEACHER / INSTRUCTOR PERSPECTIVE */}
        {currentRole === 'teacher' && (
          <TeacherDashboard
            classes={classes}
            assignments={assignments}
            submissions={submissions}
            experiments={EXPERIMENTS}
            onCreateAssignment={handleCreateAssignment}
            isDark={isDark}
          />
        )}
      </main>
    </div>
  );
}
