<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let email = $state('');
	let loading = $state(false);

	onMount(() => {
		// Check if there's a hash with auth tokens
		if (window.location.hash) {
			goto(resolve('/admin/dashboard'));
		}
	});
</script>

<svelte:head>
	<title>Admin Login</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center px-6 bg-bg-primary">
	<div class="w-full max-w-md">
		<div class="bg-white/5 border border-white/10 rounded-2xl p-8">
			<h1 class="text-3xl font-serif font-bold text-white mb-2">Admin Login</h1>
			<p class="text-gray-400 mb-8">Sign in with a magic link</p>

			{#if form?.success}
				<div class="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
					Check your email for the magic link!
				</div>
			{/if}

			{#if form?.message}
				<div class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
					{form.message}
				</div>
			{/if}

			<form method="POST" use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}>
				<div class="space-y-4">
					<div>
						<label for="email" class="block text-sm font-medium text-gray-300 mb-2">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							bind:value={email}
							class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-teal"
							placeholder="you@example.com"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						class="w-full bg-accent-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-teal/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? 'Sending...' : 'Send Magic Link'}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
