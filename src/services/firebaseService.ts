import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Vulnerability, ScanTarget, Attack, Report } from '../types';

export class FirebaseService {
  // Vulnerabilities
  async addVulnerability(vulnerability: Omit<Vulnerability, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'vulnerabilities'), {
        ...vulnerability,
        discovered: Timestamp.fromDate(new Date(vulnerability.discovered))
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding vulnerability:', error);
      throw error;
    }
  }

  async getVulnerabilities() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'vulnerabilities'), orderBy('discovered', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        discovered: doc.data().discovered.toDate().toISOString()
      })) as Vulnerability[];
    } catch (error) {
      console.error('Error getting vulnerabilities:', error);
      throw error;
    }
  }

  // Scan Targets
  async addScanTarget(target: Omit<ScanTarget, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'scanTargets'), target);
      return docRef.id;
    } catch (error) {
      console.error('Error adding scan target:', error);
      throw error;
    }
  }

  async updateScanTarget(id: string, updates: Partial<ScanTarget>) {
    try {
      await updateDoc(doc(db, 'scanTargets', id), updates);
    } catch (error) {
      console.error('Error updating scan target:', error);
      throw error;
    }
  }

  async getScanTargets() {
    try {
      const querySnapshot = await getDocs(collection(db, 'scanTargets'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ScanTarget[];
    } catch (error) {
      console.error('Error getting scan targets:', error);
      throw error;
    }
  }

  // Attacks
  async addAttack(attack: Omit<Attack, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'attacks'), {
        ...attack,
        timestamp: Timestamp.fromDate(new Date(attack.timestamp))
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding attack:', error);
      throw error;
    }
  }

  async getRecentAttacks(limitCount = 50) {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'attacks'), 
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        )
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate().toISOString().replace('T', ' ').slice(0, 19)
      })) as Attack[];
    } catch (error) {
      console.error('Error getting attacks:', error);
      throw error;
    }
  }

  // Reports
  async generateReport(report: Omit<Report, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'reports'), {
        ...report,
        generated: Timestamp.fromDate(new Date(report.generated))
      });
      return docRef.id;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  // Real-time listeners
  subscribeToAttacks(callback: (attacks: Attack[]) => void) {
    return onSnapshot(
      query(collection(db, 'attacks'), orderBy('timestamp', 'desc'), limit(10)),
      (snapshot) => {
        const attacks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate().toISOString().replace('T', ' ').slice(0, 19)
        })) as Attack[];
        callback(attacks);
      }
    );
  }

  subscribeToVulnerabilities(callback: (vulnerabilities: Vulnerability[]) => void) {
    return onSnapshot(
      query(collection(db, 'vulnerabilities'), orderBy('discovered', 'desc')),
      (snapshot) => {
        const vulnerabilities = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          discovered: doc.data().discovered.toDate().toISOString()
        })) as Vulnerability[];
        callback(vulnerabilities);
      }
    );
  }

  // Send alert to authorities
  async sendAlertToAuthorities(alertData: {
    type: 'critical_vulnerability' | 'active_attack' | 'system_breach';
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    affectedSystems: string[];
    recommendedActions: string[];
  }) {
    try {
      const alert = {
        ...alertData,
        timestamp: Timestamp.now(),
        status: 'sent',
        recipients: ['security@company.com', 'admin@company.com']
      };
      
      const docRef = await addDoc(collection(db, 'alerts'), alert);
      
      // In a real implementation, this would trigger email/SMS notifications
      console.log('Alert sent to authorities:', alert);
      
      return docRef.id;
    } catch (error) {
      console.error('Error sending alert:', error);
      throw error;
    }
  }
}

export const firebaseService = new FirebaseService();