const KEY = 'rota-boas-vindas';
/** Saved filters mean someone has used the map before the welcome existed: they don't need it. */
const RETURNING = 'fruta-filtros';
type Store = Pick<Storage, 'getItem' | 'setItem'>;

/** True the first time someone opens the map. Blocked storage counts as seen, so it never nags. */
export function isFirstVisit(store: Store): boolean {
	try {
		return store.getItem(KEY) === null && store.getItem(RETURNING) === null;
	} catch {
		return false;
	}
}

export function markWelcomed(store: Store): void {
	try {
		store.setItem(KEY, '1');
	} catch {
		// Private mode or blocked storage: nothing to remember it in.
	}
}
