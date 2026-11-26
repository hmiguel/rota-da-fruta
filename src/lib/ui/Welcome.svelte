<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { t } from '../i18n/index.svelte.ts';
	import { app } from '../state.svelte.ts';
	import Icon from './kit/Icon.svelte';
	import { trapTab } from './trap.ts';

	/** First visit only: what the site is and how to read the map, in a few lines. */
	let { onClose }: { onClose: () => void } = $props();
	let box: HTMLDivElement;
	const still = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	onMount(() => {
		// Like the menu: everything behind is switched off until it closes.
		const around = [...(box.parentElement?.children ?? [])].filter(
			(el): el is HTMLElement => el !== box && el instanceof HTMLElement && !el.inert
		);
		for (const el of around) el.inert = true;
		// Focus the card, not the button, so no focus ring greets a first-time visitor; Tab reaches it next.
		box.querySelector<HTMLElement>('[role=dialog]')?.focus();
		return () => {
			for (const el of around) el.inert = false;
		};
	});

	function onKey(e: KeyboardEvent) {
		if (!app.welcomeOpen) return;
		if (e.key === 'Escape') return onClose();
		trapTab(e, box);
	}
</script>

<svelte:window onkeydown={onKey} />

<div
	class="backdrop"
	bind:this={box}
	transition:fade={{ duration: still ? 0 : 150 }}
	onclick={(e) => e.target === e.currentTarget && onClose()}
	role="presentation"
>
	<div
		class="card"
		role="dialog"
		aria-modal="true"
		aria-labelledby="welcome-title"
		aria-describedby="welcome-lead"
		data-testid="welcome"
		tabindex="-1"
	>
		<h2 id="welcome-title">{t('welcome.title')}</h2>
		<p id="welcome-lead" class="lead">{t('welcome.lead')}</p>
		<ul>
			<li>
				<span class="pic" aria-hidden="true"
					><img src="/art/sm/orange.webp" alt="" /><img class="faded" src="/art/sm/orange.webp" alt="" /></span
				>
				<span>{t('welcome.dots')}</span>
			</li>
			<li>
				<span class="pic" aria-hidden="true"><i class="cluster">12</i></span>
				<span>{t('welcome.clusters')}</span>
			</li>
			<li>
				<span class="pic" aria-hidden="true"><Icon name="settings" /></span>
				<span>{t('welcome.filter')}</span>
			</li>
			<li>
				<span class="pic" aria-hidden="true"><Icon name="info" /></span>
				<span>{t('welcome.tap')}</span>
			</li>
			<li>
				<span class="pic" aria-hidden="true"><Icon name="leaf" /></span>
				<span>{t('welcome.respect')}</span>
			</li>
		</ul>
		<button class="start" data-testid="welcome-start" onclick={onClose}>{t('welcome.start')}</button>
	</div>
</div>

<style>
	.backdrop {
		position: fixed;
		z-index: 9;
		inset: 0;
		display: grid;
		place-items: center;
		padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom));
		background: rgb(58 50 38 / 0.35);
		overflow-y: auto;
	}
	.card:focus {
		outline: none;
	}
	.card {
		width: 100%;
		max-width: 420px;
		padding: 22px 22px 18px;
		background: var(--sheet);
		border: 1.5px solid var(--ink);
		border-radius: 18px 22px 18px 20px;
		box-shadow: 0 10px 30px rgb(58 50 38 / 0.25);
	}
	h2 {
		margin: 0 0 6px;
		font-family: var(--font-hand);
		font-weight: 700;
		font-size: 1.6rem;
		line-height: 1.2;
	}
	.lead {
		margin: 0 0 14px;
	}
	ul {
		list-style: none;
		margin: 0 0 18px;
		padding: 0;
	}
	li {
		display: flex;
		align-items: center;
		gap: 12px;
		line-height: 1.35;
	}
	li + li {
		margin-top: 10px;
	}
	.pic {
		flex: none;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2px;
		width: 46px;
		color: var(--ink);
	}
	/* The map's own marks, so the key matches what's on screen: out of season is faded, as on the map. */
	img {
		width: 22px;
		height: 22px;
	}
	.faded {
		opacity: 0.4;
	}
	.cluster {
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		border: 1.5px solid var(--ink);
		background: var(--sheet);
		font-family: var(--font-hand);
		font-style: normal;
		font-size: 0.85rem;
	}
	.start {
		display: block;
		width: 100%;
		min-height: 48px;
		border: 1.5px solid var(--ink);
		border-radius: 12px 14px 12px 13px;
		background: var(--wash);
		color: var(--ink);
		font-family: var(--font-hand);
		font-size: 1.25rem;
	}
</style>
