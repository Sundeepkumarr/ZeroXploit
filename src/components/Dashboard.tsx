import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Activity,
  Globe,
  Smartphone,
  Server,
  Wifi
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const [realTimeData, setRealTimeData] = useState({
    threatsBlocked: 1247,
    activeScans: 12,
    vulnerabilities: 23,
    systemHealth: 98.7
  });

  const [threatData] = useState([
    { time: '00:00', threats: 45, blocked: 43 },
    { time: '04:00', threats: 32, blocked: 31 },
    { time: '08:00', threats: 67, blocked: 65 },
    { time: '12:00', threats: 89, blocked: 87 },
    { time: '16:00', threats: 134, blocked: 132 },
    { time: '20:00', threats: 156, blocked: 154 },
  ]);

  const [vulnerabilityTypes] = useState([
    { name: 'SQL Injection', value: 35, color: '#FF3366' },
    { name: 'XSS', value: 28, color: '#FF8C00' },
    { name: 'CSRF', value: 18, color: '#FFD700' },
    { name: 'Buffer Overflow', value: 12, color: '#32CD32' },
    { name: 'Other', value: 7, color: '#00CED1' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        threatsBlocked: prev.threatsBlocked + Math.floor(Math.random() * 3),
        activeScans: Math.max(1, prev.activeScans + Math.floor(Math.random() * 5) - 2),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: 'Threats Blocked',
      value: realTimeData.threatsBlocked.toLocaleString(),
      change: '+12%',
      icon: Shield,
      color: 'emerald',
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/30'
    },
    {
      title: 'Active Vulnerabilities',
      value: realTimeData.vulnerabilities,
      change: '-8%',
      icon: AlertTriangle,
      color: 'red',
      bg: 'bg-red-500/20',
      border: 'border-red-500/30'
    },
    {
      title: 'Active Scans',
      value: realTimeData.activeScans,
      change: '+3%',
      icon: Activity,
      color: 'blue',
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/30'
    },
    {
      title: 'System Health',
      value: `${realTimeData.systemHealth}%`,
      change: '+0.2%',
      icon: CheckCircle,
      color: 'emerald',
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/30'
    }
  ];

  const recentScans = [
    { target: 'api.company.com', type: 'web', status: 'completed', vulnerabilities: 3, time: '2 min ago' },
    { target: 'mobile-app-v2.1', type: 'mobile', status: 'scanning', vulnerabilities: 0, time: 'In progress' },
    { target: '192.168.1.0/24', type: 'infrastructure', status: 'completed', vulnerabilities: 7, time: '15 min ago' },
    { target: 'IoT-Device-Fleet', type: 'iot', status: 'queued', vulnerabilities: 0, time: 'Pending' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400';
      case 'scanning': return 'text-blue-400';
      case 'queued': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'web': return Globe;
      case 'mobile': return Smartphone;
      case 'infrastructure': return Server;
      case 'iot': return Wifi;
      default: return Shield;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Security Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time threat monitoring and vulnerability assessment</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-4 py-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-emerald-400 font-medium">All Systems Operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${card.bg} border ${card.border} rounded-xl p-6`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                  <p className={`text-sm mt-1 ${card.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {card.change} from last hour
                  </p>
                </div>
                <Icon className={`w-8 h-8 text-${card.color}-400`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Threat Activity (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={threatData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px' 
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="threats" 
                stroke="#FF3366" 
                strokeWidth={2}
                name="Threats Detected"
              />
              <Line 
                type="monotone" 
                dataKey="blocked" 
                stroke="#00FF88" 
                strokeWidth={2}
                name="Threats Blocked"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Vulnerability Types */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Vulnerability Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vulnerabilityTypes}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {vulnerabilityTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Scans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recent Scans</h3>
          <button className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg hover:bg-emerald-500/30 transition-colors">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {recentScans.map((scan, index) => {
            const TypeIcon = getTypeIcon(scan.type);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
              >
                <div className="flex items-center space-x-4">
                  <TypeIcon className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">{scan.target}</p>
                    <p className="text-gray-400 text-sm capitalize">{scan.type} scan</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className={getStatusColor(scan.status)}>
                      {scan.status === 'scanning' && <Activity className="w-4 h-4 inline mr-1 animate-spin" />}
                      {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                    </p>
                    <p className="text-gray-400 text-sm">{scan.time}</p>
                  </div>
                  
                  {scan.vulnerabilities > 0 && (
                    <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-sm">
                      {scan.vulnerabilities} issues
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;