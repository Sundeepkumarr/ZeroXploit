import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import VulnerabilityScanner from './components/VulnerabilityScanner';
import LiveThreats from './components/LiveThreats';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

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
            <h2 className="text-2xl font-bold text-white mb-4">Reports & Analytics</h2>
            <p className="text-gray-400">Advanced reporting system coming soon...</p>
          </div>
        );
      case 'database':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Threat Intelligence Database</h2>
            <p className="text-gray-400">Global threat database with AI-powered insights...</p>
          </div>
        );
      case 'access':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Access Control & Permissions</h2>
            <p className="text-gray-400">Enterprise access management system...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;