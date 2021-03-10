export interface User {
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    balance: number;
}

export interface Log {
    balance: number;
    createdAt: string;
    status: string;
    transaction: number;
    updatedAt: string;
}
