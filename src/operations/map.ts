import { Context } from '../types';

export interface MapInput {
    url: string;
    params?: any;
}

export interface MapOutput {
    success: boolean;
    data?: any;
    error?: string;
}

export const map =
    (context: Context) =>
    async (input: MapInput): Promise<MapOutput> => {
        const { client, logger } = context;

        logger?.debug('map:start', { data: input });

        try {
            const response = await context.executeQueued<any>(() =>
                client.map(input.url, input.params),
            );

            logger?.debug('map:success');
            return {
                success: true,
                data: response,
            };
        } catch (error: any) {
            logger?.debug('map:error', { error });
            return {
                success: false,
                error: error.message || String(error),
            };
        }
    };
