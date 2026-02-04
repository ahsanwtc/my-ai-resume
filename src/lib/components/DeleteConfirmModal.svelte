<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		show: boolean;
		title: string;
		message: string;
		onConfirm: () => void;
		onCancel: () => void;
		confirmText?: string;
		cancelText?: string;
	}

	let {
		show,
		title,
		message,
		onConfirm,
		onCancel,
		confirmText = 'Yes, Delete',
		cancelText = 'Cancel'
	}: Props = $props();
</script>

{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
		<div class="bg-bg-primary border border-white/10 rounded-2xl p-8 max-w-md">
			<h3 class="text-2xl font-bold text-white mb-4">{title}</h3>
			<p class="text-gray-400 mb-6">{message}</p>
			<div class="flex gap-4">
				<button
					type="button"
					onclick={onConfirm}
					class="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-all"
				>
					{confirmText}
				</button>
				<button
					type="button"
					onclick={onCancel}
					class="flex-1 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-all"
				>
					{cancelText}
				</button>
			</div>
		</div>
	</div>
{/if}
