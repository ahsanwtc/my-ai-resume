<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Admin Dashboard</title>
</svelte:head>

<div class="max-w-6xl">
	<h1 class="text-4xl font-serif font-bold text-white mb-8">Dashboard</h1>

	<div class="grid md:grid-cols-3 gap-6 mb-8">
		<div class="bg-white/5 border border-white/10 rounded-2xl p-6">
			<div class="text-4xl mb-2">💼</div>
			<div class="text-3xl font-bold text-white mb-1">{data.stats.experiences}</div>
			<div class="text-gray-400">Experiences</div>
		</div>

		<div class="bg-white/5 border border-white/10 rounded-2xl p-6">
			<div class="text-4xl mb-2">⚡</div>
			<div class="text-3xl font-bold text-white mb-1">{data.stats.skills}</div>
			<div class="text-gray-400">Skills</div>
		</div>

		<div class="bg-white/5 border border-white/10 rounded-2xl p-6">
			<div class="text-4xl mb-2">❓</div>
			<div class="text-3xl font-bold text-white mb-1">{data.stats.faqs}</div>
			<div class="text-gray-400">FAQs</div>
		</div>
	</div>

	<div class="bg-white/5 border border-white/10 rounded-2xl p-6">
		<h2 class="text-2xl font-bold text-white mb-4">Quick Actions</h2>
		<div class="grid md:grid-cols-2 gap-4">
			<a
				href={resolve('/admin/profile')}
				class="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
			>
				<div class="text-xl mb-2">👤</div>
				<div class="font-medium text-white">Edit Profile</div>
				<div class="text-sm text-gray-400">Update your personal information</div>
			</a>

			<a
				href={resolve('/admin/experiences')}
				class="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
			>
				<div class="text-xl mb-2">💼</div>
				<div class="font-medium text-white">Manage Experiences</div>
				<div class="text-sm text-gray-400">Add or edit work experiences</div>
			</a>

			<a
				href={resolve('/admin/skills')}
				class="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
			>
				<div class="text-xl mb-2">⚡</div>
				<div class="font-medium text-white">Manage Skills</div>
				<div class="text-sm text-gray-400">Update your skills matrix</div>
			</a>

			<a
				href={resolve('/admin/faq')}
				class="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
			>
				<div class="text-xl mb-2">❓</div>
				<div class="font-medium text-white">Manage FAQs</div>
				<div class="text-sm text-gray-400">Edit FAQ responses</div>
			</a>
		</div>
	</div>
</div>
