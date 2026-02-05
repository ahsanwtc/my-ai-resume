<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { invalidateAll } from '$app/navigation';
	import DeleteConfirmModal from '$lib/components/DeleteConfirmModal.svelte';
	import DraggableList from '$lib/components/DraggableList.svelte';
	import type { PageData } from './$types';
	import type { ResumeFaqResponse } from '$lib/types';

	let { data }: { data: PageData } = $props();

	let showDeleteConfirm = $state(false);
	let deleteId = $state<string | null>(null);

	async function handleReorder(updates: { id: string; display_order: number }[]): Promise<void> {
		const formData = new FormData();
		formData.append('updates', JSON.stringify(updates));

		await fetch('?/reorder', {
			method: 'POST',
			body: formData
		});

		await invalidateAll();
	}

	function confirmDelete(id: string): void {
		deleteId = id;
		showDeleteConfirm = true;
	}

	async function handleDelete(): Promise<void> {
		if (!deleteId) return;

		const formData = new FormData();
		formData.append('id', deleteId);

		await fetch('?/delete', {
			method: 'POST',
			body: formData
		});

		await invalidateAll();
		showDeleteConfirm = false;
		deleteId = null;
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-white">FAQ Management</h1>
			<p class="text-gray-400 mt-1">Manage frequently asked questions</p>
		</div>
		<a
			href="/admin/faq/new"
			class="px-4 py-2 bg-accent-teal text-white rounded-lg hover:bg-accent-teal/90 transition-all"
		>
			Add FAQ
		</a>
	</div>

	{#if data.faqs.length === 0}
		<div class="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
			<p class="text-gray-400 mb-4">No FAQs yet</p>
			<a
				href="/admin/faq/new"
				class="inline-block px-6 py-3 bg-accent-teal text-white rounded-lg hover:bg-accent-teal/90 transition-all"
			>
				Add Your First FAQ
			</a>
		</div>
	{:else}
		<DraggableList items={data.faqs} onReorder={handleReorder}>
			{#snippet itemContent(faq: ResumeFaqResponse)}
				<div class="flex items-center gap-4">
					<!-- Drag Handle -->
					<div class="text-gray-500">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
							/>
						</svg>
					</div>

					<!-- Content -->
					<div class="flex-1">
						<div class="flex items-center gap-2 mb-1">
							<h3 class="text-lg font-medium text-white">{faq.question}</h3>
							{#if faq.is_common_question}
								<span class="px-2 py-0.5 bg-accent-amber/20 text-accent-amber text-xs rounded-full">
									Common
								</span>
							{/if}
						</div>
						<p class="text-sm text-gray-400 line-clamp-2">{faq.answer}</p>
					</div>

					<!-- Actions -->
					<div class="flex items-center gap-2">
						<a
							href={resolve(`/admin/faq/${faq.id}`)}
							class="px-3 py-1.5 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all text-sm"
						>
							Edit
						</a>
						<button
							type="button"
							onclick={() => confirmDelete(faq.id)}
							class="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm"
						>
							Delete
						</button>
					</div>
				</div>
			{/snippet}
		</DraggableList>
	{/if}
</div>

<DeleteConfirmModal
	show={showDeleteConfirm}
	title="Delete FAQ"
	message="Are you sure you want to delete this FAQ? This action cannot be undone."
	onConfirm={handleDelete}
	onCancel={() => {
		showDeleteConfirm = false;
		deleteId = null;
	}}
/>
