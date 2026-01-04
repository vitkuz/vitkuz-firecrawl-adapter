import { Context } from '../types';

export interface CrawlInput {
    url: string;
    params?: any;
    waitOption?: boolean;
}

export interface CrawlOutput {
    success: boolean;
    id?: string;
    data?: any;
    error?: string;
}

export const crawl =
    (context: Context) =>
    async (input: CrawlInput): Promise<CrawlOutput> => {
        const { client, logger } = context;

        logger?.debug('crawl:start', { data: input });

        try {
            let response;
            if (input.waitOption) {
                response = await context.executeQueued<any>(() =>
                    client.crawl(input.url, input.params),
                );
            } else {
                // startCrawl
                response = await context.executeQueued<any>(() =>
                    client.startCrawl(input.url, input.params),
                );
            }

            logger?.debug('crawl:success', {
                data: { id: response.id || (response as any).jobId },
            }); // response might vary slightly

            return {
                success: true,
                id: response.id,
                data: response,
            };
        } catch (error: any) {
            logger?.debug('crawl:error', { error });
            return {
                success: false,
                error: error.message || String(error),
            };
        }
    };
