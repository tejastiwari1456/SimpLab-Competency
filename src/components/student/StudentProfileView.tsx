import React from 'react';
import { User, Mail, Building, Key, ShieldCheck, Calendar, Lock } from 'lucide-react';
import { CurrentUser } from '../../types';
import { RoleBadge } from '../common/RoleBadge';

interface StudentProfileViewProps {
  currentUser: CurrentUser;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({ currentUser }) => {
  return (
    <div id="student-profile-view" className="space-y-6 max-w-3xl mx-auto">
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-900 dark:bg-amber-500 text-2xl font-bold text-amber-400 dark:text-stone-950 shadow-sm">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                {currentUser.name}
              </h2>
              <RoleBadge role="student" />
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">{currentUser.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4 border-t border-stone-100 dark:border-stone-800 text-xs">
          <div className="space-y-1">
            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5" /> Institution / University
            </span>
            <p className="font-semibold text-stone-900 dark:text-stone-100">
              {currentUser.institution || 'Delhi University • Faculty of Science'}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5" /> Enrollment ID / Student Code
            </span>
            <p className="font-mono font-semibold text-amber-700 dark:text-amber-400">
              {currentUser.enrollmentCode || 'STU-2026-081'}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Security Status
            </span>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">
              Active • Verified Session
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> Authorization Scope
            </span>
            <p className="font-semibold text-stone-900 dark:text-stone-100">
              Student Lab Space & Competency Radar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
