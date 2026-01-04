import { createClient, FirecrawlClient } from './client';
import { Context, Logger, FirecrawlPlan } from './types';
import { createLookingGlassQueue } from './queue';
import { scrape, ScrapeInput, ScrapeOutput } from './operations/scrape';
import { search, SearchInput, SearchOutput } from './operations/search';
import { map, MapInput, MapOutput } from './operations/map';
import { crawl, CrawlInput, CrawlOutput } from './operations/crawl';

export interface AdapterConfig {
    apiKey: string;
    plan?: FirecrawlPlan;
    logger?: Logger;
}

export interface Adapter {
    client: FirecrawlClient;
    scrape: (input: ScrapeInput) => Promise<ScrapeOutput>;
    search: (input: SearchInput) => Promise<SearchOutput>;
    map: (input: MapInput) => Promise<MapOutput>;
    crawl: (input: CrawlInput) => Promise<CrawlOutput>;
}

export const createAdapter = (config: AdapterConfig): Adapter => {
    const client = createClient(config.apiKey);
    const executeQueued = createLookingGlassQueue(config.plan);
    const context: Context = {
        client,
        logger: config.logger,
        executeQueued,
    };

    return {
        client,
        scrape: scrape(context),
        search: search(context),
        map: map(context),
        crawl: crawl(context),
    };
};
