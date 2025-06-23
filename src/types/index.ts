export interface Vulnerability {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  target: string;
  description: string;
  cvss: number;
  discovered: string;
  status: 'new' | 'confirmed' | 'in-progress' | 'resolved';
}

export interface ScanTarget {
  id: string;
  name: string;
  type: 'web' | 'mobile' | 'infrastructure' | 'iot' | 'firmware' | 'os';
  url?: string;
  status: 'idle' | 'scanning' | 'completed' | 'error';
  lastScan?: string;
  vulnerabilities: number;
}

export interface Attack {
  id: string;
  timestamp: string;
  source: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'blocked' | 'mitigated' | 'investigating';
  layers: number;
}

export interface Report {
  id: string;
  title: string;
  type: 'vulnerability' | 'incident' | 'compliance';
  generated: string;
  status: 'draft' | 'final' | 'sent';
  recipients: string[];
}