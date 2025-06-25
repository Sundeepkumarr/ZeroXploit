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
  Wifi,
  Zap,
  Brain,
  Eye,
  Download
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { vulnerabilityAPI } from '../services/api';
import { firebaseService } from '../services/firebaseService';
import wsService from '../services/websocket';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [realTimeData, setRealTimeData] = useState({
    threatsBlocked: 1247,
    activeScans: 12,
    vulnerabilities: 23,
    systemHealth: 98.7,
    aiAccuracy: 97.3,
    responseTime: 0.03
  });

  const [threatData, setThreatData] = useState([
    { time: '00:00', threats: 45, blocked: 43, mitigated: 2 },
    { time: '04:00', threats: 32, blocked: 31, mitigated: 1 },
    { time: '08:00', threats: 67, blocked: 65, mitigated: 2 },
    { time: '12:00', threats: 89, blocked: 87, mitigated: 2 },
    { time: '16:00', threats: 134, blocked: 132, mitigated: 2 },
    { time: '20:00', threats: 156, blocked: 154, mitigated: 2 },
  ]);

  const [vulnerabilityTypes] = useState([
    { name: 'SQL Injection', value: 35, color: '#FF3366' },
    { name: 'XSS', value: 28, color: '#FF8C00' },
    { name: 'CSRF', value: 18, color: '#FFD700' },
    { name: 'Buffer Overflow', value: 12, color: '#32CD32' },
    { name: 'Other', value: 7, color: '#00CED1' },
  ]);

  const [aiMetrics, setAiMetrics] = useState([
    { time: '00:00', accuracy: 95.2, predictions: 234 },
    { time: '04:00', accuracy: 96.1, predictions: 189 },
    { time: '08:00', accuracy: 97.3, predictions: 456 },
    { time: '12:00', accuracy: 96.8, predictions: 567 },
    { time: '16:00', accuracy: 98.1, predictions: 678 },
    { time: '20:00', accuracy: 97.9, predictions: 543 },
  ]);

  const [recentScans, setRecentScans] = useState([
    { target: 'api.company.com', type: 'web', status: 'completed', vulnerabilities: 3, time: '2 min ago', severity: 'high' },
    { target: 'mobile-app-v2.1', type: 'mobile', status: 'scanning', vulnerabilities: 0, time: 'In progress', severity: 'none' },
    { target: '192.168.1.0/24', type: 'infrastructure', status: 'completed', vulnerabilities: 7, time: '15 min ago', severity: 'critical' },
    { target: 'IoT-Device-Fleet', type: 'iot', status: 'queued', vulnerabilities: 0, time: 'Pending', severity: 'none' },
  ]);

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = wsService.connect();
    
    // Subscribe to real-time updates
    wsService.subscribe('threat_detected', (data) => {
      setRealTimeData(prev => ({
        ...prev,
        threatsBlocked: prev.threatsBlocked + 1
      }));
      toast.error(`New threat detected: ${data.type}`);
    });

    wsService.subscribe('scan_completed', (data) => {
      setRecentScans(prev => 
        prev.map(scan => 
          scan.target === data.target 
            ? { ...scan, status: 'completed', vulnerabilities: data.vulnerabilities }
            : scan
        )
      );
      toast.success(`Scan completed for ${data.target}`);
    });

    wsService.subscribe('system_health', (data) => {
      setRealTimeData(prev => ({
        ...prev,
        systemHealth: data.health,
        aiAccuracy: data.aiAccuracy,
        responseTime: data.responseTime
      }));
    });

    // Fetch initial data
    loadDashboardData();

    // Real-time data updates
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        threatsBlocked: prev.threatsBlocked + Math.floor(Math.random() * 3),
        activeScans: Math.max(1, prev.activeScans + Math.floor(Math.random() * 5) - 2),
        aiAccuracy: Math.min(99.9, prev.aiAccuracy + (Math.random() - 0.5) * 0.5),
        responseTime: Math.max(0.01, prev.responseTime + (Math.random() - 0.5) * 0.01)
      }));
    }, 5000);

    return () => {
      clearInterval(interval);
      wsService.disconnect();
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      const [systemHealth, vulnerabilities] = await Promise.all([
        vulnerabilityAPI.getSystemHealth(),
        vulnerabilityAPI.getVulnerabilities()
      ]);
      
      setRealTimeData(prev => ({
        ...prev,
        vulnerabilities: vulnerabilities.length,
        systemHealth: systemHealth.health
      }));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const generateReport = async () => {
    try {
      const reportData = {
        type: 'dashboard_summary',
        title: 'Security Dashboard Summary',
        generated: new Date().toISOString(),
        data: {
          threatsBlocked: realTimeData.threatsBlocked,
          vulnerabilities: realTimeData.vulnerabilities,
          systemHealth: realTimeData.systemHealth,
          aiAccuracy: realTimeData.aiAccuracy
        }
      };
      
      await vulnerabilityAPI.generateReport(reportData);
      toast.success('Report generated successfully!');
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  const statCards = [
    {
      title: 'Threats Blocked',
      value: realTimeData.threatsBlocked.toLocaleString(),
      change: '+12%',
      icon: Shield,
      color: 'emerald',
      bg: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10',
      border: 'border-emerald-500/30',
      glow: 'shadow-emerald-500/20'
    },
    {
      title: 'Active Vulnerabilities',
      value: realTimeData.vulnerabilities,
      change: '-8%',
      icon: AlertTriangle,
      color: 'red',
      bg: 'bg-gradient-to-br from-red-500/20 to-red-600/10',
      border: 'border-red-500/30',
      glow: 'shadow-red-500/20'
    },
    {
      title: 'AI Accuracy',
      value: `${realTimeData.aiAccuracy.toFixed(1)}%`,
      change: '+0.3%',
      icon: Brain,
      color: 'purple',
      bg: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10',
      border: 'border-purple-500/30',
      glow: 'shadow-purple-500/20'
    },
    {
      title: 'Response Time',
      value: `${realTimeData.responseTime.toFixed(2)}s`,
      change: '-5%',
      icon: Zap,
      color: 'blue',
      bg: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10',
      border: 'border-blue-500/30',
      glow: 'shadow-blue-500/20'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400';
      case 'scanning': return 'text-blue-400';
      case 'queued': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Security Command Center
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Real-time AI-powered threat monitoring and vulnerability assessment</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={generateReport}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
          >
            <Download className="w-5 h-5" />
            <span>Generate Report</span>
          </button>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-lg px-4 py-3 shadow-lg">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-emerald-400/50 shadow-lg"></div>
            <span className="text-emerald-400 font-semibold">All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${card.bg} border ${card.border} rounded-2xl p-6 backdrop-blur-sm shadow-xl ${card.glow} hover:shadow-2xl transition-all duration-300 hover:scale-105`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">{card.title}</p>
                  <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
                  <p className={`text-sm mt-2 flex items-center ${card.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {card.change} from last hour
                  </p>
                </div>
                <div className={`p-3 bg-${card.color}-500/20 rounded-xl`}>
                  <Icon className={`w-8 h-8 text-${card.color}-400`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Threat Activity (24h)</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-red-400 text-sm">Threats</span>
              <div className="w-3 h-3 bg-emerald-400 rounded-full ml-4"></div>
              <span className="text-emerald-400 text-sm">Blocked</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={threatData}>
              <defs>
                <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF3366" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF3366" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00FF88" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="threats" 
                stroke="#FF3366" 
                strokeWidth={2}
                fill="url(#threatGradient)"
                name="Threats Detected"
              />
              <Area 
                type="monotone" 
                dataKey="blocked" 
                stroke="#00FF88" 
                strokeWidth={2}
                fill="url(#blockedGradient)"
                name="Threats Blocked"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AI Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">AI Performance Metrics</h3>
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={aiMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '12px' 
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#9D4EDD" 
                strokeWidth={3}
                dot={{ fill: '#9D4EDD', strokeWidth: 2, r: 4 }}
                name="AI Accuracy %"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Vulnerability Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Vulnerability Distribution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          
          <div className="space-y-4">
            {vulnerabilityTypes.map((type, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: type.color }}
                  ></div>
                  <span className="text-white font-medium">{type.name}</span>
                </div>
                <span className="text-gray-400">{type.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Recent Scans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recent Security Scans</h3>
          <button className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg hover:from-emerald-500/30 hover:to-blue-500/30 transition-all duration-200">
            View All Scans
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
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-xl border border-gray-600/50 hover:border-emerald-500/30 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <TypeIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{scan.target}</p>
                    <p className="text-gray-400 text-sm capitalize">{scan.type} security scan</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={getStatusColor(scan.status)}>
                      {scan.status === 'scanning' && <Activity className="w-4 h-4 inline mr-1 animate-spin" />}
                      {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                    </p>
                    <p className="text-gray-400 text-sm">{scan.time}</p>
                  </div>
                  
                  {scan.vulnerabilities > 0 && (
                    <div className={`px-3 py-1 rounded-full text-sm border ${getSeverityColor(scan.severity)}`}>
                      {scan.vulnerabilities} issues
                    </div>
                  )}
                  
                  <button className="p-2 bg-gray-600/50 hover:bg-gray-500/50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-white" />
                  </button>
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