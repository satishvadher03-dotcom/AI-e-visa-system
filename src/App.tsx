import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout.tsx';
import { CustomerLayout } from './components/layout/CustomerLayout.tsx';
import { ConsultantLayout } from './components/layout/ConsultantLayout.tsx';
import { AdminLayout } from './components/layout/AdminLayout.tsx';

// Public Pages
import { HomePage } from './pages/public/HomePage.tsx';
import { VisaProgramsPage } from './pages/public/VisaProgramsPage.tsx';
import { VisaProgramDetailPage } from './pages/public/VisaProgramDetailPage.tsx';
import { EligibilityCheckerPage } from './pages/public/EligibilityCheckerPage.tsx';
import { AIAssistantPage } from './pages/public/AIAssistantPage.tsx';
import { BookConsultationPage } from './pages/public/BookConsultationPage.tsx';
import { ContactPage } from './pages/public/ContactPage.tsx';
import { AboutPage } from './pages/public/AboutPage.tsx';
import { LoginPage } from './pages/public/LoginPage.tsx';
import { RegisterPage } from './pages/public/RegisterPage.tsx';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage.tsx';
import { TermsPrivacyPage } from './pages/public/TermsPrivacyPage.tsx';

// Customer Panel
import { CustomerDashboard } from './pages/customer/CustomerDashboard.tsx';
import { CustomerApplicationsPage } from './pages/customer/CustomerApplicationsPage.tsx';
import { CustomerAppointmentsPage } from './pages/customer/CustomerAppointmentsPage.tsx';
import { CustomerDocumentsPage } from './pages/customer/CustomerDocumentsPage.tsx';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage.tsx';

// Consultant Panel
import { ConsultantDashboard } from './pages/consultant/ConsultantDashboard.tsx';
import { ConsultantCasesPage } from './pages/consultant/ConsultantCasesPage.tsx';
import { ConsultantAppointmentsPage } from './pages/consultant/ConsultantAppointmentsPage.tsx';
import { ConsultantProfilePage } from './pages/consultant/ConsultantProfilePage.tsx';

// Admin Panel
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
import { AdminUsersPage } from './pages/admin/AdminUsersPage.tsx';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage.tsx';
import { AdminVisaProgramsPage } from './pages/admin/AdminVisaProgramsPage.tsx';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage.tsx';
import { AdminReportsPage } from './pages/admin/AdminReportsPage.tsx';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. Public Routes (Public Website opens first at /) */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/visa-programs" element={<VisaProgramsPage />} />
              <Route path="/visa-programs/:id" element={<VisaProgramDetailPage />} />
              <Route path="/eligibility" element={<EligibilityCheckerPage />} />
              <Route path="/ai-assistant" element={<AIAssistantPage />} />
              <Route path="/book-consultation" element={<BookConsultationPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/privacy" element={<TermsPrivacyPage />} />
              <Route path="/terms" element={<TermsPrivacyPage />} />
            </Route>

            {/* 2. Authenticated Customer Panel */}
            <Route path="/customer" element={<CustomerLayout />}>
              <Route index element={<Navigate to="/customer/dashboard" replace />} />
              <Route path="dashboard" element={<CustomerDashboard />} />
              <Route path="applications" element={<CustomerApplicationsPage />} />
              <Route path="appointments" element={<CustomerAppointmentsPage />} />
              <Route path="documents" element={<CustomerDocumentsPage />} />
              <Route path="profile" element={<CustomerProfilePage />} />
            </Route>

            {/* 3. Authenticated Consultant Panel */}
            <Route path="/consultant" element={<ConsultantLayout />}>
              <Route index element={<Navigate to="/consultant/dashboard" replace />} />
              <Route path="dashboard" element={<ConsultantDashboard />} />
              <Route path="cases" element={<ConsultantCasesPage />} />
              <Route path="appointments" element={<ConsultantAppointmentsPage />} />
              <Route path="profile" element={<ConsultantProfilePage />} />
            </Route>

            {/* 4. Authenticated Admin Panel */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="applications" element={<AdminApplicationsPage />} />
              <Route path="visa-programs" element={<AdminVisaProgramsPage />} />
              <Route path="audit-logs" element={<AdminAuditLogsPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
