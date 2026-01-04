
# Firecrawl API Limits and Pricing

(As of research on 2026-01-04)

Firecrawl uses a credit-based system for scraping and crawling (1 page = 1 credit). The `/extract` endpoint uses a separate token-based model.

## Rate Limits (Requests per Minute)

Limits are enforced to ensure service stability.

| Plan | Scrapes / min | Crawls / min | Concurrent Browsers |
| :--- | :--- | :--- | :--- |
| **Free** | 10 | 1 | Limited |
| **Hobby** | 20 | 3 | Limited |
| **Standard** | 100 | 10 | Higher |
| **Growth** | 1,000 | 50 | Higher |

## Pricing Plans (Monthly)

| Plan | Price | Credits / Month | Features |
| :--- | :--- | :--- | :--- |
| **Free** | $0 | 500 | No credit card required. |
| **Hobby** | ~$16 | 3,000 | 1 Seat. |
| **Standard** | ~$83 | 100,000 | 3 Seats. Popular. |
| **Growth** | ~$333 | 500,000 | 5 Seats. Priority Support. |
| **Enterprise**| Custom | Custom | Custom concurrency, proxies, security. |

*Note: Prices and credits are approximate and subject to change by Firecrawl.*

## Notes
- **Concurrency**: Firecrawl limits how many pages can be processed simultaneously. Exceeding specific concurrency limits for your plan will queue jobs.
- **Queueing**: If rate limits are exceeded, additional jobs are queued until resources allow.
- **Extract Endpoint**: Pricing for the AI `/extract` feature is separate (token-based), starting around $89/month.
