import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import Layout from './components/Layout';
import EnquiryPage from './pages/Enquiry';
import QuotationPage from './pages/Quotation';
import OrderPage from './pages/Order';
import RevenuePage from './pages/Revenue';
import AnalyticsPage from './pages/SalesAnalytics';
import MarketResearchPage from './pages/MarketResearch';
import LockedPage from './pages/LockedPage';
import SettingsPage from './pages/Settings';
import React from 'react';
import { useApp } from './context/AppContext';

function GatedRoute({ children }: { children: React.ReactNode }) {
  const { isUnlocked } = useApp();
  return isUnlocked ? <>{children}</> : <LockedPage />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: () => React.createElement(Navigate, { to: '/enquiry', replace: true }) },
      { path: 'enquiry', Component: EnquiryPage },
      { path: 'quotation', Component: () => <GatedRoute><QuotationPage /></GatedRoute> },
      { path: 'order', Component: () => <GatedRoute><OrderPage /></GatedRoute> },
      { path: 'revenue', Component: () => <GatedRoute><RevenuePage /></GatedRoute> },
      { path: 'analytics', Component: () => <GatedRoute><AnalyticsPage /></GatedRoute> },
      { path: 'market-research', Component: () => <GatedRoute><MarketResearchPage /></GatedRoute> },
      { path: 'settings', Component: SettingsPage },
    ],
  },
]);
