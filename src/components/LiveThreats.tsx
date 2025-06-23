import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  X, 
  Eye,
  MapPin,
  Clock,
  Activity,
  Layers
} from 'lucide-react';
import { Attack } from '../types';

const LiveThreats: React.FC = () => {
  const [attacks, setAttacks] = useState<Attack[]>([
    {
      id: '1',
      timestamp: '2024-01-15 15:42:31',
      source: '185.220.101.42',
      type: 'SQL Injection Attempt',
      severity: 'high',
      status: 'blocked',
      layers: 3
    },
    {
      id: '2',
      timestamp: '2024-01-15 15:41:15',
      source: '203.45.67.89',
      type: 'DDoS Attack',
      severity: 'critical',
      status: 'mitigated',
      layers: 5
    },
    {
      id: '3',
      timestamp: '2024-01-15 15:40:03',
      source: '91.134.25.178',
      type: 'Brute Force Login',
      severity: 'medium',
      status: 'blocked',
      layers: 2
    }
  ]);

  const [defenseLayers] = useState([
    { name: 'Web Application Firewall', status: 'active', blocked: 847 },
    { name: 'DDoS Protection', status: 'active', blocked: 234 },
    { name: 'Intrusion Detection', status: 'active', blocked: 156 },
    { name: 'Behavioral Analysis', status: 'active', blocked: 89 },
    { name: 'AI Threat Hunter', status: 'active', blocked: 45 },
  ]);

  const [realTimeStats, setRealTimeStats] = useState({
    attacksBlocked: 1372,
    layersActive: 5,
    responseTime: 0.03,
    uptime: 99.97
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new attacks
      if (Math.random() > 0.7) {
        const newAttack: Attack = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          type: ['SQL Injection', 'XSS Attack', 'DDoS', 'Brute Force', 'Port Scan'][Math.floor(Math.random() * 5)],
          severity: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)] as Attack['severity'],
          status: 'blocked',
          layers: Math.floor(Math.random() * 5) + 1
        };
        
        setAttacks(prev => [newAttack, ...prev.slice(0, 9)]);
        setRealTimeStats(prev => ({
          ...prev,
          attacksBlocked: prev.attacksBlocked + 1
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'blocked': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'mitigated': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Live Threat Monitoring</h1>
          <p className="text-gray-400 mt-1">Real-time attack detection and multi-layer defense system</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-4 py-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 font-medium">Defense Systems Active</span>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Attacks Blocked', value: realTimeStats.attacksBlocked.toLocaleString(), icon: Shield, color: 'emerald' },
          { label: 'Active Layers', value: realTimeStats.layersActive, icon: Layers, color: 'blue' },
          { label: 'Response Time', value: `${realTimeStats.responseTime}s`, icon: Clock, color: 'purple' },
          { label: 'System Uptime', value: `${realTimeStats.uptime}%`, icon: Activity, color: 'green' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-${stat.color}-500/20 border border-${stat.color}-500/30 rounded-xl p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 text-${stat.color}-400`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Defense Layers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Multi-Layer Defense System</h3>
        <div className="space-y-4">
          {defenseLayers.map((layer, index) => (
            <motion.div
              key={layer.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
            >
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <div>
                  <h4 className="text-white font-medium">{layer.name}</h4>
                  <p className="text-gray-400 text-sm">Layer {index + 1} - Active Protection</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-emerald-400 font-semibold">{layer.blocked} Blocked</p>
                <p className="text-gray-400 text-sm">Last 24h</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Live Attack Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Live Attack Feed</h3>
          <div className="flex items-center space-x-2 text-emerald-400">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Live</span>
          </div>
        </div>

        <div className="space-y-3">
          {attacks.map((attack, index) => (
            <motion.div
              key={attack.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <div className="flex items-center space-x-3">
                    <h4 className="text-white font-medium">{attack.type}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getSeverityColor(attack.severity)}`}>
                      {attack.severity.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(attack.status)}`}>
                      {attack.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{attack.source}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{attack.timestamp}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Layers className="w-4 h-4" />
                      <span>{attack.layers} layers activated</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors">
                  <Eye className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors">
            Load More Attacks
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveThreats;