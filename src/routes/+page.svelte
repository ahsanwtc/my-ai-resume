<script lang="ts">
	interface Experience {
		id: string;
		company: string;
		dateRange: string;
		titleProgression: string;
		achievements: string[];
		aiContext: {
			situation: string;
			approach: string;
			technicalWork: string;
			lessonsLearned: string;
		};
	}

	interface ChatMessage {
		role: 'user' | 'ai';
		content: string;
	}

	let chatOpen = $state(false);
	let expandedCards = $state<Record<string, boolean>>({});
	let chatMessages = $state<ChatMessage[]>([]);
	let chatInput = $state('');

	const experiences: Experience[] = [
		{
			id: '1',
			company: 'TechCorp',
			dateRange: '2022 - Present',
			titleProgression: 'Senior → Staff Engineer',
			achievements: [
				'Led migration to microservices architecture, reducing deployment time by 60%',
				'Built real-time analytics pipeline processing 10M+ events/day',
				'Mentored 5 engineers, 3 promoted to senior roles'
			],
			aiContext: {
				situation:
					'The monolithic application was becoming unmaintainable with 200+ developers committing daily.',
				approach:
					'Started with strangler fig pattern, identifying bounded contexts and extracting services incrementally.',
				technicalWork:
					'Built service mesh with Istio, implemented event sourcing with Kafka, created shared libraries for observability.',
				lessonsLearned:
					'Conway\'s law is real. Organizational structure needed to change before architecture could.'
			}
		},
		{
			id: '2',
			company: 'StartupXYZ',
			dateRange: '2019 - 2022',
			titleProgression: 'Engineer → Senior Engineer',
			achievements: [
				'First engineering hire, built MVP that secured $5M Series A',
				'Scaled platform from 0 to 100K users in 18 months',
				'Established engineering practices and hired team of 12'
			],
			aiContext: {
				situation: 'Joined as solo engineer with a Figma prototype and ambitious timeline.',
				approach:
					'Chose boring technology (Rails + React), focused on shipping fast and learning from users.',
				technicalWork:
					'Built full-stack application, integrated Stripe, implemented background jobs, set up CI/CD.',
				lessonsLearned:
					'Perfect is the enemy of shipped. Early technical debt is fine if you\'re learning what to build.'
			}
		}
	];

	const skills = {
		strong: [
			'TypeScript/JavaScript',
			'React/Svelte',
			'Node.js',
			'PostgreSQL',
			'AWS',
			'System Design'
		],
		moderate: ['Python', 'Go', 'Kubernetes', 'Machine Learning', 'GraphQL'],
		gaps: ['Rust', 'Mobile Development', 'Game Development', 'Embedded Systems']
	};

	const suggestedQuestions = [
		"What's your biggest weakness?",
		'Tell me about a project that failed',
		'Why did you leave TechCorp?',
		'What would your last manager say about you?'
	];

	function toggleCard(id: string) {
		expandedCards[id] = !expandedCards[id];
	}

	function sendMessage() {
		if (!chatInput.trim()) return;

		chatMessages.push({ role: 'user', content: chatInput });
		const userMessage = chatInput;
		chatInput = '';

		setTimeout(() => {
			chatMessages.push({
				role: 'ai',
				content: `This is a placeholder response to: "${userMessage}". Real AI integration coming soon!`
			});
		}, 500);
	}

	function askQuestion(question: string) {
		chatInput = question;
		sendMessage();
	}

	function scrollToSection(id: string) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<!-- Navigation -->
<nav
	class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-bg-primary/80 border-b border-white/10"
>
	<div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
		<div class="text-2xl font-serif font-bold text-accent-teal">JD</div>
		<div class="flex items-center gap-8">
			<button
				onclick={() => scrollToSection('experience')}
				class="text-gray-300 hover:text-accent-teal transition-colors">Experience</button
			>
			<button
				onclick={() => (chatOpen = true)}
				class="bg-accent-teal text-black px-6 py-2 rounded-lg font-medium hover:bg-accent-teal/90 transition-all hover:scale-105"
			>
				Ask AI
			</button>
		</div>
	</div>
</nav>

<!-- Hero Section -->
<section class="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
	<div class="max-w-4xl w-full text-center space-y-6">
		<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
			<span class="text-green-500">🟢</span>
			<span class="text-sm text-gray-300">Open to Senior/Staff roles at Series A-C startups</span>
		</div>

		<h1 class="text-7xl font-serif font-bold text-white">John Doe</h1>
		<p class="text-3xl text-accent-teal font-medium">Full-Stack Engineer</p>
		<p class="text-xl text-gray-400 max-w-2xl mx-auto">
			I build products that scale. Ask my AI anything about my experience, decisions, and what I've
			learned.
		</p>

		<div class="flex flex-wrap justify-center gap-3 pt-4">
			{#each ['Google', 'Meta', 'Stripe', 'Airbnb'] as company}
				<span class="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
					{company}
				</span>
			{/each}
		</div>

		<button
			onclick={() => (chatOpen = true)}
			class="mt-8 bg-accent-teal text-black px-8 py-4 rounded-lg font-medium text-lg hover:bg-accent-teal/90 transition-all hover:scale-105 inline-flex items-center gap-2"
		>
			<span>💬</span>
			Ask AI About Me
		</button>

		<div class="pt-16 animate-bounce-slow">
			<div class="text-gray-500 text-sm">↓ Scroll to explore</div>
		</div>
	</div>
</section>

<!-- Experience Section -->
<section id="experience" class="py-20 px-6">
	<div class="max-w-5xl mx-auto">
		<h2 class="text-5xl font-serif font-bold text-white mb-4">Experience</h2>
		<p class="text-gray-400 text-lg mb-12">
			Each role includes queryable AI context—the real story behind the bullet points.
		</p>

		<div class="space-y-6">
			{#each experiences as exp}
				<div class="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
					<div class="flex justify-between items-start mb-4">
						<div>
							<h3 class="text-2xl font-bold text-white">{exp.company}</h3>
							<p class="text-accent-teal font-medium">{exp.titleProgression}</p>
						</div>
						<span class="text-gray-400">{exp.dateRange}</span>
					</div>

					<ul class="space-y-2 mb-4">
						{#each exp.achievements as achievement}
							<li class="text-gray-300 flex items-start gap-2">
								<span class="text-accent-teal mt-1">•</span>
								<span>{achievement}</span>
							</li>
						{/each}
					</ul>

					<button
						onclick={() => toggleCard(exp.id)}
						class="text-accent-teal hover:text-accent-teal/80 transition-colors text-sm font-medium flex items-center gap-2"
					>
						<span>✨</span>
						{expandedCards[exp.id] ? 'Hide' : 'Show'} AI Context
					</button>

					{#if expandedCards[exp.id]}
						<div class="mt-4 bg-black/40 rounded-lg p-6 space-y-4 border border-white/5">
							<div>
								<h4 class="text-accent-teal font-semibold mb-2">SITUATION</h4>
								<p class="text-gray-300">{exp.aiContext.situation}</p>
							</div>
							<div>
								<h4 class="text-accent-teal font-semibold mb-2">APPROACH</h4>
								<p class="text-gray-300">{exp.aiContext.approach}</p>
							</div>
							<div>
								<h4 class="text-accent-teal font-semibold mb-2">TECHNICAL WORK</h4>
								<p class="text-gray-300">{exp.aiContext.technicalWork}</p>
							</div>
							<div>
								<h4 class="text-accent-teal font-semibold mb-2">LESSONS LEARNED</h4>
								<p class="text-gray-300 italic">{exp.aiContext.lessonsLearned}</p>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Skills Matrix -->
<section class="py-20 px-6 bg-black/20">
	<div class="max-w-5xl mx-auto">
		<h2 class="text-5xl font-serif font-bold text-white mb-12">Skills Matrix</h2>

		<div class="grid md:grid-cols-3 gap-6">
			<!-- Strong -->
			<div class="bg-white/5 border border-accent-teal/30 rounded-xl p-6">
				<div class="flex items-center gap-2 mb-4">
					<span class="text-2xl">✓</span>
					<h3 class="text-xl font-bold text-accent-teal">STRONG</h3>
				</div>
				<ul class="space-y-2">
					{#each skills.strong as skill}
						<li class="text-gray-300">{skill}</li>
					{/each}
				</ul>
			</div>

			<!-- Moderate -->
			<div class="bg-white/5 border border-gray-500/30 rounded-xl p-6">
				<div class="flex items-center gap-2 mb-4">
					<span class="text-2xl text-gray-400">○</span>
					<h3 class="text-xl font-bold text-gray-400">MODERATE</h3>
				</div>
				<ul class="space-y-2">
					{#each skills.moderate as skill}
						<li class="text-gray-300">{skill}</li>
					{/each}
				</ul>
			</div>

			<!-- Gaps -->
			<div class="bg-white/5 border border-accent-amber/30 rounded-xl p-6">
				<div class="flex items-center gap-2 mb-4">
					<span class="text-2xl text-accent-amber">✗</span>
					<h3 class="text-xl font-bold text-accent-amber">GAPS</h3>
				</div>
				<ul class="space-y-2">
					{#each skills.gaps as skill}
						<li class="text-gray-300">{skill}</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="py-12 px-6 border-t border-white/10">
	<div class="max-w-5xl mx-auto text-center space-y-4">
		<h3 class="text-2xl font-serif font-bold text-white">John Doe</h3>
		<p class="text-gray-400">Full-Stack Engineer</p>
		<div class="flex justify-center gap-6">
			<a href="#" class="text-gray-400 hover:text-accent-teal transition-colors">GitHub</a>
			<a href="#" class="text-gray-400 hover:text-accent-teal transition-colors">LinkedIn</a>
			<a href="#" class="text-gray-400 hover:text-accent-teal transition-colors">Email</a>
		</div>
		<p class="text-sm text-gray-500 pt-4">
			An AI-queryable portfolio. Because resumes don't tell the whole story.
		</p>
	</div>
</footer>

<!-- Chat Drawer -->
{#if chatOpen}
	<div class="fixed inset-0 z-50 flex justify-end">
		<!-- Backdrop -->
		<button
			onclick={() => (chatOpen = false)}
			class="absolute inset-0 bg-black/60 backdrop-blur-sm"
		></button>

		<!-- Drawer -->
		<div
			class="relative w-full max-w-md bg-bg-primary border-l border-white/10 flex flex-col animate-slide-in"
		>
			<!-- Header -->
			<div class="p-6 border-b border-white/10 flex justify-between items-center">
				<h3 class="text-2xl font-bold text-white">Ask AI</h3>
				<button
					onclick={() => (chatOpen = false)}
					class="text-gray-400 hover:text-white transition-colors text-2xl"
				>
					×
				</button>
			</div>

			<!-- Messages -->
			<div class="flex-1 overflow-y-auto p-6 space-y-4">
				{#if chatMessages.length === 0}
					<div class="space-y-3">
						<p class="text-gray-400 mb-4">Try asking:</p>
						{#each suggestedQuestions as question}
							<button
								onclick={() => askQuestion(question)}
								class="w-full text-left px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors"
							>
								{question}
							</button>
						{/each}
					</div>
				{:else}
					{#each chatMessages as message}
						<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
							<div
								class="max-w-[80%] px-4 py-3 rounded-lg {message.role === 'user'
									? 'bg-accent-teal text-black'
									: 'bg-white/5 text-gray-300'}"
							>
								{message.content}
							</div>
						</div>
					{/each}
				{/if}
			</div>

			<!-- Input -->
			<div class="p-6 border-t border-white/10">
				<form
					onsubmit={(e) => {
						e.preventDefault();
						sendMessage();
					}}
					class="flex gap-2"
				>
					<input
						bind:value={chatInput}
						type="text"
						placeholder="Ask me anything..."
						class="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-teal"
					/>
					<button
						type="submit"
						class="px-6 py-3 bg-accent-teal text-black rounded-lg font-medium hover:bg-accent-teal/90 transition-colors"
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
		animation: slide-in 0.3s ease-out;
	}
</style>
