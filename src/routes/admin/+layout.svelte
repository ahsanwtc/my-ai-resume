<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	const NavItems = [
		{ href: resolve('/admin/dashboard'), label: 'Dashboard', icon: '📊' },
		{ href: resolve('/admin/profile'), label: 'Profile', icon: '👤' },
		{ href: '/admin/experiences', label: 'Experiences', icon: '💼' },
		{ href: '/admin/skills', label: 'Skills', icon: '⚡' },
		{ href: '/admin/faq', label: 'FAQ', icon: '❓' }
	];

</script>

{#if data.session}
	<div class="min-h-screen bg-bg-primary flex">
		<!-- Sidebar -->
		<aside class="w-64 bg-white/5 border-r border-white/10 p-6">
			<div class="mb-8">
				<h1 class="text-2xl font-serif font-bold text-white">Admin</h1>
				<p class="text-sm text-gray-400 mt-1">{data.session.user.email}</p>
			</div>

			<nav class="space-y-2">
				{#each NavItems as item, index (index)}
					<a
						href={item.href}
						class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 transition-colors {$page.url.pathname === item.href ? 'bg-white/10 text-accent-teal' : ''}"
					>
						<span class="text-xl">{item.icon}</span>
						<span>{item.label}</span>
					</a>
				{/each}
			</nav>

			<form method="POST" action="/admin/logout" class="mt-8">
				<button
					type="submit"
					class="w-full px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
				>
					Logout
				</button>
			</form>
		</aside>

		<!-- Main Content -->
		<main class="flex-1 p-8 overflow-y-auto">
			{@render children()}
		</main>
	</div>
{:else}
	{@render children()}
{/if}
