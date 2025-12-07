export interface SuperManager {
    id: string;
    name: string;
    phone: string;
}

export interface Manager {
    id: string;
    name: string;
    phone: string;
    pin: string;
    queueId?: string; // Optional, linked to a queue
}

export interface Queue {
    id: string;
    superManagerId: string;
    name: string;
    avgServiceTime: number;
    dailyLimit: number;
    assignedManagerPhone: string; // [NEW] Link to manager
}

export interface UserInQueue {
    id: string;
    queueId: string;
    name: string;
    phone: string;
    position: number;
    status: 'waiting' | 'served' | 'pushed_down';
    joinedAt: string;
    plan: 'none' | 'premium';
}
