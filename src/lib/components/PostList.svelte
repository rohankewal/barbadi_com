<script>
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import {
		Heart,
		MessageCircle,
		Clock,
		TrendingUp,
		Filter,
		Sparkles,
		Users,
		Star
	} from 'lucide-svelte';
	import { postsStore } from '../stores/posts.js';

	let { onViewChange } = $props();
	let selectedCategory = $state('all');
	let sortBy = $state('recent');

	const categories = [
		{ id: 'all', label: 'All Posts', color: 'default', icon: Sparkles },
		{ id: 'communication', label: 'Communication', color: 'blue', icon: '💬' },
		{ id: 'intimacy', label: 'Intimacy', color: 'purple', icon: '💕' },
		{ id: 'trust', label: 'Trust Issues', color: 'red', icon: '🔒' },
		{ id: 'family', label: 'Family & In-laws', color: 'green', icon: '👨‍👩‍👧‍👦' },
		{ id: 'finances', label: 'Finances', color: 'yellow', icon: '💰' },
		{ id: 'parenting', label: 'Parenting', color: 'orange', icon: '👶' },
		{ id: 'support', label: 'Need Support', color: 'pink', icon: '🤗' }
	];

	function getTimeAgo(timestamp) {
		const now = new Date();
		const posted = new Date(timestamp);
		const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));

		if (diffInHours < 1) return 'Just now';
		if (diffInHours < 24) return `${diffInHours}h ago`;
		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 7) return `${diffInDays}d ago`;
		return `${Math.floor(diffInDays / 7)}w ago`;
	}

	function handlePostClick(post) {
		onViewChange('post', post);
	}

	const filteredPosts = $derived.by(() => {
		return $postsStore
			.filter((post) => selectedCategory === 'all' || post.category === selectedCategory)
			.sort((a, b) => {
				if (sortBy === 'popular') return b.hearts - a.hearts;
				if (sortBy === 'discussed') return b.replies.length - a.replies.length;
				return new Date(b.timestamp) - new Date(a.timestamp);
			});
	});
</script>

<div class="space-y-8">
	<!-- Hero Section -->
	<div
		class="modern-card border-primary/20 bg-gradient-to-br from-primary/10 via-purple-500/10 to-primary/10"
	>
		<CardContent class="p-8 text-center">
			<div class="mb-4 flex items-center justify-center gap-3">
				<div class="rounded-full bg-primary/20 p-3">
					<Users class="h-8 w-8 text-primary" />
				</div>
				<h2 class="gradient-text text-3xl font-bold">Community Discussions</h2>
			</div>
			<p class="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
				Share your story, find support, and connect with others who understand your journey. Every
				voice matters in our safe, anonymous community.
			</p>
		</CardContent>
	</div>

	<!-- Category Filter -->
	<div class="flex flex-wrap gap-3">
		{#each categories as category}
			<Button
				variant={selectedCategory === category.id ? 'default' : 'outline'}
				size="sm"
				onclick={() => (selectedCategory = category.id)}
				class="modern-button h-11 px-4 text-sm {selectedCategory === category.id
					? 'border-0 bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg'
					: 'border border-border/50 bg-card/80 backdrop-blur-sm'}"
			>
				{#if category.icon && typeof category.icon === 'string'}
					<span class="mr-2">{category.icon}</span>
				{/if}
				{category.label}
			</Button>
		{/each}
	</div>

	<!-- Sort Options -->
	<div class="flex items-center justify-between">
		<div>
			<h2 class="gradient-text mb-2 text-3xl font-bold">
				{selectedCategory === 'all'
					? 'All Discussions'
					: categories.find((c) => c.id === selectedCategory)?.label}
			</h2>
			<p class="text-lg text-muted-foreground">
				{filteredPosts.length}
				{filteredPosts.length === 1 ? 'discussion' : 'discussions'} • Find support and share experiences
			</p>
		</div>
		<div
			class="flex items-center gap-3 rounded-2xl border border-border/50 bg-card/80 px-4 py-3 shadow-md backdrop-blur-sm"
		>
			<Filter class="h-4 w-4 text-muted-foreground" />
			<select
				bind:value={sortBy}
				class="cursor-pointer border-0 bg-transparent text-sm font-medium focus:ring-0 focus:outline-none"
			>
				<option value="recent">Most Recent</option>
				<option value="popular">Most Hearts</option>
				<option value="discussed">Most Discussed</option>
			</select>
		</div>
	</div>

	<!-- Posts -->
	<div class="space-y-6">
		{#each filteredPosts as post (post.id)}
			<div class="modern-card group cursor-pointer overflow-hidden">
				<!-- Post Header -->
				<div
					class="border-b border-border/30 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 p-6"
				>
					<div class="flex items-start justify-between gap-4">
						<div class="flex-1">
							<div class="mb-3 flex flex-wrap items-center gap-3">
								<Badge
									variant="secondary"
									class="rounded-full border-primary/20 bg-gradient-to-r from-primary/10 to-purple-500/10 px-3 py-1 font-medium text-primary"
								>
									<span class="mr-1">{categories.find((c) => c.id === post.category)?.icon}</span>
									{categories.find((c) => c.id === post.category)?.label}
								</Badge>
								<div
									class="flex items-center gap-2 rounded-full border border-border/30 bg-card/60 px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm"
								>
									<Clock class="h-3 w-3" />
									<span>{getTimeAgo(post.timestamp)}</span>
								</div>
								{#if post.hearts > 10 || post.replies.length > 5}
									<Badge
										class="rounded-full border-yellow-200/30 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-2 py-1 text-xs text-yellow-700"
									>
										<Star class="mr-1 h-3 w-3" />
										Popular
									</Badge>
								{/if}
							</div>
							<button onclick={() => handlePostClick(post)} class="w-full text-left">
								<h3
									class="text-xl leading-tight font-semibold transition-colors duration-300 group-hover:text-primary"
								>
									{post.title}
								</h3>
							</button>
						</div>
					</div>
				</div>

				<!-- Post Content -->
				<CardContent class="p-6">
					<button onclick={() => handlePostClick(post)} class="mb-6 w-full text-left">
						<p class="line-clamp-3 text-base leading-relaxed text-muted-foreground">
							{post.content.substring(0, 200)}...
						</p>
					</button>

					<div class="modern-separator my-4"></div>

					<div class="flex items-center justify-between">
						<div class="flex items-center gap-6">
							<div
								class="flex items-center gap-2 rounded-full border border-red-200/30 bg-gradient-to-r from-red-500/10 to-pink-500/10 px-4 py-2 text-sm"
							>
								<Heart class="h-4 w-4 text-red-500" />
								<span class="font-medium">{post.hearts}</span>
							</div>
							<div
								class="flex items-center gap-2 rounded-full border border-blue-200/30 bg-gradient-to-r from-blue-500/10 to-blue-600/10 px-4 py-2 text-sm"
							>
								<MessageCircle class="h-4 w-4 text-blue-500" />
								<span class="font-medium">{post.replies.length}</span>
							</div>
						</div>

						<Button
							variant="ghost"
							size="sm"
							onclick={() => handlePostClick(post)}
							class="modern-button px-4 py-2 font-medium text-primary hover:bg-primary/10 hover:text-primary/80"
						>
							Read More
						</Button>
					</div>
				</CardContent>
			</div>
		{/each}
	</div>

	{#if filteredPosts.length === 0}
		<div class="modern-card py-16 text-center">
			<CardContent class="p-8">
				<div class="text-muted-foreground">
					<div
						class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20"
					>
						<MessageCircle class="h-12 w-12 text-primary" />
					</div>
					<h3 class="mb-3 text-2xl font-semibold">No posts yet</h3>
					<p class="mx-auto mb-6 max-w-md leading-relaxed text-muted-foreground">
						Be the first to share in this category and help others who might be facing similar
						challenges.
					</p>
					<Button
						onclick={() => onViewChange('create')}
						class="modern-button border-0 bg-gradient-to-r from-primary to-purple-500 px-8 py-3 text-base text-white shadow-lg hover:shadow-xl"
					>
						<Sparkles class="mr-2 h-4 w-4" />
						Share Your Story
					</Button>
				</div>
			</CardContent>
		</div>
	{/if}
</div>
