<script lang="ts" generics="T extends { id: string }">
	import type { Snippet } from 'svelte';

	interface Props {
		items: T[];
		onReorder: (updates: { id: string; display_order: number }[]) => Promise<void>;
		itemContent: Snippet<[T, number]>;
	}

	let { items, onReorder, itemContent }: Props = $props();

	let draggedItem = $state<T | null>(null);
	let dragOverIndex = $state<number | null>(null);

	function handleDragStart(e: DragEvent, item: T): void {
		draggedItem = item;
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
		dragOverIndex = null;

		if (!draggedItem) return;

		const currentIndex = items.findIndex((item) => item.id === draggedItem!.id);
		if (currentIndex === targetIndex) return;

		const reordered = [...items];
		const [removed] = reordered.splice(currentIndex, 1);
		reordered.splice(targetIndex, 0, removed);

		const updates = reordered.map((item, idx) => ({
			id: item.id,
			display_order: idx
		}));

		await onReorder(updates);
		draggedItem = null;
	}
</script>

<div class="space-y-3">
	{#each items as item, index (item.id)}
		{#if dragOverIndex === index && draggedItem && draggedItem.id !== item.id}
			<div class="h-1 bg-accent-teal rounded-full"></div>
		{/if}
		<div
			role="button"
			tabindex="0"
			draggable="true"
			ondragstart={(e) => handleDragStart(e, item)}
			ondragover={(e) => handleDragOver(e, index)}
			ondragleave={handleDragLeave}
			ondrop={(e) => handleDrop(e, index)}
			class="bg-white/5 border border-white/10 rounded-xl p-4 cursor-move hover:bg-white/[0.07] transition-all {draggedItem?.id === item.id ? 'opacity-50' : ''}"
		>
			{@render itemContent(item, index)}
		</div>
	{/each}
</div>
