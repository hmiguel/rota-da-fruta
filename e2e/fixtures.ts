import { test as base } from '@playwright/test';

export { expect } from '@playwright/test';
export type { APIRequestContext, Page } from '@playwright/test';

/**
 * Tests never load analytics: no fake hits in the stats, and no third-party timing in the results.
 * They also start as returning visitors, past the first-visit welcome, unless a test asks for
 * `test.use({ welcomed: false })`.
 */
export const test = base.extend<{ welcomed: boolean }>({
	welcomed: [true, { option: true }],
	context: async ({ context, welcomed }, use) => {
		await context.route(/googletagmanager\.com|google-analytics\.com/, (route) => route.abort());
		if (welcomed) await context.addInitScript(() => localStorage.setItem('rota-boas-vindas', '1'));
		await use(context);
	}
});
