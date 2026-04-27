import React from 'react';
import { Outlet } from 'react-router';
import Header from './Header';
import NavBar from './NavBar';

export default function Layout() {
  return (
    <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
      <Header />
      <NavBar />
      <main className="max-w-screen-2xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
