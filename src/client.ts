import FirecrawlApp from '@mendable/firecrawl-js';

export type FirecrawlClient = FirecrawlApp;

export const createClient = (apiKey: string): FirecrawlClient => {
    return new FirecrawlApp({ apiKey });
};
