export const db = {
    getSuperManager: () => JSON.parse(localStorage.getItem('vq_sm') || 'null'),
    setSuperManager: (data: any) => localStorage.setItem('vq_sm', JSON.stringify(data)),

    getQueues: () => JSON.parse(localStorage.getItem('vq_queues') || '[]'),
    setQueues: (queues: any[]) => localStorage.setItem('vq_queues', JSON.stringify(queues)),

    addQueue: (queue: any) => {
        const queues = db.getQueues();
        queues.push(queue);
        db.setQueues(queues);
    },

    getManager: () => JSON.parse(localStorage.getItem('vq_manager') || 'null'),
    setManager: (data: any) => localStorage.setItem('vq_manager', JSON.stringify(data)),

    // Users are stored as a flat list with queueId
    getUsers: () => JSON.parse(localStorage.getItem('vq_users') || '[]'),
    setUsers: (users: any[]) => localStorage.setItem('vq_users', JSON.stringify(users)),

    addUser: (user: any) => {
        const users = db.getUsers();
        users.push(user);
        db.setUsers(users);
    },

    updateUser: (userId: string, updates: any) => {
        const users = db.getUsers();
        const idx = users.findIndex((u: any) => u.id === userId);
        if (idx !== -1) {
            users[idx] = { ...users[idx], ...updates };
            db.setUsers(users);
        }
    }
};
