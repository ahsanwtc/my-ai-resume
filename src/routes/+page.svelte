<script lang="ts">
	import type { PageData } from './$types';

	interface ChatMessage {
		role: 'user' | 'ai';
		content: string;
	}

	const companies: string[] = ["Dyn Media", "Mailcom GmbH"];

	const suggestedQuestions: string[] = [
		"What's your biggest weakness?",
		'Tell me about a time you failed',
		'Why did you leave Airbnb?',
		'What would your manager say about you?',
		'How do you handle conflict?',
		'What are you looking for in your next role?'
	];

	const { data }: { data: PageData } = $props();

	let chatOpen = $state<boolean>(false);
	let chatMessages = $state<ChatMessage[]>([]);
	let chatInput = $state<string>('');

	function sendMessage(): void {
		if (!chatInput.trim()) return;
		chatMessages.push({ role: 'user', content: chatInput });
		const userMessage: string = chatInput;
		chatInput = '';

		setTimeout(() => {
			chatMessages.push({
				role: 'ai',
				content: `This is a demo response to: "${userMessage}"\n\nIn production, I'd pull from my full context (experiences, values, honest reflections) to give you a real answer. Try asking about specific projects, decisions, or what I learned from failures.`
			});
		}, 800);
	}

	function askQuestion(question: string): void {
		chatInput = question;
		sendMessage();
	}

	function scrollToSection(id: string): void {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>{data.profile?.name} — {data.profile?.title} | {data.profile?.subtitle}</title>
</svelte:head>

<!-- Navigation -->
<nav class="fixed top-0 left-0 right-0 z-40 bg-bg-primary/95 backdrop-blur-lg border-b border-white/5">
	<div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
		<button onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} class="text-xl font-bold text-white hover:text-accent-teal transition-colors">
			{data.profile?.name.split(' ').map(n => n[0]).join('')}
		</button>
		<div class="flex items-center gap-6">
			<button
				onclick={() => scrollToSection('experience')}
				class="hidden md:block text-sm text-gray-400 hover:text-white transition-colors"
			>
				Experience
			</button>
			<button
				onclick={() => scrollToSection('skills')}
				class="hidden md:block text-sm text-gray-400 hover:text-white transition-colors"
			>
				Skills
			</button>
			<button
				onclick={() => (chatOpen = true)}
				class="bg-accent-teal text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-accent-teal/90 transition-all hover:scale-105"
			>
				💬 Ask AI
			</button>
		</div>
	</div>
</nav>

<!-- Hero Section -->
<section class="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
	<div class="max-w-4xl w-full">
		<!-- Status Badge -->
		<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8">
			<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
			<span class="text-sm text-green-400">Open to {data.profile?.targetTitles.join("/")} roles</span>
		</div>

		<!-- Name & Title -->
		<h1 class="text-6xl md:text-7xl font-serif font-bold text-white mb-3 leading-tight">
			{data.profile?.name}
		</h1>
		<div class="flex items-baseline gap-3 mb-6">
			<p class="text-3xl md:text-4xl text-accent-teal font-medium">{data.profile?.title}</p>
			<span class="text-2xl text-gray-500">·</span>
			<p class="text-2xl text-gray-400">{data.profile?.subtitle}</p>
		</div>

		<!-- Pitch -->
		<p class="text-xl text-gray-300 mb-8 max-w-3xl leading-relaxed">
			{data.profile?.tagline}
		</p>

		<!-- Meta Info -->
		<div class="flex flex-wrap gap-4 mb-10 text-sm text-gray-400">
			<span class="flex items-center gap-2">
				<span>📍</span>
				{data.profile?.location}
			</span>
			<span class="flex items-center gap-2">
				<span>🌐</span>
				{data.profile?.remotePreference}
			</span>
		</div>

		<!-- Company Badges -->
		<div class="flex flex-wrap gap-3 mb-10">
			{#each companies as company, index (index)}
				<span class="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
					{company}
				</span>
			{/each}
		</div>

		<!-- CTA -->
		<div class="flex flex-wrap gap-4">
			<button
				onclick={() => (chatOpen = true)}
				class="bg-accent-teal text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-accent-teal/90 transition-all hover:scale-105 flex items-center gap-3"
			>
				<span class="text-2xl">💬</span>
				Ask AI About Me
			</button>
			<button
				onclick={() => scrollToSection('experience')}
				class="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-white/10 transition-all"
			>
				View Experience
			</button>
		</div>

		<!-- Scroll Indicator -->
		<div class="mt-20 text-center">
			<div class="inline-flex flex-col items-center gap-2 text-gray-500 animate-bounce-slow">
				<span class="text-sm">Scroll to explore</span>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</div>
	</div>
</section>

<!-- Experience Section -->
<section id="experience" class="py-20 px-6 bg-white/[0.02]">
	<div class="max-w-5xl mx-auto">
		<div class="mb-12">
			<h2 class="text-5xl font-serif font-bold text-white mb-4">Experience</h2>
			<p class="text-lg text-gray-400 max-w-2xl">
				Each role includes queryable AI context—the real story behind the bullet points. Ask about decisions, failures, and what I'd do differently.
			</p>
		</div>

		<div class="space-y-8">
			{#each data.experiences as exp (`exp-${exp.id}`)}
				<article class="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/[0.07] hover:border-white/20 transition-all">
					<!-- Header -->
					<div class="flex items-start justify-between mb-6">
						<div>
							<h3 class="text-2xl font-bold text-white mb-1">{exp.name}</h3>
							<p class="text-accent-teal font-medium mb-1">{exp.title}</p>
							<!-- <p class="text-sm text-gray-500">{exp.team}</p> -->
						</div>
						<span class="text-sm text-gray-400 whitespace-nowrap">
						 {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
						</span>
					</div>

					<!-- Achievements -->
					<ul class="space-y-3 mb-6">
						{#each exp.bullets as bullet, index (index)}
							<li class="text-gray-300 flex items-start gap-3 leading-relaxed">
								<span class="text-accent-teal mt-1.5 text-lg">•</span>
								<span>{bullet}</span>
							</li>
						{/each}
					</ul>

					<!-- AI Context CTA -->
					<button
						onclick={() => (chatOpen = true)}
						class="text-accent-teal hover:text-accent-teal/80 transition-colors text-sm font-medium flex items-center gap-2 group-hover:gap-3"
					>
						<span>✨</span>
						Ask AI about this role
						<svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- Skills Matrix -->
<section id="skills" class="py-20 px-6">
	<div class="max-w-5xl mx-auto">
		<div class="mb-12">
			<h2 class="text-5xl font-serif font-bold text-white mb-4">Skills Matrix</h2>
			<p class="text-lg text-gray-400">
				Honest assessment of what I'm strong at, learning, and where I have gaps.
			</p>
		</div>

		<div class="grid md:grid-cols-3 gap-6">
			<!-- Strong -->
			<div class="bg-white/5 border border-accent-teal/30 rounded-2xl p-6">
				<div class="flex items-center gap-3 mb-6">
					<div class="w-10 h-10 rounded-full bg-accent-teal/20 flex items-center justify-center">
						<span class="text-2xl">✓</span>
					</div>
					<h3 class="text-xl font-bold text-accent-teal">STRONG</h3>
				</div>
				<ul class="space-y-2.5">
					{#each data.skills.strong as skill, index (index)}
						<li class="text-gray-300 text-sm leading-relaxed">{skill}</li>
					{/each}
				</ul>
			</div>

			<!-- Moderate -->
			<div class="bg-white/5 border border-gray-500/30 rounded-2xl p-6">
				<div class="flex items-center gap-3 mb-6">
					<div class="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center">
						<span class="text-2xl text-gray-400">○</span>
					</div>
					<h3 class="text-xl font-bold text-gray-400">MODERATE</h3>
				</div>
				<ul class="space-y-2.5">
					{#each data.skills.moderate as skill, index (index)}
						<li class="text-gray-300 text-sm leading-relaxed">{skill}</li>
					{/each}
				</ul>
			</div>

			<!-- Gaps -->
			<div class="bg-white/5 border border-accent-amber/30 rounded-2xl p-6">
				<div class="flex items-center gap-3 mb-6">
					<div class="w-10 h-10 rounded-full bg-accent-amber/20 flex items-center justify-center">
						<span class="text-2xl text-accent-amber">✗</span>
					</div>
					<h3 class="text-xl font-bold text-accent-amber">GAPS</h3>
				</div>
				<ul class="space-y-2.5">
					{#each data.skills.gaps as skill, index (index)}
						<li class="text-gray-300 text-sm leading-relaxed">{skill}</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Philosophy Callout -->
		<div class="mt-12 bg-accent-teal/10 border border-accent-teal/20 rounded-2xl p-8">
			<p class="text-gray-300 leading-relaxed">
				<span class="text-accent-teal font-semibold">Why show gaps?</span> Because honesty signals confidence.
				I'm not trying to be everything—I'm trying to be the right fit. Ask my AI about roles where I'm
				<em>not</em> the right person.
			</p>
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="py-16 px-6 border-t border-white/10">
	<div class="max-w-5xl mx-auto">
		<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
			<div>
				<h3 class="text-2xl font-serif font-bold text-white mb-2">{data.profile?.name}</h3>
				<p class="text-gray-400 mb-4">{data.profile?.title} · {data.profile?.subtitle}</p>
				<div class="flex gap-6">
					<a href="#" class="text-gray-400 hover:text-accent-teal transition-colors text-sm">GitHub</a>
					<a href="#" class="text-gray-400 hover:text-accent-teal transition-colors text-sm">LinkedIn</a>
					<a href="#" class="text-gray-400 hover:text-accent-teal transition-colors text-sm">Twitter</a>
					<a href="mailto:marcus@example.com" class="text-gray-400 hover:text-accent-teal transition-colors text-sm">Email</a>
				</div>
			</div>
			<button
				onclick={() => (chatOpen = true)}
				class="bg-accent-teal text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-teal/90 transition-all"
			>
				💬 Ask AI Anything
			</button>
		</div>
		<div class="mt-12 pt-8 border-t border-white/5">
			<p class="text-sm text-gray-500 text-center">
				An AI-queryable portfolio. Because resumes don't tell the whole story.
			</p>
		</div>
	</div>
</footer>

<!-- Chat Drawer -->
{#if chatOpen}
	<div class="fixed inset-0 z-50 flex justify-end">
		<!-- Backdrop -->
		<button
			onclick={() => (chatOpen = false)}
			class="absolute inset-0 bg-black/70 backdrop-blur-sm"
			aria-label="Close chat"
		></button>

		<!-- Drawer -->
		<div class="relative w-full max-w-lg bg-bg-primary border-l border-white/10 flex flex-col shadow-2xl animate-slide-in">
			<!-- Header -->
			<div class="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
				<div>
					<h3 class="text-2xl font-bold text-white">Ask AI</h3>
					<p class="text-sm text-gray-400 mt-1">Get honest answers about my experience</p>
				</div>
				<button
					onclick={() => (chatOpen = false)}
					class="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
					aria-label="Close"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Messages -->
			<div class="flex-1 overflow-y-auto p-6 space-y-4">
				{#if chatMessages.length === 0}
					<div class="space-y-4">
						<p class="text-gray-400 text-sm">Try asking:</p>
						{#each suggestedQuestions as question, index (index)}
							<button
								onclick={() => askQuestion(question)}
								class="w-full text-left px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all text-sm"
							>
								{question}
							</button>
						{/each}
					</div>
				{:else}
					{#each chatMessages as message, index (index)}
						<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
							<div
								class="max-w-[85%] px-4 py-3 rounded-2xl {message.role === 'user'
									? 'bg-accent-teal text-white'
									: 'bg-white/10 text-gray-200 border border-white/10'}"
							>
								<p class="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
							</div>
						</div>
					{/each}
				{/if}
			</div>

			<!-- Input -->
			<div class="p-6 border-t border-white/10 bg-white/5">
				<form
					onsubmit={(e) => {
						e.preventDefault();
						sendMessage();
					}}
					class="flex gap-3"
				>
					<input
						bind:value={chatInput}
						type="text"
						placeholder="Ask me anything..."
						class="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all"
					/>
					<button
						type="submit"
						disabled={!chatInput.trim()}
						class="px-6 py-3 bg-accent-teal text-white rounded-xl font-medium hover:bg-accent-teal/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Send
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes slide-in {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}

	.animate-slide-in {
		animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
</style>
