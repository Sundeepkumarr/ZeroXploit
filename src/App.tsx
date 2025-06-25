import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './config/firebase';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import VulnerabilityScanner from './components/VulnerabilityScanner';
import LiveThreats from './components/LiveThreats';
import LoginForm from './components/Auth/LoginForm';
import wsService from './services/websocket';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        // Initialize WebSocket connection when user is authenticated
        wsService.connect();
      } else {
        // Disconnect WebSocket when user is not authenticated
        wsService.disconnect();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    // User state will be updated by onAuthStateChanged
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'scanner':
        return <VulnerabilityScanner />;
      case 'threats':
        return <LiveThreats />;
      case 'reports':
        return (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-white mb-4">Reports & Analytics</h2>
            <p className="text-gray-400 text-lg">Advanced reporting system with AI-powered insights coming soon...</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">Vulnerability Reports</h3>
                <p className="text-gray-400 text-sm">Comprehensive security assessments</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">Compliance Reports</h3>
                <p className="text-gray-400 text-sm">GDPR, SOX, HIPAA compliance tracking</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">Executive Dashboards</h3>
                <p className="text-gray-400 text-sm">High-level security metrics</p>
              </div>
            </div>
          </div>
        );
      case 'database':
        return (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-white mb-4">Threat Intelligence Database</h2>
            <p className="text-gray-400 text-lg">Global threat database with AI-powered insights and real-time updates...</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">CVE Database</h3>
                <p className="text-gray-400 text-sm">Latest vulnerability disclosures</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">Threat Indicators</h3>
                <p className="text-gray-400 text-sm">IOCs and threat intelligence feeds</p>
              </div>
            </div>
          </div>
        );
      case 'access':
        return (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-white mb-4">Access Control & Permissions</h2>
            <p className="text-gray-400 text-lg">Enterprise access management system with role-based permissions...</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">User Management</h3>
                <p className="text-gray-400 text-sm">Manage user accounts and permissions</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">Role-Based Access</h3>
                <p className="text-gray-400 text-sm">Define roles and access levels</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">Audit Logs</h3>
                <p className="text-gray-400 text-sm">Track all access and changes</p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading CyberShield AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LoginForm onSuccess={handleLoginSuccess} />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1F2937',
              color: '#fff',
              border: '1px solid #374151'
            }
          }}
        />
      </>
    );
  }

  return (
    <>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </Layout>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1F2937',
            color: '#fff',
            border: '1px solid #374151'
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff'
            }
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff'
            }
          }
        }}
      />
    </>
  );
}

export default App;