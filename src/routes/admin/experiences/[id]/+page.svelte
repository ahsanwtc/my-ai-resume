<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import DeleteConfirmModal from '$lib/components/DeleteConfirmModal.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let bulletPoints = $state<string[]>([]);
	let isCurrent = $state(false);
	let loading = $state(false);
	let showDeleteConfirm = $state(false);

	$effect(() => {
		bulletPoints = data.experience?.bullet_points || [''];
		isCurrent = data.experience?.is_current || false;
	});

	function addBullet() {
		bulletPoints = [...bulletPoints, ''];
	}

	function removeBullet(index: number) {
		if (bulletPoints.length > 1) {
			bulletPoints = bulletPoints.filter((_, i) => i !== index);
		}
	}

	const isNew = $derived(data.experience === null);
</script>

<svelte:head>
	<title>{isNew ? 'Add' : 'Edit'} Experience - Admin</title>
</svelte:head>

<div class="max-w-4xl">
	<h1 class="text-4xl font-serif font-bold text-white mb-8">
		{isNew ? 'Add' : 'Edit'} Experience
	</h1>

	{#if form?.message}
		<div class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
			{form.message}
		</div>
	{/if}

	<form
		method="POST"
		action="?/save"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				await update({ reset: false });
			};
		}}
		class="space-y-6"
	>
		<div class="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
			<h2 class="text-xl font-bold text-white mb-4">Basic Information</h2>

			<div>
				<label for="company_name" class="block text-sm font-medium text-gray-300 mb-2">
					Company Name <span class="text-red-400">*</span>
				</label>
				<input
					id="company_name"
					name="company_name"
					type="text"
					required
					value={data.experience?.company_name || ''}
					class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
				/>
			</div>

			<div>
				<label for="title" class="block text-sm font-medium text-gray-300 mb-2">
					Title <span class="text-red-400">*</span>
				</label>
				<input
					id="title"
					name="title"
					type="text"
					required
					value={data.experience?.title || ''}
					class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
				/>
			</div>

			<div>
				<label for="title_progression" class="block text-sm font-medium text-gray-300 mb-2">
					Title Progression (optional)
				</label>
				<input
					id="title_progression"
					name="title_progression"
					type="text"
					value={data.experience?.title_progression || ''}
					placeholder="e.g., Senior → Staff Engineer"
					class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
				/>
			</div>

			<div class="grid md:grid-cols-2 gap-4">
				<div>
					<label for="start_date" class="block text-sm font-medium text-gray-300 mb-2">
						Start Date <span class="text-red-400">*</span>
					</label>
					<input
						id="start_date"
						name="start_date"
						type="date"
						required
						value={data.experience?.start_date || ''}
						class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
					/>
				</div>

				<div>
					<label for="end_date" class="block text-sm font-medium text-gray-300 mb-2">
						End Date
					</label>
					<input
						id="end_date"
						name="end_date"
						type="date"
						disabled={isCurrent}
						value={data.experience?.end_date || ''}
						class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal disabled:opacity-50"
					/>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<input
					id="is_current"
					name="is_current"
					type="checkbox"
					bind:checked={isCurrent}
					class="w-4 h-4 bg-white/5 border border-white/10 rounded"
				/>
				<label for="is_current" class="text-sm text-gray-300">
					I currently work here
				</label>
			</div>

			<div>
				<label for="display_order" class="block text-sm font-medium text-gray-300 mb-2">
					Display Order
				</label>
				<input
					id="display_order"
					name="display_order"
					type="number"
					value={data.experience?.display_order || 0}
					class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
				/>
			</div>
		</div>

		<div class="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
			<h2 class="text-xl font-bold text-white mb-4">Achievements</h2>

			<div>
				<label class="block text-sm font-medium text-gray-300 mb-2">Bullet Points</label>
				{#each bulletPoints, index (index)}
					<div class="flex gap-2 mb-2">
						<textarea
							name="bullet_points"
							bind:value={bulletPoints[index]}
							rows="2"
							class="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
						></textarea>
						<button
							type="button"
							onclick={() => removeBullet(index)}
							class="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20"
						>
							✕
						</button>
					</div>
				{/each}
				<button
					type="button"
					onclick={addBullet}
					class="text-accent-teal hover:text-accent-teal/80 text-sm"
				>
					+ Add Bullet Point
				</button>
			</div>
		</div>

		<div class="flex gap-4">
			<button
				type="submit"
				disabled={loading}
				class="bg-accent-teal text-white px-8 py-3 rounded-lg font-medium hover:bg-accent-teal/90 transition-all disabled:opacity-50"
			>
				{loading ? 'Saving...' : 'Save Experience'}
			</button>
			<a
				href={resolve('/admin/experiences')}
				class="bg-white/5 border border-white/10 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-all"
			>
				Cancel
			</a>
			{#if !isNew}
				<button
					type="button"
					onclick={() => (showDeleteConfirm = true)}
					class="ml-auto bg-red-500/10 border border-red-500/20 text-red-400 px-8 py-3 rounded-lg font-medium hover:bg-red-500/20 transition-all"
				>
					Delete
				</button>
			{/if}
		</div>
	</form>
</div>

<!-- Delete Confirmation Modal -->
<DeleteConfirmModal
	show={showDeleteConfirm}
	title="Delete Experience?"
	message="Are you sure you want to delete this experience? This action cannot be undone."
	onConfirm={() => {
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '?/delete';
		document.body.appendChild(form);
		form.submit();
	}}
	onCancel={() => (showDeleteConfirm = false)}
/>
