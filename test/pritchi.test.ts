import { createAdapter } from '../src/adapter';
import { FirecrawlPlan } from '../src/types';
import dotenv from 'dotenv';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';

// Load env vars
dotenv.config();

const API_KEY = process.env.FIRECRAWL_API_KEY;

if (!API_KEY) {
    console.error('FIRECRAWL_API_KEY is missing in .env');
    process.exit(1);
}

const adapter = createAdapter({
    apiKey: API_KEY,
    plan: FirecrawlPlan.FREE, // Use free plan logic
    logger: {
        debug: (msg, ctx) => console.log(`[DEBUG] ${msg} ${ctx ? JSON.stringify(ctx) : ''}`),
    },
});

const TARGET_URL = 'https://pritchi.ru/id_2777';

async function runTests() {
    console.log('--- Starting Pritchi Tests ---');
    const results: any = {};

    // 1. Scrape
    console.log('\n1. Testing scrape()...');
    try {
        const scrapeRes = await adapter.scrape({
            url: TARGET_URL,
            params: { formats: ['markdown'] },
        });
        console.log('Scrape success:', scrapeRes.success);
        results.scrape = scrapeRes;
    } catch (e) {
        console.error('Scrape failed:', e);
        results.scrape = { error: String(e) };
    }

    // 2. Search
    console.log('\n2. Testing search()...');
    try {
        const searchRes = await adapter.search({
            query: 'site:pritchi.ru "id_2777"',
            params: { limit: 3 },
        });
        console.log('Search success:', searchRes.success);
        results.search = searchRes;
    } catch (e) {
        console.error('Search failed:', e);
        results.search = { error: String(e) };
    }

    // 3. Map
    console.log('\n3. Testing map()...');
    try {
        const mapRes = await adapter.map({
            url: 'https://pritchi.ru',
            params: { limit: 5 },
        });
        console.log('Map success:', mapRes.success);
        results.map = mapRes;
    } catch (e) {
        console.error('Map failed:', e);
        results.map = { error: String(e) };
    }

    // 4. Crawl
    console.log('\n4. Testing crawl()...');
    try {
        const crawlRes = await adapter.crawl({
            url: TARGET_URL,
            params: {
                limit: 2,
                scrapeOptions: { formats: ['markdown'] },
            },
            waitOption: true, // Wait for small crawl
        });
        console.log('Crawl success:', crawlRes.success);
        results.crawl = crawlRes;
    } catch (e) {
        console.error('Crawl failed:', e);
        results.crawl = { error: String(e) };
    }

    // Save results
    const outputDir = join(__dirname, 'responses');
    await mkdir(outputDir, { recursive: true });
    const outputPath = join(outputDir, 'pritchi.result.json');
    await writeFile(outputPath, JSON.stringify(results, null, 2));
    console.log(`\nSaved all results to ${outputPath}`);
}

runTests().catch(console.error);
