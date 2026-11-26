import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures.ts';

test.use({ welcomed: false });

test('first visit explains the map once', async ({ page }) => {
	await page.goto('/');
	const welcome = page.getByTestId('welcome');
	await expect(welcome).toBeVisible();
	await expect(welcome.getByRole('heading')).toHaveText('Boas-vindas à Rota da Fruta');
	await expect(welcome).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(page.getByTestId('welcome-start')).toBeFocused();
	const { violations } = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
		.exclude('.maplibregl-canvas')
		.analyze();
	expect(violations.map((v) => v.id)).toEqual([]);
	await page.getByTestId('welcome-start').click();
	await expect(welcome).toBeHidden();
	await expect(page.getByTestId('chip-all')).toBeVisible();
	await page.reload();
	await expect(page.getByTestId('chip-all')).toBeVisible();
	await expect(welcome).toBeHidden();
});

test('the welcome speaks English on /en and closes with Escape', async ({ page }) => {
	await page.goto('/en');
	await expect(page.getByTestId('welcome').getByRole('heading')).toHaveText('Welcome to Rota da Fruta');
	await page.keyboard.press('Escape');
	await expect(page.getByTestId('welcome')).toBeHidden();
});

test('a shared link still gets the welcome on a first visit', async ({ page }) => {
	await page.goto('/?fruta=figo');
	await expect(page.getByTestId('welcome')).toBeVisible();
});
