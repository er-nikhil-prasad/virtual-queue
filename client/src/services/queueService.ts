import type { Manager, Queue, SuperManager } from '../types';
import { db } from '../mockDb';

export const checkManagerExists = (phone: string): boolean => {
    const allManagers: Manager[] = JSON.parse(localStorage.getItem('vq_managers') || '[]');
    return allManagers.some((m: Manager) => m.phone === phone);
};

export const verifyManager = (phone: string, pin: string): Manager | null => {
    const allManagers: Manager[] = JSON.parse(localStorage.getItem('vq_managers') || '[]');
    const manager = allManagers.find((m: Manager) => m.phone === phone && m.pin === pin);
    return manager || null;
};

// [NEW] Unified Login
// Priority: Check Manager first (for Individuals who are both Manager + SuperManager)
// Then SuperManager only (for Team owners who don't manage queues directly)
export const unifiedLogin = (phone: string, pin: string): { type: 'super' | 'manager'; user: any } | null => {
    // 1. Check Manager first (Individual users have both Manager + SuperManager records)
    const m = verifyManager(phone, pin);
    if (m) {
        localStorage.setItem('vq_manager', JSON.stringify(m));
        return { type: 'manager', user: m };
    }

    // 2. Check Super Manager (Team Owner only - no Manager record)
    const sm = loginSuperManager(phone, pin);
    if (sm) return { type: 'super', user: sm };

    return null;
};

export const getManagerQueue = (phone: string): Queue | null => {
    const allQueues: Queue[] = db.getQueues();
    return allQueues.find((q: Queue) => q.assignedManagerPhone === phone) || null;
};

export const signupManager = (name: string, phone: string, pin: string): Manager => {
    const allManagers: Manager[] = JSON.parse(localStorage.getItem('vq_managers') || '[]');
    const existingIdx = allManagers.findIndex(m => m.phone === phone);

    if (existingIdx !== -1) {
        // Update existing manager
        const updatedManager = { ...allManagers[existingIdx], name, pin };
        allManagers[existingIdx] = updatedManager;
        localStorage.setItem('vq_managers', JSON.stringify(allManagers));
        return updatedManager;
    } else {
        // Create new
        const newManager: Manager = {
            id: 'm-' + Math.random().toString(36).substr(2, 9),
            name,
            phone,
            pin
        };
        allManagers.push(newManager);
        localStorage.setItem('vq_managers', JSON.stringify(allManagers));
        return newManager;
    }
};

export const ensureManagerRecord = (name: string, phone: string) => {
    const allManagers: Manager[] = JSON.parse(localStorage.getItem('vq_managers') || '[]');
    if (!allManagers.some(m => m.phone === phone)) {
        const newManager: Manager = {
            id: 'm-' + Math.random().toString(36).substr(2, 9),
            name,
            phone,
            pin: '' // No PIN yet
        };
        allManagers.push(newManager);
        localStorage.setItem('vq_managers', JSON.stringify(allManagers));
    }
};

// --- Super Manager Auth ---

export const signupSuperManager = (name: string, phone: string, pin: string): SuperManager => {
    const allSMs: SuperManager[] = JSON.parse(localStorage.getItem('vq_super_managers') || '[]');

    if (allSMs.some(sm => sm.phone === phone)) {
        throw new Error('Phone number already registered. Please login.');
    }

    const newSM: SuperManager = {
        id: 'sm-' + Math.random().toString(36).substr(2, 9),
        name,
        phone,
        pin
    };

    allSMs.push(newSM);
    localStorage.setItem('vq_super_managers', JSON.stringify(allSMs));
    setSuperManagerSession(newSM); // Auto login
    return newSM;
};

export const loginSuperManager = (phone: string, pin: string): SuperManager | null => {
    const allSMs: SuperManager[] = JSON.parse(localStorage.getItem('vq_super_managers') || '[]');
    const sm = allSMs.find(sm => sm.phone === phone && sm.pin === pin) || null;
    if (sm) setSuperManagerSession(sm);
    return sm;
};

export const getSuperManager = (): SuperManager | null => {
    return JSON.parse(localStorage.getItem('vq_sm_session') || 'null');
};

export const setSuperManagerSession = (sm: SuperManager | null) => {
    if (sm) {
        localStorage.setItem('vq_sm_session', JSON.stringify(sm));
    } else {
        localStorage.removeItem('vq_sm_session');
    }
};

// --- Queue Management ---

export const setupBusiness = (
    queueDetails: { name: string; avgTime: number },
    managerDetails: { mode: 'self' | 'assistant'; name?: string; phone?: string; pin?: string }
) => {
    // 1. Get Current Super Manager
    const sm = getSuperManager();
    if (!sm) throw new Error('Unauthorized: Please login first.');

    // 2. Determine Manager Info
    let assignedPhone = '';

    if (managerDetails.mode === 'self') {
        assignedPhone = sm.phone;
        ensureManagerRecord(sm.name, sm.phone);
    } else {
        if (!managerDetails.name || !managerDetails.phone || !managerDetails.pin) {
            throw new Error('Assistant details missing');
        }
        assignedPhone = managerDetails.phone;
        signupManager(managerDetails.name, managerDetails.phone, managerDetails.pin);
    }

    // 3. Create Queue
    const newQueue: Queue = {
        id: 'q-' + Math.random().toString(36).substr(2, 9),
        superManagerId: sm.id,
        name: queueDetails.name,
        avgServiceTime: queueDetails.avgTime,
        dailyLimit: 100,
        assignedManagerPhone: assignedPhone
    };

    db.addQueue(newQueue);

    return {
        success: true,
        queue: newQueue,
        isOwner: managerDetails.mode === 'self'
    };
};

// [NEW] Setup Individual (Owner + Queue + Self-Manager)
export const setupIndividual = (
    name: string,
    phone: string,
    pin: string,
    queueName: string,
    avgTime: number
) => {
    // 1. Create Super Manager (The Individual is the Owner)
    // Note: Re-using signupSuperManager logic but we might need to handle if they already exist silently or error.
    // For now, let's assume fresh signup.
    let sm;
    try {
        sm = signupSuperManager(name, phone, pin);
    } catch (e) {
        // If already exists, try to login? Or just fail.
        // For simplicity in this mock, we assume fresh or fail.
        throw e;
    }

    // 2. Create the Queue
    const newQueue: Queue = {
        id: 'q-' + Math.random().toString(36).substr(2, 9),
        superManagerId: sm.id,
        name: queueName,
        avgServiceTime: avgTime,
        dailyLimit: 100,
        assignedManagerPhone: sm.phone // They manage themselves
    };
    db.addQueue(newQueue);

    // 3. Create Manager Record (Self)
    // This ensures they can login as a manager too (unified login checks both, but for dashboard access)
    // Actually, if we use Unified Login, we need to decide:
    // If they login as "Individual", do they see the Manager Dashboard or Admin Dashboard?
    // Requirement says: "Redirect: Directly to /manager/dashboard."
    // So they should be logged in as a Manager.
    signupManager(name, phone, pin); // This creates the manager record.

    return { success: true, user: sm };
};

// [NEW] Setup Team (Business Account Only)
export const setupTeam = (
    businessName: string, // Not used in User model, maybe just Owner Name? Assuming Owner Name for now.
    ownerName: string,
    phone: string,
    pin: string
) => {
    return signupSuperManager(ownerName, phone, pin);
};

export const getOwnerDashboardData = () => {
    const sm = getSuperManager();
    if (!sm) return [];

    const queues = db.getQueues();
    // Filter queues owned by this Super Manager
    const myQueues = queues.filter((q: Queue) => q.superManagerId === sm.id);

    const users = db.getUsers();
    const managers: Manager[] = JSON.parse(localStorage.getItem('vq_managers') || '[]');

    return myQueues.map((q: Queue) => {
        const activeCount = users.filter((u: any) => u.queueId === q.id && u.status === 'waiting').length;
        const servedCount = users.filter((u: any) => u.queueId === q.id && u.status === 'served').length;

        const manager = managers.find((m: Manager) => m.phone === q.assignedManagerPhone);
        const assistantName = manager ? manager.name : 'Unknown';

        return {
            queueId: q.id,
            queueName: q.name,
            assistantName,
            activeCount,
            servedCount
        };
    });
};
