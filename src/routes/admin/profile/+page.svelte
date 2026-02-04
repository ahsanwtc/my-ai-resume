<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let targetTitles = $state<string[]>([]);
	let targetCompanyStages = $state<string[]>([]);
	let loading = $state(false);

	$effect(() => {
		targetTitles = data.profile?.target_titles || [''];
		targetCompanyStages = data.profile?.target_company_stages || [''];
	});

	function addTargetTitle() {
		targetTitles = [...targetTitles, ''];
	}

	function removeTargetTitle(index: number) {
		if (targetTitles.length > 1) {
			targetTitles = targetTitles.filter((_, i) => i !== index);
		}
	}

	function addCompanyStage() {
		targetCompanyStages = [...targetCompanyStages, ''];
	}

	function removeCompanyStage(index: number) {
		if (targetCompanyStages.length > 1) {
			targetCompanyStages = targetCompanyStages.filter((_, i) => i !== index);
		}
	}
</script>

<svelte:head>
	<title>Edit Profile - Admin</title>
</svelte:head>

<div class="max-w-4xl">
	<h1 class="text-4xl font-serif font-bold text-white mb-8">Edit Profile</h1>

	{#if form?.success}
		<div class="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
			Profile updated successfully!
		</div>
	{/if}

	{#if form?.message}
		<div class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
			{form.message}
		</div>
	{/if}

	<form
		method="POST"
		use:enhance={() => {
			console.log('Form submitting...');
			loading = true;
			return async ({ update, result }) => {
				console.log('Form result:', result);
				loading = false;
				await update({ reset: false });
			};
		}}
		class="space-y-6"
	>
		<input type="hidden" name="id" value={data.profile?.id} />

		<div class="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
			<h2 class="text-xl font-bold text-white mb-4">Basic Information</h2>

			<div>
				<label for="name" class="block text-sm font-medium text-gray-300 mb-2">
					Full Name <span class="text-red-400">*</span>
				</label>
				<input
					id="name"
					name="name"
					type="text"
					required
					value={data.profile?.name}
					class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
				/>
			</div>

			<div>
				<label for="short_name" class="block text-sm font-medium text-gray-300 mb-2">
					Short Name <span class="text-red-400">*</span>
				</label>
				<input
					id="short_name"
					name="short_name"
					type="text"
					required
					value={data.profile?.short_name}
					class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
				/>
			</div>

			<div>
				<label for="tagline" class="block text-sm font-medium text-gray-300 mb-2">
					Tagline <span class="text-red-400">*</span>
				</label>
				<textarea
					id="tagline"
					name="tagline"
					required
					rows="3"
					value={data.profile?.tagline}
					class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
				></textarea>
			</div>

			<div class="grid md:grid-cols-2 gap-4">
				<div>
					<label for="title" class="block text-sm font-medium text-gray-300 mb-2">
						Title <span class="text-red-400">*</span>
					</label>
					<input
						id="title"
						name="title"
						type="text"
						required
						value={data.profile?.title}
						class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
					/>
				</div>

				<div>
					<label for="subtitle" class="block text-sm font-medium text-gray-300 mb-2">
						Subtitle
					</label>
					<input
						id="subtitle"
						name="subtitle"
						type="text"
						value={data.profile?.subtitle || ''}
						class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
					/>
				</div>
			</div>
		</div>

		<div class="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
			<h2 class="text-xl font-bold text-white mb-4">Target Roles</h2>

			<div>
				<label class="block text-sm font-medium text-gray-300 mb-2">Target Titles</label>
				{#each targetTitles, index (index)}
					<div class="flex gap-2 mb-2">
						<input
							name="target_titles"
							type="text"
							bind:value={targetTitles[index]}
							class="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
						/>
						<button
							type="button"
							onclick={() => removeTargetTitle(index)}
							class="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20"
						>
							✕
						</button>
					</div>
				{/each}
				<button
					type="button"
					onclick={addTargetTitle}
					class="text-accent-teal hover:text-accent-teal/80 text-sm"
				>
					+ Add Title
				</button>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-300 mb-2">Target Company Stages</label>
				{#each targetCompanyStages, index (index)}
					<div class="flex gap-2 mb-2">
						<input
							name="target_company_stages"
							type="text"
							bind:value={targetCompanyStages[index]}
							class="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
						/>
						<button
							type="button"
							onclick={() => removeCompanyStage(index)}
							class="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20"
						>
							✕
						</button>
					</div>
				{/each}
				<button
					type="button"
					onclick={addCompanyStage}
					class="text-accent-teal hover:text-accent-teal/80 text-sm"
				>
					+ Add Stage
				</button>
			</div>
		</div>

		<div class="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
			<h2 class="text-xl font-bold text-white mb-4">Location & Links</h2>

			<div class="grid md:grid-cols-2 gap-4">
				<div>
					<label for="location" class="block text-sm font-medium text-gray-300 mb-2">
						Location
					</label>
					<input
						id="location"
						name="location"
						type="text"
						value={data.profile?.location || ''}
						class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
					/>
				</div>

				<div>
					<label for="remote_preference" class="block text-sm font-medium text-gray-300 mb-2">
						Remote Preference
					</label>
					<input
						id="remote_preference"
						name="remote_preference"
						type="text"
						value={data.profile?.remote_preference || ''}
						class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
					/>
				</div>
			</div>

			<div>
				<label for="github_url" class="block text-sm font-medium text-gray-300 mb-2">
					GitHub URL
				</label>
				<input
					id="github_url"
					name="github_url"
					type="url"
					value={data.profile?.github_url || ''}
					class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
				/>
			</div>

			<div>
				<label for="linkedin_url" class="block text-sm font-medium text-gray-300 mb-2">
					LinkedIn URL
				</label>
				<input
					id="linkedin_url"
					name="linkedin_url"
					type="url"
					value={data.profile?.linkedin_url || ''}
					class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
				/>
			</div>

			<div>
				<label for="twitter_url" class="block text-sm font-medium text-gray-300 mb-2">
					Twitter URL
				</label>
				<input
					id="twitter_url"
					name="twitter_url"
					type="url"
					value={data.profile?.twitter_url || ''}
					class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-teal"
				/>
			</div>
		</div>

		<div class="flex gap-4">
			<button
				type="submit"
				disabled={loading}
				class="bg-accent-teal text-white px-8 py-3 rounded-lg font-medium hover:bg-accent-teal/90 transition-all disabled:opacity-50"
			>
				{loading ? 'Saving...' : 'Save Changes'}
			</button>
			<a
				href={resolve('/admin/dashboard')}
				class="bg-white/5 border border-white/10 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-all"
			>
				Cancel
			</a>
		</div>
	</form>
</div>
