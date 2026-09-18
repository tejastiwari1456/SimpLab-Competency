import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoadingScreen } from './components/common/LoadingScreen';
import { UnauthorizedPage } from './components/common/UnauthorizedPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { StudentLayout } from './components/student/StudentLayout';
import { TeacherLayout } from './components/teacher/TeacherLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import {
  EXPERIMENTS,
  INITIAL_CLASSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
} from './data/mockData';
import {
  CurrentUser,
  UserRole,
  CompetencyKey,
  Assignment,
  StudentSubmission,
  CompetencyMilestone,
  StudentMilestoneStatus,
} from './types';
import {
  detectNewlyUnlockedMilestones,
  getMilestoneStatuses,
  COMPETENCY_MILESTONES,
} from './data/milestonesData';
import { MilestoneCelebrationModal } from './components/badges/MilestoneCelebrationModal';
import { DigitalBadgeModal } from './components/badges/DigitalBadgeModal';

function AppContent() {
  const { user, role, token, isAuthenticated, isLoading, logout, refreshUser, setSession } = useAuth();

  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('simlab_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Client-side URL pathname routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
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

  // Browser History & Popstate event handling for URL changes
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // State for simulated experiments & assignments
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

  // Milestone celebration popup state
  const [celebratedMilestone, setCelebratedMilestone] = useState<{
    milestone: CompetencyMilestone;
    score: number;
  } | null>(null);
  const [inspectedMilestone, setInspectedMilestone] = useState<StudentMilestoneStatus | null>(null);

  // Handle student task completion in virtual lab
  const handleTaskCompleted = (taskId: string, score: number, competency: CompetencyKey) => {
    setStudentCompetencyScores((prev) => {
      const currentVal = prev[competency] || 75;
      const boost = Math.min(99, currentVal + Math.max(2, Math.round(score * 0.2)));
      const nextScores = {
        ...prev,
        [competency]: boost,
      };

      // Detect if crossing a milestone threshold (e.g. reaching 90 in measurement precision)
      const newlyUnlocked = detectNewlyUnlockedMilestones(prev, nextScores);
      if (newlyUnlocked.length > 0) {
        setCelebratedMilestone({
          milestone: newlyUnlocked[0],
          score: boost,
        });
      }

      return nextScores;
    });
  };

  // Handle full experiment submission
  const handleAllTasksCompleted = (totalScore: number, maxScore: number) => {
    if (!user) return;
    const newSub: StudentSubmission = {
      id: `sub-${Date.now()}`,
      assignmentId: 'asg-1',
      studentId: user.id,
      studentName: user.name,
      experimentId: 'exp-convex-lens',
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

  // Handle logout with route redirection
  const handleLogout = async () => {
    await logout();
    navigateTo('/login');
  };

  // Dedicated callback to synchronize auth state and route immediately upon login/registration
  const handleAuthSuccess = (authUser: CurrentUser, authToken: string) => {
    setSession(authUser, authToken);
    const roleRoute = (authUser.role || 'student').toLowerCase();
    navigateTo(`/${roleRoute}/dashboard`);
  };

  // Auto-redirect authenticated users from root or auth pages to their role dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && role) {
      if (currentPath === '/' || currentPath === '/login' || currentPath === '/register') {
        const safeDashboard = `/${role}/dashboard`;
        navigateTo(safeDashboard);
      }
    }
  }, [isLoading, isAuthenticated, role, currentPath, navigateTo]);

  // 1. Initial Authentication Resolution (Zero Role Flash)
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 2. Unauthenticated State
  if (!isAuthenticated || !user || !role) {
    if (currentPath === '/register') {
      return (
        <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
          <RegisterPage
            onRegisterSuccess={handleAuthSuccess}
            onNavigate={navigateTo}
            isDark={isDark}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
        <LoginPage
          onLoginSuccess={handleAuthSuccess}
          onNavigate={navigateTo}
          isDark={isDark}
        />
      </div>
    );
  }

  // 3. Authenticated State: Show clean loading state while transitioning from root/auth pages
  if (currentPath === '/' || currentPath === '/login' || currentPath === '/register') {
    return <LoadingScreen />;
  }

  // 4. Role Route Guard: Block unauthorized direct URL access (HTTP 403)
  if (currentPath.startsWith('/student') && role !== 'student') {
    return (
      <UnauthorizedPage
        currentRole={role}
        attemptedPath={currentPath}
        onNavigate={navigateTo}
      />
    );
  }

  if (currentPath.startsWith('/teacher') && role !== 'teacher') {
    return (
      <UnauthorizedPage
        currentRole={role}
        attemptedPath={currentPath}
        onNavigate={navigateTo}
      />
    );
  }

  if (currentPath.startsWith('/admin') && role !== 'admin') {
    return (
      <UnauthorizedPage
        currentRole={role}
        attemptedPath={currentPath}
        onNavigate={navigateTo}
      />
    );
  }

  // 5. Strict Role Application Shell Rendering
  // Conditional route & layout selection - absolutely NO CSS-based hiding or co-rendering
  let layoutContent: React.ReactNode;

  switch (role) {
    case 'student':
      layoutContent = (
        <StudentLayout
          currentUser={user}
          currentPath={currentPath}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          isDark={isDark}
          onToggleDarkMode={toggleDarkMode}
          classes={classes}
          assignments={assignments}
          submissions={submissions}
          competencyScores={studentCompetencyScores}
          onTaskCompleted={handleTaskCompleted}
          onAllCompleted={handleAllTasksCompleted}
        />
      );
      break;

    case 'teacher':
      layoutContent = (
        <TeacherLayout
          currentUser={user}
          currentPath={currentPath}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          isDark={isDark}
          onToggleDarkMode={toggleDarkMode}
          classes={classes}
          assignments={assignments}
          submissions={submissions}
          experiments={EXPERIMENTS}
          onCreateAssignment={handleCreateAssignment}
        />
      );
      break;

    case 'admin':
      layoutContent = (
        <AdminLayout
          currentUser={user}
          currentPath={currentPath}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          isDark={isDark}
          onToggleDarkMode={toggleDarkMode}
          token={token}
        />
      );
      break;

    default:
      layoutContent = (
        <UnauthorizedPage
          currentRole={role}
          attemptedPath={currentPath}
          onNavigate={navigateTo}
        />
      );
      break;
  }

  return (
    <>
      {layoutContent}

      {/* Global Milestone Celebration Modal */}
      {celebratedMilestone && (
        <MilestoneCelebrationModal
          milestone={celebratedMilestone.milestone}
          newScore={celebratedMilestone.score}
          onClose={() => setCelebratedMilestone(null)}
          onViewBadge={(m) => {
            const allStatuses = getMilestoneStatuses(
              COMPETENCY_MILESTONES,
              studentCompetencyScores,
              user?.name,
              user?.enrollmentCode
            );
            const targetStatus = allStatuses.find((s) => s.milestone.id === m.id);
            if (targetStatus) {
              setInspectedMilestone({ ...targetStatus, isUnlocked: true });
            }
          }}
        />
      )}

      {/* Inspected Milestone Credential Modal */}
      {inspectedMilestone && (
        <DigitalBadgeModal
          status={inspectedMilestone}
          studentName={user?.name}
          institution={user?.institution}
          enrollmentCode={user?.enrollmentCode}
          onClose={() => setInspectedMilestone(null)}
          onPractice={(expId) => {
            setInspectedMilestone(null);
            navigateTo('/student/experiments');
          }}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
