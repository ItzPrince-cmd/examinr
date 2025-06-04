import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentNavbar from './StudentNavbar';
import Footer from './Footer';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StudentNavbar />
      <main className="flex-1 pt-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
