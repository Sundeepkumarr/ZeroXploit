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
  Layers,
  Zap,
  Brain,
  Target,
  Ban,
  CheckCircle,
  TrendingUp,
  Globe
} from 'lucide-react';
import { Attack } from '../types';
import { vulnerabilityAPI } from '../services/api';
import { firebaseService } from '../services/firebaseService';
import wsService from '../services/websocket';
import toast from 'react-hot-toast';

const LiveThreats: React.FC = () => {
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [loading, setLoading] = useState(false);

  const [defenseLayers] = useState([
    { name: 'Web Application Firewall', status: 'active', blocked: 847, efficiency: 98.2 },
    { name: 'DDoS Protection', status: 'active', blocked: 234, efficiency: 99.1 },
    { name: 'Intrusion Detection', status: 'active', blocked: 156, efficiency: 96.7 },
    { name: 'Behavioral Analysis', status: 'active', blocked: 89, efficiency: 94.3 },
    { name: 'AI Threat Hunter', status: 'active', blocked: 45, efficiency: 97.8 },
  ]);

  const [realTimeStats, setRealTimeStats] = useState({
    attacksBlocked: 1372,
    layersActive: 5,
    responseTime: 0.03,
    uptime: 99.97,
    threatLevel: 'moderate',
    activeConnections: 2847
  });

  const [threatMap] = useState([
    { country: 'Russia', attacks: 234, blocked: 232, lat: 55.7558, lng: 37.6176 },
    { country: 'China', attacks: 189, blocked: 187, lat: 39.9042, lng: 116.4074 },
    { country: 'North Korea', attacks: 156, blocked: 154, lat: 39.0392, lng: 125.7625 },
    { country: 'Iran', attacks: 98, blocked: 96, lat: 35.6892, lng: 51.3890 },
    { country: 'Unknown', attacks: 67, blocked: 65, lat: 0, lng: 0 }
  ]);

  useEffect(() => {
    loadLiveThreats();
    
    // Subscribe to real-time threat updates
    const unsubscribe = firebaseService.subscribeToAttacks((newAttacks) => {
      setAttacks(newAttacks);
    });

    // WebSocket for real-time updates
    wsService.subscribe('new_threat', (data) => {
      const newAttack: Attack = {
        id: data.id,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        source: data.source,
        type: data.type,
        severity: data.severity,
        status: 'blocked',
        layers: data.layers
      };
      
      setAttacks(prev => [newAttack, ...prev.slice(0, 49)]);
      setRealTimeStats(prev => ({
        ...prev,
        attacksBlocked: prev.attacksBlocked + 1
      }));
      
      toast.error(`🚨 ${data.type} detected from ${data.source}`);
    });

    wsService.subscribe('threat_blocked', (data) => {
      toast.success(`✅ Threat blocked: ${data.type}`);
    });

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const attackTypes = ['SQL Injection', 'XSS Attack', 'DDoS', 'Brute Force', 'Port Scan', 'Malware', 'Phishing'];
        const severities: Attack['severity'][] = ['critical', 'high', 'medium', 'low'];
        const sources = [
          '185.220.101.42', '203.45.67.89', '91.134.25.178', '45.67.89.123',
          '123.45.67.89', '67.89.123.45', '89.123.45.67', '12.34.56.78'
        ];

        const newAttack: Attack = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          source: sources[Math.floor(Math.random() * sources.length)],
          type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          status: Math.random() > 0.1 ? 'blocked' : 'mitigated',
          layers: Math.floor(Math.random() * 5) + 1
        };
        
        setAttacks(prev => [newAttack, ...prev.slice(0, 49)]);
        setRealTimeStats(prev => ({
          ...prev,
          attacksBlocked: prev.attacksBlocked + 1,
          responseTime: Math.max(0.01, prev.responseTime + (Math.random() - 0.5) * 0.01)
        }));
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      unsubscribe();
      wsService.unsubscribe('new_threat');
      wsService.unsubscribe('threat_blocked');
    };
  }, []);

  const loadLiveThreats = async () => {
    try {
      setLoading(true);
      const threats = await firebaseService.getRecentAttacks(50);
      setAttacks(threats);
    } catch (error) {
      console.error('Error loading live threats:', error);
      // Fallback to demo data
      setAttacks([
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
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const blockThreat = async (attackId: string) => {
    try {
      await vulnerabilityAPI.blockThreat(attackId);
      setAttacks(attacks => 
        attacks.map(attack => 
          attack.id === attackId 
            ? { ...attack, status: 'blocked' as const }
            : attack
        )
      );
      toast.success('Threat blocked successfully');
    } catch (error) {
      toast.error('Failed to block threat');
    }
  };

  const sendAlertToAuthorities = async (attack: Attack) => {
    try {
      await firebaseService.sendAlertToAuthorities({
        type: 'active_attack',
        severity: attack.severity,
        title: `${attack.type} Detected`,
        description: `A ${attack.severity} severity ${attack.type} has been detected from ${attack.source}`,
        affectedSystems: ['Main Server', 'Database'],
        recommendedActions: ['Block IP Address', 'Increase Monitoring', 'Review Logs']
      });
      toast.success('Alert sent to security team');
    } catch (error) {
      toast.error('Failed to send alert');
    }
  };

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

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-red-400 to-orange-400 bg-clip-text text-transparent">
            Live Threat Command Center
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Real-time attack detection and multi-layer defense orchestration</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 rounded-lg px-4 py-3 border ${getThreatLevelColor(realTimeStats.threatLevel)}`}>
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold capitalize">Threat Level: {realTimeStats.threatLevel}</span>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-4 py-3">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">Defense Systems Active</span>
          </div>
        </div>
      </div>

      {/* Enhanced Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Attacks Blocked', value: realTimeStats.attacksBlocked.toLocaleString(), icon: Shield, color: 'emerald', change: '+12%' },
          { label: 'Active Layers', value: realTimeStats.layersActive, icon: Layers, color: 'blue', change: '100%' },
          { label: 'Response Time', value: `${realTimeStats.responseTime.toFixed(2)}s`, icon: Zap, color: 'purple', change: '-5%' },
          { label: 'System Uptime', value: `${realTimeStats.uptime}%`, icon: Activity, color: 'green', change: '+0.1%' },
          { label: 'Active Connections', value: realTimeStats.activeConnections.toLocaleString(), icon: Globe, color: 'orange', change: '+8%' },
          { label: 'AI Accuracy', value: '97.3%', icon: Brain, color: 'pink', change: '+0.3%' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/10 border border-${stat.color}-500/30 rounded-xl p-4 backdrop-blur-sm shadow-lg hover:shadow-${stat.color}-500/25 transition-all duration-200`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">{stat.label}</p>
              <p className="text-white font-bold text-lg">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Threat Geography */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
          <Globe className="w-6 h-6 text-blue-400" />
          <span>Global Threat Origins</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {threatMap.map((location, index) => (
            <div key={index} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{location.country}</h4>
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Attacks</span>
                  <span className="text-red-400 font-semibold">{location.attacks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Blocked</span>
                  <span className="text-emerald-400 font-semibold">{location.blocked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Success Rate</span>
                  <span className="text-blue-400 font-semibold">
                    {((location.blocked / location.attacks) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Defense Layers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
          <Layers className="w-6 h-6 text-purple-400" />
          <span>Multi-Layer Defense Matrix</span>
        </h3>
        <div className="space-y-4">
          {defenseLayers.map((layer, index) => (
            <motion.div
              key={layer.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-xl border border-gray-600/50 hover:border-emerald-500/30 transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse shadow-emerald-400/50 shadow-lg"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                </div>
                <div>
                  <h4 className="text-white font-semibold">{layer.name}</h4>
                  <p className="text-gray-400 text-sm">Layer {index + 1} - Active Protection</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-emerald-400 font-bold text-lg">{layer.blocked}</p>
                  <p className="text-gray-400 text-sm">Threats Blocked</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 font-bold text-lg">{layer.efficiency}%</p>
                  <p className="text-gray-400 text-sm">Efficiency</p>
                </div>
                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${layer.efficiency}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Live Attack Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Target className="w-6 h-6 text-red-400" />
            <span>Live Attack Feed</span>
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-emerald-400">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-emerald-400/50 shadow-lg"></div>
              <span className="text-sm font-medium">Live Monitoring</span>
            </div>
            <button
              onClick={loadLiveThreats}
              disabled={loading}
              className="bg-gray-700/50 hover:bg-gray-600/50 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Activity className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {attacks.map((attack, index) => (
            <motion.div
              key={attack.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-700/20 to-gray-800/20 rounded-xl border border-gray-600/30 hover:border-red-500/30 transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h4 className="text-white font-semibold">{attack.type}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getSeverityColor(attack.severity)}`}>
                      {attack.severity.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(attack.status)}`}>
                      {attack.status === 'blocked' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                      {attack.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
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
                <button
                  onClick={() => sendAlertToAuthorities(attack)}
                  className="p-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg transition-colors"
                  title="Alert Authorities"
                >
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                </button>
                <button
                  onClick={() => blockThreat(attack.id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-colors"
                  title="Block Threat"
                >
                  <Ban className="w-4 h-4 text-red-400" />
                </button>
                <button className="p-2 bg-gray-600/50 hover:bg-gray-500/50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {attacks.length === 0 && !loading && (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">All Clear</h3>
            <p className="text-gray-400">No active threats detected. Systems are secure.</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading threat data...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LiveThreats;