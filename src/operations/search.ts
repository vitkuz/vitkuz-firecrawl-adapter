import { Context } from '../types';

export interface SearchInput {
    query: string;
    params?: any;
}

export interface SearchOutput {
    success: boolean;
    data?: any;
    error?: string;
}

export const search =
    (context: Context) =>
    async (input: SearchInput): Promise<SearchOutput> => {
        const { client, logger } = context;

        logger?.debug('search:start', { data: input });

        try {
            const response = await context.executeQueued<any>(() =>
                client.search(input.query, input.params),
            );

            logger?.debug('search:success');
            return {
                success: true,
                data: response,
            };
        } catch (error: any) {
            logger?.debug('search:error', { error });
            return {
                success: false,
                error: error.message || String(error),
            };
        }
    };
