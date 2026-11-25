import { test as base } from '@playwright/test';

export { expect } from '@playwright/test';
export type { APIRequestContext, Page } from '@playwright/test';

/** Tests never load analytics: no fake hits in the stats, and no third-party timing in the results. */
export const test = base.extend({
	context: async ({ context }, use) => {
		await context.route(/googletagmanager\.com|google-analytics\.com/, (route) => route.abort());
		await use(context);
	}
});
