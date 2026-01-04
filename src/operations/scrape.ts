import { Context } from '../types';

export interface ScrapeInput {
    url: string;
    params?: any;
}

export interface ScrapeOutput {
    success: boolean;
    data?: any;
    error?: string;
}

export const scrape =
    (context: Context) =>
    async (input: ScrapeInput): Promise<ScrapeOutput> => {
        const { client, logger } = context;

        logger?.debug('scrape:start', { data: input });

        try {
            // v1 uses .scrape()
            const response = await context.executeQueued<any>(() =>
                client.scrape(input.url, input.params),
            );

            logger?.debug('scrape:success');
            return {
                success: true,
                data: response,
            };
        } catch (error: any) {
            logger?.debug('scrape:error', { error });
            return {
                success: false,
                error: error.message || String(error),
            };
        }
    };
