<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import DeleteConfirmModal from '$lib/components/DeleteConfirmModal.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let deleteId = $state<string | null>(null);

	function formatDate(date?: string): string {
		if (!date) return '';
		return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
	}

	async function handleDelete() {
		if (!deleteId) return;

		const formData = new FormData();
		formData.append('id', deleteId.toString());

		const response = await fetch('?/delete', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			goto(resolve('/admin/experiences'), { invalidateAll: true });
		}
		deleteId = null;
	}
</script>

<svelte:head>
	<title>Manage Experiences - Admin</title>
</svelte:head>

<div class="max-w-6xl">
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-4xl font-serif font-bold text-white">Experiences</h1>
		<a
			href={resolve('/admin/experiences/new')}
			class="bg-accent-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-teal/90 transition-all"
		>
			+ Add Experience
		</a>
	</div>

	{#if data.experiences.length === 0}
		<div class="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
			<div class="text-4xl mb-4">💼</div>
			<p class="text-gray-400 mb-4">No experiences yet</p>
			<a
				href={resolve('/admin/experiences/new')}
				class="inline-block bg-accent-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-teal/90 transition-all"
			>
				Add Your First Experience
			</a>
		</div>
	{:else}
		<div class="space-y-4">
			{#each data.experiences as exp (exp.id)}
				<div class="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
					<!-- Drag Handle -->
					<div class="text-gray-500 cursor-move pt-2">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"/>
						</svg>
					</div>

					<!-- Content -->
					<div class="flex-1">
						<div class="flex justify-between items-start mb-2">
							<div>
								<h3 class="text-xl font-bold text-white">{exp.company_name}</h3>
								<p class="text-accent-teal">{exp.title}</p>
							</div>
							<span class="text-sm text-gray-400">
								{formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
							</span>
						</div>
						<p class="text-sm text-gray-500">Order: {exp.display_order}</p>
					</div>

					<!-- Actions -->
					<div class="flex gap-2">
						<a
							href={resolve(`/admin/experiences/${exp.id}`)}
							class="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
						>
							Edit
						</a>
						<button
							type="button"
							onclick={() => (deleteId = exp.id)}
							class="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
						>
							Delete
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<DeleteConfirmModal
	show={deleteId !== null}
	title="Delete Experience?"
	message="Are you sure you want to delete this experience? This action cannot be undone."
	onConfirm={handleDelete}
	onCancel={() => (deleteId = null)}
/>
