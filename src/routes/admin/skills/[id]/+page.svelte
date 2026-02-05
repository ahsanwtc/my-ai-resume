<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import DeleteConfirmModal from '$lib/components/DeleteConfirmModal.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let loading = $state(false);
	let showDeleteConfirm = $state(false);
	let inUse = $state(true);

	$effect(() => {
		inUse = data.skill?.in_use ?? true;
	});

	const isNew = $derived(data.skill === null);
</script>

<svelte:head>
	<title>{isNew ? 'Add' : 'Edit'} Skill - Admin</title>
</svelte:head>

<div class="max-w-4xl">
	<h1 class="text-4xl font-serif font-bold text-white mb-8">
		{isNew ? 'Add' : 'Edit'} Skill
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
				<label for="name" class="block text-sm font-medium text-gray-300 mb-2">
					Skill Name <span class="text-red-400">*</span>
				</label>
				<input
					id="name"
					name="name"
					type="text"
					required
					value={data.skill?.name || ''}
					class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
				/>
			</div>

			<div>
				<label for="category" class="block text-sm font-medium text-gray-300 mb-2">
					Category <span class="text-red-400">*</span>
				</label>
				<select
					id="category"
					name="category"
					required
					value={data.skill?.category || 'strong'}
					class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
				>
					<option value="strong">Strong</option>
					<option value="moderate">Moderate</option>
					<option value="gap">Gap</option>
				</select>
			</div>

			<div class="grid md:grid-cols-2 gap-4">
				<div>
					<label for="self_rating" class="block text-sm font-medium text-gray-300 mb-2">
						Self Rating (1-5)
					</label>
					<input
						id="self_rating"
						name="self_rating"
						type="number"
						min="1"
						max="5"
						value={data.skill?.self_rating || ''}
						class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
					/>
				</div>

				<div>
					<label for="years_experience" class="block text-sm font-medium text-gray-300 mb-2">
						Years of Experience
					</label>
					<input
						id="years_experience"
						name="years_experience"
						type="number"
						step="0.5"
						value={data.skill?.years_experience || ''}
						class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
					/>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<input
					id="in_use"
					name="in_use"
					type="checkbox"
					bind:checked={inUse}
					class="w-4 h-4 bg-white/5 border border-white/10 rounded"
				/>
				<label for="in_use" class="text-sm text-gray-300">
					Currently using this skill
				</label>
			</div>

			<div>
				<label for="last_used" class="block text-sm font-medium text-gray-300 mb-2">
					Last Used {#if inUse}<span class="text-gray-500">(disabled when in use)</span>{/if}
				</label>
				<input
					id="last_used"
					name="last_used"
					type="date"
					disabled={inUse}
					value={data.skill?.last_used || ''}
					class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal disabled:opacity-50 disabled:cursor-not-allowed"
				/>
				/>
			</div>

			<div>
				<label for="display_order" class="block text-sm font-medium text-gray-300 mb-2">
					Display Order
				</label>
				<input
					id="display_order"
					name="display_order"
					type="number"
					value={data.skill?.display_order || 0}
					class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
				/>
			</div>
		</div>

		<div class="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
			<h2 class="text-xl font-bold text-white mb-4">Additional Details</h2>

			<div>
				<label for="evidence" class="block text-sm font-medium text-gray-300 mb-2">
					Evidence
				</label>
				<textarea
					id="evidence"
					name="evidence"
					rows="3"
					value={data.skill?.evidence || ''}
					placeholder="Projects, achievements, or proof of this skill..."
					class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
				></textarea>
			</div>

			<div>
				<label for="honest_notes" class="block text-sm font-medium text-gray-300 mb-2">
					Honest Notes (Private)
				</label>
				<textarea
					id="honest_notes"
					name="honest_notes"
					rows="3"
					value={data.skill?.honest_notes || ''}
					placeholder="Your honest assessment, areas to improve, etc..."
					class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
				></textarea>
			</div>
		</div>

		<div class="flex gap-4">
			<button
				type="submit"
				disabled={loading}
				class="bg-accent-teal text-white px-8 py-3 rounded-lg font-medium hover:bg-accent-teal/90 transition-all disabled:opacity-50"
			>
				{loading ? 'Saving...' : 'Save Skill'}
			</button>
			<a
				href={resolve('/admin/skills')}
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

<DeleteConfirmModal
	show={showDeleteConfirm}
	title="Delete Skill?"
	message="Are you sure you want to delete this skill? This action cannot be undone."
	onConfirm={() => {
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '?/delete';
		document.body.appendChild(form);
		form.submit();
	}}
	onCancel={() => (showDeleteConfirm = false)}
/>
