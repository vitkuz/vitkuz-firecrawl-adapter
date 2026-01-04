import { FirecrawlClient } from './client';

export enum FirecrawlPlan {
    FREE = 'free',
    HOBBY = 'hobby',
    STANDARD = 'standard',
    GROWTH = 'growth',
}

export type ExecuteQueued = <T>(fn: () => Promise<T>) => Promise<T>;

export interface Logger {
    debug: (message: string, context?: { error?: any; data?: any }) => void;
    [key: string]: any;
}

export interface Context {
    client: FirecrawlClient;
    logger?: Logger;
    executeQueued: ExecuteQueued;
}
