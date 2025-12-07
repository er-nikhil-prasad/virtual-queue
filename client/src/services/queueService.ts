import type { Manager, Queue } from '../types';
import { db } from '../mockDb';

export const checkManagerExists = (phone: string): boolean => {
    // START DB FIX: We need to ensure db supports multiple managers
    const allManagers: Manager[] = JSON.parse(localStorage.getItem('vq_managers') || '[]');
    return allManagers.some((m: Manager) => m.phone === phone);
};

export const verifyManager = (phone: string, pin: string): Manager | null => {
    const allManagers: Manager[] = JSON.parse(localStorage.getItem('vq_managers') || '[]');
    const manager = allManagers.find((m: Manager) => m.phone === phone && m.pin === pin);
    return manager || null;
};

export const getManagerQueue = (phone: string): Queue | null => {
    const allQueues: Queue[] = db.getQueues();
    return allQueues.find((q: Queue) => q.assignedManagerPhone === phone) || null;
};

// Signup or Update existing manager (if just setting PIN for first time)
export const signupManager = (name: string, phone: string, pin: string): Manager => {
    const allManagers: Manager[] = JSON.parse(localStorage.getItem('vq_managers') || '[]');

    const existingIdx = allManagers.findIndex(m => m.phone === phone);

    if (existingIdx !== -1) {
        // Update existing manager (e.g. setting PIN for the first time)
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

// Helper to pre-create a manager placeholder (e.g. when SM assigns an assistant but hasn't set PIN yet? 
// Actually current requirement says SM sets PIN for assistant.
// But for "Self Manage", SM might not be in manager DB yet.
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

export const setupBusiness = (
    ownerDetails: { name: string; phone: string },
    queueDetails: { name: string; avgTime: number },
    managerDetails: { mode: 'self' | 'assistant'; name?: string; phone?: string; pin?: string }
) => {
    // 1. Create Super Manager (Mock Session)
    const smId = 'sm-' + Math.random().toString(36).substr(2, 9);
    const superManager = { id: smId, ...ownerDetails };
    // In a real app, we'd persist this. For mock, we just use it to link.
    // We can store it if we want to simulate "logged in business owner"
    localStorage.setItem('vq_sm', JSON.stringify(superManager));

    // 2. Determine Manager Info
    let assignedPhone = '';

    if (managerDetails.mode === 'self') {
        assignedPhone = ownerDetails.phone;
        ensureManagerRecord(ownerDetails.name, ownerDetails.phone);
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
        superManagerId: smId,
        name: queueDetails.name,
        avgServiceTime: queueDetails.avgTime,
        dailyLimit: 100, // Default
        assignedManagerPhone: assignedPhone
    };

    db.addQueue(newQueue);

    return {
        success: true,
        queue: newQueue,
        isOwner: managerDetails.mode === 'self'
    };
};
