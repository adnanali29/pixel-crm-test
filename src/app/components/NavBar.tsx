import React from 'react';
import { NavLink } from 'react-router';
import { FileQuestion, FileText, ShoppingCart, TrendingUp, BarChart2, Search, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { label: 'Enquiry', path: '/enquiry', icon: FileQuestion, locked: false },
  { label: 'Quotation', path: '/quotation', icon: FileText, locked: true },
  { label: 'Order', path: '/order', icon: ShoppingCart, locked: true },
  { label: 'Revenue', path: '/revenue', icon: TrendingUp, locked: true },
  { label: 'Sales Analytics', path: '/analytics', icon: BarChart2, locked: true },
  { label: 'Market Research', path: '/market-research', icon: Search, locked: true },
];

export default function NavBar() {
  const { isUnlocked } = useApp();

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-40">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {navItems.map(({ label, path, icon: Icon, locked }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  locked && !isUnlocked
                    ? 'border-transparent text-slate-400 hover:text-slate-500 hover:bg-slate-50 cursor-pointer'
                    : isActive
                      ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                      : 'border-transparent text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-slate-50'
                }`
              }
            >
              <Icon size={16} />
              {label}
              {locked && !isUnlocked && <Lock size={11} className="text-slate-400 ml-0.5" />}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
