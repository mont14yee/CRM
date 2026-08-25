import React, { ReactNode } from 'react';
import { TasksProvider } from './TasksContext';
import { ProjectsProvider } from './ProjectsContext';
import { RevenueProvider } from './RevenueContext';
import { CalendarProvider } from './CalendarContext';
import { TimeTrackerProvider } from './TimeTrackerContext';

export function DataProvider({ children }: { children: ReactNode }) {
  return (
    <TasksProvider>
      <ProjectsProvider>
        <RevenueProvider>
          <CalendarProvider>
            <TimeTrackerProvider>
              {children}
            </TimeTrackerProvider>
          </CalendarProvider>
        </RevenueProvider>
      </ProjectsProvider>
    </TasksProvider>
  );
}
