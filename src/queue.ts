import { FirecrawlPlan, ExecuteQueued } from './types';

const PLAN_LIMITS: Record<FirecrawlPlan, number> = {
    [FirecrawlPlan.FREE]: 10,
    [FirecrawlPlan.HOBBY]: 20,
    [FirecrawlPlan.STANDARD]: 100,
    [FirecrawlPlan.GROWTH]: 1000,
};

export const createLookingGlassQueue = (
    plan: FirecrawlPlan = FirecrawlPlan.FREE,
): ExecuteQueued => {
    const limitPerMin = PLAN_LIMITS[plan] || PLAN_LIMITS[FirecrawlPlan.FREE];
    const intervalMs = Math.ceil(60000 / limitPerMin);

    // Internal state captured in closure
    let nextAllowedTime = Date.now();

    return async <T>(fn: () => Promise<T>): Promise<T> => {
        const now = Date.now();
        // Calculate wait time
        const waitTime = Math.max(0, nextAllowedTime - now);

        // Update next allowed time immediately to reserve the slot
        // The next request must start at least intervalMs after this one was SCHEDULED to start
        nextAllowedTime = now + waitTime + intervalMs;

        if (waitTime > 0) {
            await new Promise((resolve) => setTimeout(resolve, waitTime));
        }

        return fn();
    };
};
