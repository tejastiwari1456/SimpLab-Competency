import React from 'react';
import { CompetencyKey, StudentSubmission } from '../../types';
import { StudentAnalytics } from '../analytics/StudentAnalytics';

interface StudentCompetenciesViewProps {
  submissions: StudentSubmission[];
  activeScores: Record<CompetencyKey, number>;
  classAverageScores: Record<CompetencyKey, number>;
  isDark: boolean;
}

export const StudentCompetenciesView: React.FC<StudentCompetenciesViewProps> = ({
  submissions,
  activeScores,
  classAverageScores,
  isDark,
}) => {
  return (
    <div id="student-competencies-view">
      <StudentAnalytics
        submissions={submissions}
        activeScores={activeScores}
        classAverageScores={classAverageScores}
        isDark={isDark}
      />
    </div>
  );
};
