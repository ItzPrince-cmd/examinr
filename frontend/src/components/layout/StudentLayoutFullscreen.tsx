import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import StudentTopBar from './StudentTopBar';
import { cn } from '../../lib/utils';

interface StudentLayoutFullscreenProps {
  children: React.ReactNode;
}

const StudentLayoutFullscreen: React.FC<StudentLayoutFullscreenProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <StudentSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <StudentTopBar />
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div
            className={cn(
              'w-full mx-auto transition-all duration-300',
              isSidebarCollapsed ? 'max-w-[1920px]' : 'max-w-[1800px]'
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayoutFullscreen;
