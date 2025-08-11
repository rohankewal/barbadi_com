<script>
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import {
		ArrowLeft,
		Heart,
		MessageCircle,
		Clock,
		FileText,
		Trash2,
		Eye,
		TrendingUp,
		BarChart3
	} from 'lucide-svelte';
	import { postsStore } from '../stores/posts.js';
	import { userPostsStore } from '../stores/userPosts.js';

	let { onViewChange } = $props();

	const categories = [
		{
			id: 'communication',
			label: 'Communication',
			color: 'bg-blue-500/10 text-blue-700 border-blue-200',
			icon: '💬'
		},
		{
			id: 'intimacy',
			label: 'Intimacy',
			color: 'bg-purple-500/10 text-purple-700 border-purple-200',
			icon: '💕'
		},
		{
			id: 'trust',
			label: 'Trust Issues',
			color: 'bg-red-500/10 text-red-700 border-red-200',
			icon: '🔒'
		},
		{
			id: 'family',
			label: 'Family & In-laws',
			color: 'bg-green-500/10 text-green-700 border-green-200',
			icon: '👨‍👩‍👧‍👦'
		},
		{
			id: 'finances',
			label: 'Finances',
			color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
			icon: '💰'
		},
		{
			id: 'parenting',
			label: 'Parenting',
			color: 'bg-orange-500/10 text-orange-700 border-orange-200',
			icon: '👶'
		},
		{
			id: 'support',
			label: 'Need Support',
			color: 'bg-pink-500/10 text-pink-700 border-pink-200',
			icon: '🤗'
		}
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

	function handleDeletePost(postId) {
		if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
			postsStore.update((posts) => posts.filter((p) => p.id !== postId));
			userPostsStore.update((userPosts) => userPosts.filter((id) => id !== postId));
		}
	}

	const myPosts = $derived.by(() => {
		return $postsStore
			.filter((post) => $userPostsStore.includes(post.id))
			.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
	});

	const totalHearts = $derived(myPosts.reduce((sum, post) => sum + post.hearts, 0));
	const totalReplies = $derived(myPosts.reduce((sum, post) => sum + post.replies.length, 0));
</script>

<div class="space-y-8">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<Button
			variant="ghost"
			size="sm"
			onclick={() => onViewChange('forum')}
			class="modern-button gap-2 border border-border/50 bg-card/80 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer"
		>
			<ArrowLeft class="h-4 w-4" />
			<span class="hidden sm:inline">Back to Forum</span>
		</Button>
	</div>

	<!-- Page Title & Stats -->
	<div class="modern-card">
		<CardContent class="p-8">
			<div class="flex items-start justify-between gap-6">
				<div class="flex items-center gap-4">
					<div class="rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 p-3">
						<FileText class="h-8 w-8 text-primary" />
					</div>
					<div>
						<h1 class="gradient-text mb-2 text-3xl font-bold">My Posts</h1>
						<p class="text-lg text-muted-foreground">Posts you've shared from this device</p>
					</div>
				</div>

				<!-- Stats -->
				<div class="flex gap-4">
					<div
						class="rounded-2xl border border-border/30 bg-gradient-to-br from-card/50 to-card/30 p-4 text-center"
					>
						<div class="text-2xl font-bold text-primary">{myPosts.length}</div>
						<div class="text-xs text-muted-foreground">Posts</div>
					</div>
					<div
						class="rounded-2xl border border-border/30 bg-gradient-to-br from-card/50 to-card/30 p-4 text-center"
					>
						<div class="text-2xl font-bold text-red-500">{totalHearts}</div>
						<div class="text-xs text-muted-foreground">Hearts</div>
					</div>
					<div
						class="rounded-2xl border border-border/30 bg-gradient-to-br from-card/50 to-card/30 p-4 text-center"
					>
						<div class="text-2xl font-bold text-blue-500">{totalReplies}</div>
						<div class="text-xs text-muted-foreground">Replies</div>
					</div>
				</div>
			</div>
		</CardContent>
	</div>

	<!-- Privacy Notice -->
	<div
		class="modern-card border-blue-200/30 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:border-blue-800/30 dark:from-blue-950/50 dark:to-blue-900/30"
	>
		<CardContent class="p-6">
			<div class="flex items-start gap-4">
				<div class="rounded-lg bg-blue-500/20 p-2">
					<Eye class="h-5 w-5 text-blue-600 dark:text-blue-400" />
				</div>
				<div class="flex-1">
					<h3 class="mb-2 font-semibold text-blue-800 dark:text-blue-200">Privacy Information</h3>
					<p class="text-sm leading-relaxed text-blue-700 dark:text-blue-300">
						These posts are tracked locally on your device only. No personal information is stored
						on our servers. Clearing your browser data will remove this list, but your posts will
						remain anonymous on the forum.
					</p>
				</div>
			</div>
		</CardContent>
	</div>

	<!-- Posts List -->
	{#if myPosts.length > 0}
		<div class="space-y-6">
			{#each myPosts as post (post.id)}
				<div class="modern-card group overflow-hidden transition-all duration-300 hover:shadow-xl">
					<div
						class="border-b border-border/30 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 p-6"
					>
						<div class="flex items-start justify-between gap-4">
							<div class="flex-1">
								<div class="mb-3 flex flex-wrap items-center gap-3">
									<Badge
										class="rounded-full border px-3 py-1 font-medium shadow-sm {categories.find(
											(c) => c.id === post.category
										)?.color}"
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
								</div>
								<button
									onclick={() => handlePostClick(post)}
									class="w-full text-left transition-colors duration-300 group-hover:text-primary"
								>
									<h3 class="mb-2 text-xl leading-tight font-semibold">
										{post.title}
									</h3>
								</button>
							</div>

							<!-- Delete Button -->
							<Button
								variant="ghost"
								size="sm"
								onclick={() => handleDeletePost(post.id)}
								class="modern-button p-2 text-destructive opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
								title="Delete post"
							>
								<Trash2 class="h-4 w-4" />
							</Button>
						</div>
					</div>

					<CardContent class="p-6">
						<button onclick={() => handlePostClick(post)} class="mb-6 w-full text-left">
							<p class="line-clamp-3 leading-relaxed text-muted-foreground">
								{post.content.substring(0, 200)}...
							</p>
						</button>

						<div class="modern-separator my-4"></div>

						<div class="flex items-center justify-between">
							<div class="flex items-center gap-6">
								<div
									class="flex items-center gap-2 rounded-full border border-red-200/30 bg-gradient-to-r from-red-500/10 to-pink-500/10 px-3 py-2 text-sm"
								>
									<Heart class="h-4 w-4 text-red-500" />
									<span class="font-medium">{post.hearts}</span>
								</div>
								<div
									class="flex items-center gap-2 rounded-full border border-blue-200/30 bg-gradient-to-r from-blue-500/10 to-blue-600/10 px-3 py-2 text-sm"
								>
									<MessageCircle class="h-4 w-4 text-blue-500" />
									<span class="font-medium">{post.replies.length}</span>
								</div>
								{#if post.hearts > 5 || post.replies.length > 3}
									<div
										class="flex items-center gap-1 rounded-full border border-green-200/30 bg-green-500/10 px-2 py-1 text-xs text-green-600"
									>
										<TrendingUp class="h-3 w-3" />
										<span>Popular</span>
									</div>
								{/if}
							</div>

							<Button
								variant="ghost"
								size="sm"
								onclick={() => handlePostClick(post)}
								class="modern-button px-4 py-2 text-primary hover:bg-primary/10 hover:text-primary/80"
							>
								View Post
							</Button>
						</div>
					</CardContent>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Empty State -->
		<div class="modern-card py-16 text-center">
			<CardContent class="p-8">
				<div class="text-muted-foreground">
					<div
						class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20"
					>
						<FileText class="h-12 w-12 text-primary" />
					</div>
					<h3 class="mb-3 text-2xl font-semibold">No posts yet</h3>
					<p class="mx-auto mb-6 max-w-md leading-relaxed text-muted-foreground">
						You haven't shared any posts from this device yet. Start by sharing your story to
						connect with others who understand.
					</p>
					<Button
						onclick={() => onViewChange('create')}
						class="modern-button border-0 bg-gradient-to-r from-primary to-purple-500 px-8 py-3 text-base text-white shadow-lg hover:shadow-xl"
					>
						<Heart class="mr-2 h-4 w-4" />
						Share Your First Story
					</Button>
				</div>
			</CardContent>
		</div>
	{/if}
</div>
