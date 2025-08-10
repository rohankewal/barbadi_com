<script>
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';
	import { ArrowLeft, Shield, Eye, Heart, CheckCircle, Sparkles, Lock, Users } from 'lucide-svelte';
	import { postsStore } from '../stores/posts.js';
	import { userPostsStore } from '../stores/userPosts.js';

	let { onViewChange } = $props();

	let title = $state('');
	let content = $state('');
	let category = $state('communication');
	let isSubmitting = $state(false);
	let showSuccess = $state(false);

	const categories = [
		{
			id: 'communication',
			label: 'Communication',
			description: 'Talking, listening, understanding each other',
			icon: '💬',
			color: 'from-blue-500/20 to-blue-600/20 border-blue-200'
		},
		{
			id: 'intimacy',
			label: 'Intimacy',
			description: 'Physical and emotional closeness',
			icon: '💕',
			color: 'from-purple-500/20 to-purple-600/20 border-purple-200'
		},
		{
			id: 'trust',
			label: 'Trust Issues',
			description: 'Betrayal, honesty, rebuilding trust',
			icon: '🔒',
			color: 'from-red-500/20 to-red-600/20 border-red-200'
		},
		{
			id: 'family',
			label: 'Family & In-laws',
			description: 'Extended family relationships',
			icon: '👨‍👩‍👧‍👦',
			color: 'from-green-500/20 to-green-600/20 border-green-200'
		},
		{
			id: 'finances',
			label: 'Finances',
			description: 'Money management and financial stress',
			icon: '💰',
			color: 'from-yellow-500/20 to-yellow-600/20 border-yellow-200'
		},
		{
			id: 'parenting',
			label: 'Parenting',
			description: 'Raising children together',
			icon: '👶',
			color: 'from-orange-500/20 to-orange-600/20 border-orange-200'
		},
		{
			id: 'support',
			label: 'Need Support',
			description: 'Looking for encouragement and advice',
			icon: '🤗',
			color: 'from-pink-500/20 to-pink-600/20 border-pink-200'
		}
	];

	async function handleSubmit() {
		if (!title.trim() || !content.trim()) return;

		isSubmitting = true;

		await new Promise((resolve) => setTimeout(resolve, 1500));

		const newPost = {
			id: Date.now().toString(),
			title: title.trim(),
			content: content.trim(),
			category,
			timestamp: new Date().toISOString(),
			hearts: 0,
			replies: [],
			anonymous: true
		};

		postsStore.update((posts) => [newPost, ...posts]);
		userPostsStore.update((userPosts) => [...userPosts, newPost.id]);

		showSuccess = true;
		isSubmitting = false;

		setTimeout(() => {
			title = '';
			content = '';
			category = 'communication';
			showSuccess = false;
			onViewChange('forum');
		}, 2000);
	}

	function handleCancel() {
		if (title.trim() || content.trim()) {
			if (confirm('Are you sure you want to discard your post?')) {
				onViewChange('forum');
			}
		} else {
			onViewChange('forum');
		}
	}
</script>

<div class="mx-auto max-w-3xl space-y-8">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<Button
			variant="ghost"
			size="sm"
			onclick={handleCancel}
			class="modern-button gap-2 border border-border/50 bg-card/80 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
			disabled={isSubmitting}
		>
			<ArrowLeft class="h-4 w-4" />
			<span class="hidden sm:inline">Back to Forum</span>
		</Button>
	</div>

	{#if showSuccess}
		<!-- Success Message -->
		<div
			class="modern-card border-green-200/50 bg-gradient-to-br from-green-50/80 to-green-100/50 dark:border-green-800/50 dark:from-green-950/80 dark:to-green-900/50"
		>
			<CardContent class="p-8">
				<div class="flex items-center gap-4 text-green-800 dark:text-green-200">
					<div class="rounded-full bg-green-500/20 p-3">
						<CheckCircle class="h-8 w-8 text-green-600" />
					</div>
					<div>
						<h3 class="mb-1 text-xl font-semibold">Post shared successfully!</h3>
						<p class="text-sm text-green-700 dark:text-green-300">
							Your story has been posted anonymously and added to "My Posts". Redirecting to
							forum...
						</p>
					</div>
				</div>
			</CardContent>
		</div>
	{:else}
		<!-- Privacy Notice -->
		<div
			class="modern-card border-primary/20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-primary/5"
		>
			<CardContent class="p-6">
				<div class="flex items-start gap-4">
					<div class="rounded-full bg-primary/20 p-3">
						<Shield class="h-6 w-6 text-primary" />
					</div>
					<div class="flex-1">
						<h3 class="mb-2 text-lg font-semibold text-primary">Your Privacy is Protected</h3>
						<p class="text-sm leading-relaxed text-muted-foreground">
							Your post will be completely anonymous. We'll track it locally on your device so you
							can find it in "My Posts", but no personal information is stored on our servers. Share
							openly and safely.
						</p>
						<div class="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
							<div class="flex items-center gap-1">
								<Lock class="h-3 w-3 text-green-500" />
								<span>End-to-end privacy</span>
							</div>
							<div class="flex items-center gap-1">
								<Users class="h-3 w-3 text-blue-500" />
								<span>Supportive community</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</div>

		<!-- Create Post Form -->
		<div class="modern-card overflow-hidden">
			<CardHeader class="bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 p-6">
				<CardTitle class="flex items-center gap-3 text-2xl">
					<div class="rounded-lg bg-primary/20 p-2">
						<Heart class="h-6 w-6 text-primary" />
					</div>
					Share Your Story
				</CardTitle>
				<p class="mt-2 text-muted-foreground">
					Your experience can help others facing similar challenges
				</p>
			</CardHeader>
			<CardContent class="space-y-8 p-8">
				<!-- Category Selection -->
				<div class="space-y-4">
					<Label class="flex items-center gap-2 text-base font-semibold">
						<Sparkles class="h-4 w-4 text-primary" />
						What's this about?
					</Label>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						{#each categories as cat}
							<button
								type="button"
								onclick={() => (category = cat.id)}
								disabled={isSubmitting}
								class="group rounded-2xl border-2 p-4 text-left transition-all duration-300 hover:shadow-lg disabled:opacity-50 {category ===
								cat.id
									? 'border-primary bg-gradient-to-br ' + cat.color + ' shadow-md'
									: 'border-border/30 bg-card/50 hover:border-primary/30'}"
							>
								<div class="mb-2 flex items-center gap-3">
									<span class="text-2xl">{cat.icon}</span>
									<div class="text-base font-semibold transition-colors group-hover:text-primary">
										{cat.label}
									</div>
								</div>
								<div class="text-sm leading-relaxed text-muted-foreground">{cat.description}</div>
							</button>
						{/each}
					</div>
				</div>

				<!-- Title -->
				<div class="space-y-3">
					<Label for="title" class="text-base font-semibold">Title</Label>
					<Input
						id="title"
						bind:value={title}
						placeholder="Give your post a clear, helpful title that others can relate to..."
						maxlength="100"
						disabled={isSubmitting}
						class="modern-input h-12 border border-border/50 bg-card/50 text-base backdrop-blur-sm"
					/>
					<div class="flex items-center justify-between text-xs text-muted-foreground">
						<span>Make it descriptive but not too personal</span>
						<span class="font-mono">{title.length}/100</span>
					</div>
				</div>

				<!-- Content -->
				<div class="space-y-3">
					<Label for="content" class="text-base font-semibold">Your Story</Label>
					<Textarea
						id="content"
						bind:value={content}
						placeholder="Share what's on your mind. The more details you provide, the better the community can support you. Remember, this is a safe space where you can be vulnerable and honest about your experiences..."
						rows="10"
						maxlength="2000"
						disabled={isSubmitting}
						class="modern-input resize-none border border-border/50 bg-card/50 text-base leading-relaxed backdrop-blur-sm"
					/>
					<div class="flex items-center justify-between text-xs text-muted-foreground">
						<span>Be honest and specific - your story matters</span>
						<span class="font-mono">{content.length}/2000</span>
					</div>
				</div>

				<!-- Guidelines -->
				<div
					class="modern-card border border-border/30 bg-gradient-to-br from-muted/30 to-muted/10"
				>
					<CardContent class="p-6">
						<h4 class="mb-4 flex items-center gap-2 text-base font-semibold">
							<Eye class="h-5 w-5 text-primary" />
							Community Guidelines
						</h4>
						<div class="grid grid-cols-1 gap-4 text-sm text-muted-foreground md:grid-cols-2">
							<div class="space-y-2">
								<div class="flex items-center gap-2">
									<div class="h-2 w-2 rounded-full bg-green-500"></div>
									<span>Be respectful and supportive</span>
								</div>
								<div class="flex items-center gap-2">
									<div class="h-2 w-2 rounded-full bg-blue-500"></div>
									<span>Keep discussions constructive</span>
								</div>
							</div>
							<div class="space-y-2">
								<div class="flex items-center gap-2">
									<div class="h-2 w-2 rounded-full bg-purple-500"></div>
									<span>No personal attacks or judgment</span>
								</div>
								<div class="flex items-center gap-2">
									<div class="h-2 w-2 rounded-full bg-orange-500"></div>
									<span>Respect others' privacy and experiences</span>
								</div>
							</div>
						</div>
					</CardContent>
				</div>

				<!-- Submit Button -->
				<div class="flex gap-4 pt-4">
					<Button
						onclick={handleSubmit}
						disabled={!title.trim() || !content.trim() || isSubmitting}
						class="modern-button h-12 flex-1 border-0 bg-gradient-to-r from-primary to-purple-500 text-base font-semibold text-white shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isSubmitting}
							<div class="flex items-center gap-2">
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
								></div>
								Sharing...
							</div>
						{:else}
							<div class="flex items-center gap-2">
								<Heart class="h-4 w-4" />
								Share Anonymously
							</div>
						{/if}
					</Button>
					<Button
						variant="outline"
						onclick={handleCancel}
						disabled={isSubmitting}
						class="modern-button h-12 border border-border/50 bg-card/80 px-8 backdrop-blur-sm"
					>
						Cancel
					</Button>
				</div>
			</CardContent>
		</div>
	{/if}
</div>
