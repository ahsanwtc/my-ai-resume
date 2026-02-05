<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import DeleteConfirmModal from '$lib/components/DeleteConfirmModal.svelte';
	import type { PageData } from './$types';
	import type { ResumeSkill } from '$lib/types';

	let { data }: { data: PageData } = $props();

	let activeTab = $state<'strong' | 'moderate' | 'gap'>('strong');
	let deleteId = $state<string | null>(null);
	let draggedItem = $state<ResumeSkill | null>(null);
	let dragOverIndex = $state<number | null>(null);

	const tabs = [
		{ key: 'strong' as const, label: 'Strong', icon: '✓', color: 'accent-teal' },
		{ key: 'moderate' as const, label: 'Moderate', icon: '○', color: 'gray-400' },
		{ key: 'gap' as const, label: 'Gaps', icon: '✗', color: 'accent-amber' }
	];

	async function handleDelete() {
		if (!deleteId) return;

		const formData = new FormData();
		formData.append('id', deleteId.toString());

		await fetch('?/delete', {
			method: 'POST',
			body: formData
		});

		goto(resolve('/admin/skills'), { invalidateAll: true });
		deleteId = null;
	}

	function handleDragStart(e: DragEvent, skill: ResumeSkill): void {
		draggedItem = skill;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
		}
	}

	function handleDragOver(e: DragEvent, index: number): void {
		e.preventDefault();
		dragOverIndex = index;
	}

	function handleDragLeave(): void {
		dragOverIndex = null;
	}

	async function handleDrop(e: DragEvent, targetIndex: number): Promise<void> {
		e.preventDefault();
		if (!draggedItem) return;

		const skills = data.skills[activeTab];
		const draggedIndex = skills.findIndex(s => s.id === draggedItem?.id);

		if (draggedIndex === targetIndex) {
			draggedItem = null;
			dragOverIndex = null;
			return;
		}

		// Reorder array
		const newSkills = [...skills];
		newSkills.splice(draggedIndex, 1);
		newSkills.splice(targetIndex, 0, draggedItem);

		// Update display_order for all affected items
		const updates = newSkills.map((skill, index) => ({
			id: skill.id,
			order: index
		}));

		const formData = new FormData();
		formData.append('updates', JSON.stringify(updates));

		await fetch('?/reorder', {
			method: 'POST',
			body: formData
		});

		goto(resolve('/admin/skills'), { invalidateAll: true });
		draggedItem = null;
		dragOverIndex = null;
	}
</script>

<svelte:head>
	<title>Manage Skills - Admin</title>
</svelte:head>

<div class="max-w-6xl">
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-4xl font-serif font-bold text-white">Skills</h1>
		<a
			href={resolve('/admin/skills/new')}
			class="bg-accent-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-teal/90 transition-all"
		>
			+ Add Skill
		</a>
	</div>

	<!-- Tabs -->
	<div class="flex gap-2 mb-6 border-b border-white/10">
		{#each tabs as tab (tab.key)}
			<button
				onclick={() => (activeTab = tab.key)}
				class="px-6 py-3 font-medium transition-colors relative {activeTab === tab.key
					? `text-${tab.color} border-b-2 border-${tab.color}`
					: 'text-gray-400 hover:text-gray-300'}"
			>
				<span class="mr-2">{tab.icon}</span>
				{tab.label}
				<span class="ml-2 text-sm">({data.skills[tab.key].length})</span>
			</button>
		{/each}
	</div>

	<!-- Skills List -->
	{#if data.skills[activeTab].length === 0}
		<div class="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
			<div class="text-4xl mb-4">⚡</div>
			<p class="text-gray-400 mb-4">No {activeTab} skills yet</p>
			<a
				href={resolve('/admin/skills/new')}
				class="inline-block bg-accent-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-teal/90 transition-all"
			>
				Add Your First Skill
			</a>
		</div>
	{:else}
		<div class="space-y-3">
			{#each data.skills[activeTab] as skill, index (skill.id)}
				{#if dragOverIndex === index && draggedItem && draggedItem.id !== skill.id}
					<div class="h-1 bg-accent-teal rounded-full"></div>
				{/if}
				<div
					role="button"
					tabindex="0"
					draggable="true"
					ondragstart={(e) => handleDragStart(e, skill)}
					ondragover={(e) => handleDragOver(e, index)}
					ondragleave={handleDragLeave}
					ondrop={(e) => handleDrop(e, index)}
					class="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 cursor-move hover:bg-white/[0.07] transition-all {draggedItem?.id === skill.id ? 'opacity-50' : ''}"
				>
					<!-- Drag Handle -->
					<div class="text-gray-500">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"/>
						</svg>
					</div>

					<!-- Content -->
					<div class="flex-1">
						<h3 class="text-lg font-medium text-white">{skill.name}</h3>
						{#if skill.years_experience}
							<p class="text-sm text-gray-400">{skill.years_experience} years</p>
						{/if}
					</div>

					<!-- Rating -->
					{#if skill.self_rating}
						<div class="flex gap-1">
							{#each Array(5), i (i)}
								<span class="text-lg {i < skill.self_rating ? 'text-accent-teal' : 'text-gray-600'}">
									★
								</span>
							{/each}
						</div>
					{/if}

					<!-- Actions -->
					<div class="flex gap-2">
						<a
							href={resolve(`/admin/skills/${skill.id}`)}
							class="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
						>
							Edit
						</a>
						<button
							type="button"
							onclick={() => (deleteId = skill.id)}
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
	title="Delete Skill?"
	message="Are you sure you want to delete this skill? This action cannot be undone."
	onConfirm={handleDelete}
	onCancel={() => (deleteId = null)}
/>
