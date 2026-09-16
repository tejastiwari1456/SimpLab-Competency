import React from 'react';
import {
  FlaskConical,
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Users,
  Compass,
  Sun,
  Moon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  geminiActive: boolean;
  isDark: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  geminiActive,
  isDark,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 dark:bg-amber-500 text-amber-400 dark:text-stone-950 shadow-sm transition-colors">
            <FlaskConical className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                SimLab
              </span>
              <span className="rounded bg-amber-100 dark:bg-amber-950/80 px-1.5 py-0.5 text-xs font-semibold text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                Competency Hub
              </span>
            </div>
            <p className="hidden text-xs text-stone-600 dark:text-stone-400 sm:block">
              Syllabus-Aligned Practical Competency & Assessment Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800/80 p-1 text-sm font-medium transition-colors">
          {currentRole === 'student' ? (
            <>
              <button
                type="button"
                id="nav-tab-experiments"
                onClick={() => onTabChange('experiments')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm transition-all ${
                  activeTab === 'experiments'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <FlaskConical className="h-3.5 w-3.5" />
                <span>Virtual Labs</span>
              </button>

              <button
                type="button"
                id="nav-tab-scenarios"
                onClick={() => onTabChange('scenarios')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm transition-all ${
                  activeTab === 'scenarios'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Scenario Modules</span>
              </button>

              <button
                type="button"
                id="nav-tab-competencies"
                onClick={() => onTabChange('competencies')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm transition-all ${
                  activeTab === 'competencies'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>My Competency Profile</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                id="nav-tab-teacher-dashboard"
                onClick={() => onTabChange('teacher-dashboard')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm transition-all ${
                  activeTab === 'teacher-dashboard'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Class Roster & Analytics</span>
              </button>

              <button
                type="button"
                id="nav-tab-teacher-assignments"
                onClick={() => onTabChange('teacher-assignments')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm transition-all ${
                  activeTab === 'teacher-assignments'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Assignment Portal</span>
              </button>
            </>
          )}
        </nav>

        {/* Right Controls: Dark Mode, AI status & Role Switcher */}
        <div
          className="flex items-center gap-2 sm:gap-3"
          style={{
            width: '392.312px',
            paddingLeft: '0px',
            marginLeft: '2px',
            fontFamily: 'system-ui',
            textAlign: 'justify',
          }}
        >
          {/* Prominent Animated Dark Mode Toggle */}
          <motion.button
            type="button"
            id="theme-toggle-btn"
            onClick={onToggleDarkMode}
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.02 }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="relative flex items-center rounded-full border border-stone-200 dark:border-stone-700/80 bg-stone-100 dark:bg-stone-800 p-1 text-xs font-semibold shadow-inner transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            style={{
              borderRadius: '2.68435px',
              borderWidth: '0px',
              borderStyle: 'groove',
              marginLeft: '4px',
            }}
            title={isDark ? 'Switch to Light Mode (active: Dark)' : 'Switch to Dark Mode (active: Light)'}
          >
            {/* Sliding Active Pill Background */}
            <div className="relative flex items-center">
              {/* Light Mode Segment */}
              <div
                className={`relative z-10 flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-bold transition-colors duration-200 ${
                  !isDark
                    ? 'text-stone-900'
                    : 'text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300'
                }`}
              >
                {!isDark && (
                  <motion.div
                    layoutId="theme-active-indicator"
                    className="absolute inset-0 rounded-full bg-white shadow-xs border border-amber-200/60"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center">
                  <motion.span
                    key={isDark ? 'sun-inactive' : 'sun-active'}
                    initial={{ rotate: isDark ? 45 : -45, scale: isDark ? 0.85 : 1.15 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    className="flex items-center justify-center"
                  >
                    <Sun
                      className={`h-3.5 w-3.5 transition-colors ${
                        !isDark ? 'text-amber-500 fill-amber-400/30 stroke-[2.2]' : 'text-stone-400'
                      }`}
                    />
                  </motion.span>
                </span>
                <span className="relative z-10 hidden sm:inline-block">
                  {!isDark && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 4 }}
                      className="text-[10px] font-bold uppercase tracking-wider text-amber-900"
                    >
                      Light
                    </motion.span>
                  )}
                </span>
              </div>

              {/* Dark Mode Segment */}
              <div
                className={`relative z-10 flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-bold transition-colors duration-200 ${
                  isDark
                    ? 'text-stone-100'
                    : 'text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300'
                }`}
              >
                {isDark && (
                  <motion.div
                    layoutId="theme-active-indicator"
                    className="absolute inset-0 rounded-full bg-stone-900 shadow-xs border border-amber-500/40"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center">
                  <motion.span
                    key={isDark ? 'moon-active' : 'moon-inactive'}
                    initial={{ rotate: isDark ? -45 : 45, scale: isDark ? 1.15 : 0.85 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    className="flex items-center justify-center"
                  >
                    <Moon
                      className={`h-3.5 w-3.5 transition-colors ${
                        isDark ? 'text-amber-400 fill-amber-400/20 stroke-[2.2]' : 'text-stone-400'
                      }`}
                    />
                  </motion.span>
                </span>
                <span className="relative z-10 hidden sm:inline-block">
                  {isDark && (
                    <motion.span
                      initial={{ opacity: 0, x: 4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      className="text-[10px] font-bold uppercase tracking-wider text-amber-300"
                    >
                      Dark
                    </motion.span>
                  )}
                </span>
              </div>
            </div>
          </motion.button>

          {/* AI Evaluator Status */}
          <div
            className="hidden items-center gap-1.5 rounded-full border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/70 px-2.5 py-1 text-xs text-stone-600 dark:text-stone-300 md:flex transition-colors"
            title={
              geminiActive
                ? 'Gemini 3.8 Flash live for viva evaluation & hints'
                : 'Rubric Evaluator engine active (set GEMINI_API_KEY for live LLM viva)'
            }
          >
            <Sparkles className={`h-3.5 w-3.5 ${geminiActive ? 'text-amber-500' : 'text-emerald-500'}`} />
            <span className="font-medium">
              {geminiActive ? 'Gemini 3.8 Flash' : 'Rubric Viva AI'}
            </span>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800/80 p-0.5 transition-colors">
            <button
              type="button"
              id="role-switch-student"
              onClick={() => {
                onRoleChange('student');
                if (activeTab.startsWith('teacher')) onTabChange('experiments');
              }}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                currentRole === 'student'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Student</span>
            </button>
            <button
              type="button"
              id="role-switch-teacher"
              onClick={() => {
                onRoleChange('teacher');
                if (!activeTab.startsWith('teacher')) onTabChange('teacher-dashboard');
              }}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                currentRole === 'teacher'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Instructor</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
