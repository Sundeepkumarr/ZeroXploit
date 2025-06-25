import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { 
  Shield, 
  Search, 
  Settings, 
  Bell, 
  User, 
  Home,
  Scan,
  FileText,
  AlertTriangle,
  Database,
  Lock,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [notifications, setNotifications] = useState(3);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { id: 'dashboard', label: 'Security Dashboard', icon: Home, description: 'Overview & Analytics' },
    { id: 'scanner', label: 'Vulnerability Scanner', icon: Scan, description: 'AI-Powered Scanning' },
    { id: 'threats', label: 'Live Threats', icon: AlertTriangle, description: 'Real-time Monitoring' },
    { id: 'reports', label: 'Reports & Analytics', icon: FileText, description: 'Security Reports' },
    { id: 'database', label: 'Threat Intelligence', icon: Database, description: 'Global Threat DB' },
    { id: 'access', label: 'Access Control', icon: Lock, description: 'User Management' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for: ${searchQuery}`);
      // Implement search functionality
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Enhanced Header */}
      <header className="bg-gray-800/90 backdrop-blur-xl border-b border-gray-700/50 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="w-10 h-10 text-emerald-400" />
                <div className="absolute inset-0 w-10 h-10 text-emerald-400 animate-pulse opacity-50">
                  <Shield className="w-10 h-10" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  CyberShield AI
                </h1>
                <p className="text-xs text-gray-400">Enterprise Security Platform</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-emerald-400/50 shadow-lg"></div>
              <span>Defense Systems Active</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Enhanced Search */}
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vulnerabilities, threats..."
                  className="bg-gray-700/50 border border-gray-600/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors w-64"
                />
              </div>
            </form>
            
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-400 hover:text-white" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
            
            {/* Settings */}
            <button className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
            
            {/* User Menu */}
            <div className="flex items-center space-x-3 bg-gray-700/30 rounded-lg px-3 py-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">Security Admin</p>
                <p className="text-xs text-gray-400">{auth.currentUser?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1 hover:bg-gray-600/50 rounded transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-gray-400 hover:text-red-400" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <nav className={`${showMobileMenu ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-30 w-72 bg-gray-800/90 backdrop-blur-xl border-r border-gray-700/50 min-h-screen transition-transform duration-300`}>
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-3">Navigation</h3>
            </div>
            
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <li key={item.id}>
                    <motion.button
                      onClick={() => {
                        onPageChange(item.id);
                        setShowMobileMenu(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                        isActive 
                          ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10' 
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-gray-400 group-hover:text-white'}`} />
                      <div className="flex-1">
                        <span className="font-medium block">{item.label}</span>
                        <span className="text-xs text-gray-500 group-hover:text-gray-400">{item.description}</span>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      )}
                    </motion.button>
                  </li>
                );
              })}
            </ul>

            {/* System Status */}
            <div className="mt-8 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl">
              <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>System Status</span>
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Uptime</span>
                  <span className="text-emerald-400 font-medium">99.97%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Threats Blocked</span>
                  <span className="text-blue-400 font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">AI Accuracy</span>
                  <span className="text-purple-400 font-medium">97.3%</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Overlay */}
        {showMobileMenu && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-x-hidden">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;