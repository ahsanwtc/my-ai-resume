<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import DeleteConfirmModal from '$lib/components/DeleteConfirmModal.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let loading = $state(false);
	let showDeleteConfirm = $state(false);

	const isNew = $derived(data.faq === null);
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-white">{isNew ? 'Add FAQ' : 'Edit FAQ'}</h1>
			<p class="text-gray-400 mt-1">
				{isNew ? 'Create a new frequently asked question' : 'Update FAQ details'}
			</p>
		</div>
		<a
			href={resolve('/admin/faq')}
			class="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all"
		>
			Back to FAQs
		</a>
	</div>

	{#if form?.message}
		<div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
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
		class="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6"
	>
		<div>
			<label for="question" class="block text-sm font-medium text-gray-300 mb-2">
				Question <span class="text-red-400">*</span>
			</label>
			<textarea
				id="question"
				name="question"
				required
				rows="2"
				value={data.faq?.question || ''}
				class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal resize-none"
			></textarea>
		</div>

		<div>
			<label for="answer" class="block text-sm font-medium text-gray-300 mb-2">
				Answer <span class="text-red-400">*</span>
			</label>
			<textarea
				id="answer"
				name="answer"
				required
				rows="6"
				value={data.faq?.answer || ''}
				class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal resize-none"
			></textarea>
		</div>

		<div class="flex items-center gap-2">
			<input
				id="is_common_question"
				name="is_common_question"
				type="checkbox"
				checked={data.faq?.is_common_question || false}
				class="w-4 h-4 bg-white/5 border border-white/10 rounded"
			/>
			<label for="is_common_question" class="text-sm text-gray-300">
				Mark as common question (shown on public portfolio)
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
				value={data.faq?.display_order || 0}
				class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
			/>
		</div>

		<div class="flex items-center gap-3 pt-4">
			<button
				type="submit"
				disabled={loading}
				class="px-6 py-3 bg-accent-teal text-white rounded-lg hover:bg-accent-teal/90 transition-all disabled:opacity-50"
			>
				{loading ? 'Saving...' : 'Save FAQ'}
			</button>

			{#if !isNew}
				<button
					type="button"
					onclick={() => (showDeleteConfirm = true)}
					class="px-6 py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
				>
					Delete
				</button>
			{/if}
		</div>
	</form>
</div>

<DeleteConfirmModal
	show={showDeleteConfirm}
	title="Delete FAQ"
	message="Are you sure you want to delete this FAQ? This action cannot be undone."
	confirmText="Delete"
	onConfirm={async () => {
		const formData = new FormData();
		await fetch('?/delete', {
			method: 'POST',
			body: formData
		});
	}}
	onCancel={() => (showDeleteConfirm = false)}
/>
