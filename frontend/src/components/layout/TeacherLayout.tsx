import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';
import TeacherTopBar from './TeacherTopBar';
import { cn } from '../../lib/utils';

interface TeacherLayoutProps {
  children?: React.ReactNode;
}

const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <TeacherSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TeacherTopBar />
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div
            className={cn(
              'w-full mx-auto transition-all duration-300 px-4 sm:px-6 lg:px-8 py-6',
              isSidebarCollapsed ? 'max-w-[1920px]' : 'max-w-[1800px]'
            )}
          >
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
