import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar.tsx';
import { Footer } from '../common/Footer.tsx';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
