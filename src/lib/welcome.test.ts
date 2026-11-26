import { expect, test } from 'vitest';
import { isFirstVisit, markWelcomed } from './welcome.ts';

const memory = (init: Record<string, string> = {}) => {
	const m = new Map(Object.entries(init));
	return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};

test('a new visitor is welcomed once', () => {
	const store = memory();
	expect(isFirstVisit(store)).toBe(true);
	markWelcomed(store);
	expect(isFirstVisit(store)).toBe(false);
});

test('someone who already used the map is not welcomed', () => {
	expect(isFirstVisit(memory({ 'fruta-filtros': '{"species":[],"onlyPickable":true}' }))).toBe(false);
});

test('blocked storage never shows the welcome and never throws', () => {
	const blocked = {
		getItem: () => {
			throw new Error('blocked');
		},
		setItem: () => {
			throw new Error('blocked');
		}
	};
	expect(isFirstVisit(blocked)).toBe(false);
	expect(() => markWelcomed(blocked)).not.toThrow();
});
