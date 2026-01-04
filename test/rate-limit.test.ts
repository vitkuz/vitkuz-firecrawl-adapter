import { createLookingGlassQueue } from '../src/queue';
import { FirecrawlPlan } from '../src/types';
import { performance } from 'perf_hooks';

async function testRateLimit() {
    console.log('Testing Functional Queue for FREE Plan (10 req/min -> ~6000ms delay)...');

    // Create a queue for the FREE plan
    const executeQueued = createLookingGlassQueue(FirecrawlPlan.FREE);

    const start = performance.now();
    const timestamps: number[] = [];

    // Simulate 3 rapid requests
    const makeRequest = async (id: number) => {
        return executeQueued(async () => {
            const now = performance.now();
            timestamps.push(now);
            console.log(`Request ${id} executed at ${Math.round(now - start)}ms`);
            return `Result ${id}`;
        });
    };

    console.log('Dispatching 3 requests immediately...');

    await Promise.all([makeRequest(1), makeRequest(2), makeRequest(3)]);

    // Validation
    console.log('\nValidation:');
    for (let i = 0; i < timestamps.length - 1; i++) {
        const diff = timestamps[i + 1] - timestamps[i];
        console.log(`Delay between Req ${i + 1} and Req ${i + 2}: ${Math.round(diff)}ms`);
        if (diff >= 5900) {
            // Allow slight jitter, target is 6000
            console.log('PASS: Delay sufficient.');
        } else {
            console.error('FAIL: Delay too short!');
            process.exit(1);
        }
    }
    console.log('All rate limit tests passed.');
}

testRateLimit().catch((err) => {
    console.error(err);
    process.exit(1);
});
