<script>
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import {
		ArrowLeft,
		Heart,
		MessageCircle,
		Clock,
		Send,
		Shield,
		Sparkles,
		ThumbsUp
	} from 'lucide-svelte';
	import { postsStore } from '../stores/posts.js';

	let { post, onViewChange } = $props();
	let replyContent = $state('');
	let isSubmitting = $state(false);
	let hasLiked = $state(false);
	let likedReplies = $state(new Set());

	const categories = [
		{
			id: 'communication',
			label: 'Communication',
			color: 'bg-blue-500/10 text-blue-700 border-blue-200'
		},
		{
			id: 'intimacy',
			label: 'Intimacy',
			color: 'bg-purple-500/10 text-purple-700 border-purple-200'
		},
		{ id: 'trust', label: 'Trust Issues', color: 'bg-red-500/10 text-red-700 border-red-200' },
		{
			id: 'family',
			label: 'Family & In-laws',
			color: 'bg-green-500/10 text-green-700 border-green-200'
		},
		{
			id: 'finances',
			label: 'Finances',
			color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
		},
		{
			id: 'parenting',
			label: 'Parenting',
			color: 'bg-orange-500/10 text-orange-700 border-orange-200'
		},
		{ id: 'support', label: 'Need Support', color: 'bg-pink-500/10 text-pink-700 border-pink-200' }
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

	function handleLike() {
		if (hasLiked) return;

		hasLiked = true;
		postsStore.update((posts) =>
			posts.map((p) => (p.id === post.id ? { ...p, hearts: p.hearts + 1 } : p))
		);
		post.hearts += 1;
	}

	function handleReplyLike(replyId) {
		if (likedReplies.has(replyId)) return;

		likedReplies.add(replyId);
		likedReplies = new Set(likedReplies);

		postsStore.update((posts) =>
			posts.map((p) =>
				p.id === post.id
					? {
							...p,
							replies: p.replies.map((r) => (r.id === replyId ? { ...r, hearts: r.hearts + 1 } : r))
						}
					: p
			)
		);

		post.replies = post.replies.map((r) => (r.id === replyId ? { ...r, hearts: r.hearts + 1 } : r));
	}

	async function handleReply() {
		if (!replyContent.trim()) return;

		isSubmitting = true;

		await new Promise((resolve) => setTimeout(resolve, 1000));

		const newReply = {
			id: Date.now().toString(),
			content: replyContent.trim(),
			timestamp: new Date().toISOString(),
			hearts: 0,
			anonymous: true
		};

		postsStore.update((posts) =>
			posts.map((p) => (p.id === post.id ? { ...p, replies: [...p.replies, newReply] } : p))
		);

		post.replies = [...post.replies, newReply];
		replyContent = '';
		isSubmitting = false;
	}

	const categoryStyle = $derived(
		categories.find((c) => c.id === post.category)?.color ||
			'bg-gray-500/10 text-gray-700 border-gray-200'
	);
</script>

<div class="mx-auto max-w-4xl space-y-8">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<Button
			variant="ghost"
			size="sm"
			onclick={() => onViewChange('forum')}
			class="modern-button gap-2 border border-border/50 bg-card/80 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
		>
			<ArrowLeft class="h-4 w-4" />
			<span class="hidden sm:inline">Back to Forum</span>
		</Button>
	</div>

	<!-- Main Post -->
	<div class="modern-card overflow-hidden">
		<!-- Post Header -->
		<div
			class="border-b border-border/30 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 p-6"
		>
			<div class="mb-4 flex items-start justify-between gap-4">
				<div class="flex flex-wrap items-center gap-3">
					<Badge class="rounded-full px-4 py-2 font-medium {categoryStyle} border shadow-sm">
						{categories.find((c) => c.id === post.category)?.label}
					</Badge>
					<div
						class="flex items-center gap-2 rounded-full border border-border/30 bg-card/60 px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm"
					>
						<Clock class="h-3 w-3" />
						<span>{getTimeAgo(post.timestamp)}</span>
					</div>
					<Badge
						variant="outline"
						class="gap-2 rounded-full border-border/30 bg-card/60 px-3 py-1 backdrop-blur-sm"
					>
						<Shield class="h-3 w-3 text-green-500" />
						<span>Anonymous</span>
					</Badge>
				</div>
			</div>
			<h1 class="gradient-text mb-2 text-3xl leading-tight font-bold">{post.title}</h1>
			<div class="flex items-center gap-4 text-sm text-muted-foreground">
				<div class="flex items-center gap-1">
					<Sparkles class="h-4 w-4 text-primary" />
					<span>Safe Space Discussion</span>
				</div>
			</div>
		</div>

		<!-- Post Content -->
		<CardContent class="p-8">
			<div class="prose prose-lg mb-8 max-w-none">
				<p class="text-lg leading-relaxed whitespace-pre-wrap text-foreground">
					{post.content}
				</p>
			</div>

			<div class="modern-separator my-6"></div>

			<!-- Engagement Section -->
			<div
				class="flex items-center justify-between rounded-2xl border border-border/30 bg-gradient-to-r from-card/50 to-card/30 p-4"
			>
				<div class="flex items-center gap-6">
					<Button
						variant={hasLiked ? 'default' : 'ghost'}
						size="sm"
						onclick={handleLike}
						disabled={hasLiked}
						class="modern-button gap-2 px-4 py-2 {hasLiked
							? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
							: 'border border-border/50 bg-card/80 backdrop-blur-sm'}"
					>
						<Heart class="h-4 w-4 {hasLiked ? 'fill-current' : ''}" />
						<span class="font-medium">{post.hearts}</span>
						<span class="hidden text-sm sm:inline">{post.hearts === 1 ? 'Heart' : 'Hearts'}</span>
					</Button>
					<div
						class="flex items-center gap-2 rounded-full border border-border/30 bg-card/60 px-4 py-2 text-muted-foreground backdrop-blur-sm"
					>
						<MessageCircle class="h-4 w-4 text-blue-500" />
						<span class="font-medium">{post.replies.length}</span>
						<span class="text-sm">{post.replies.length === 1 ? 'reply' : 'replies'}</span>
					</div>
				</div>
				<div
					class="flex items-center gap-2 rounded-full border border-border/30 bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm"
				>
					<ThumbsUp class="h-3 w-3 text-green-500" />
					<span>Supportive Community</span>
				</div>
			</div>
		</CardContent>
	</div>

	<!-- Reply Form -->
	<div class="modern-card">
		<CardHeader class="rounded-t-2xl bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5">
			<h3 class="flex items-center gap-3 text-xl font-semibold">
				<div class="rounded-lg bg-primary/20 p-2">
					<MessageCircle class="h-5 w-5 text-primary" />
				</div>
				Share Your Support
			</h3>
			<p class="mt-2 text-sm text-muted-foreground">
				Your response will help and encourage others in similar situations
			</p>
		</CardHeader>
		<CardContent class="space-y-6 p-6">
			<Textarea
				bind:value={replyContent}
				placeholder="Offer support, share your experience, or ask a thoughtful question. Remember, your words can make a real difference in someone's life..."
				rows="5"
				maxlength="1000"
				disabled={isSubmitting}
				class="modern-input resize-none border border-border/50 bg-card/50 text-base leading-relaxed backdrop-blur-sm"
			/>
			<div
				class="flex items-center justify-between rounded-xl border border-border/30 bg-gradient-to-r from-card/50 to-card/30 p-4"
			>
				<div class="flex items-center gap-4 text-sm text-muted-foreground">
					<div class="flex items-center gap-1">
						<Shield class="h-4 w-4 text-green-500" />
						<span>Anonymous reply</span>
					</div>
					<div class="text-xs">
						{replyContent.length}/1000 characters
					</div>
				</div>
				<Button
					onclick={handleReply}
					disabled={!replyContent.trim() || isSubmitting}
					class="modern-button gap-2 border-0 bg-gradient-to-r from-primary to-purple-500 px-6 py-2 text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
				>
					<Send class="h-4 w-4" />
					{isSubmitting ? 'Sending...' : 'Send Reply'}
				</Button>
			</div>
		</CardContent>
	</div>

	<!-- Replies Section -->
	{#if post.replies.length > 0}
		<div class="space-y-6">
			<div class="flex items-center gap-3">
				<div class="rounded-lg bg-blue-500/20 p-2">
					<MessageCircle class="h-6 w-6 text-blue-500" />
				</div>
				<div>
					<h3 class="text-2xl font-bold">Community Responses</h3>
					<p class="text-muted-foreground">
						{post.replies.length}
						{post.replies.length === 1 ? 'person has' : 'people have'} shared their support
					</p>
				</div>
			</div>

			{#each post.replies as reply (reply.id)}
				<div class="modern-card relative ml-8 border-l-4 border-l-primary/30">
					<!-- Reply indicator line -->
					<div
						class="absolute top-6 -left-10 h-px w-6 bg-gradient-to-r from-primary/50 to-transparent"
					></div>

					<CardContent class="p-6">
						<div class="mb-4 flex items-center gap-3">
							<Badge
								variant="outline"
								class="gap-2 rounded-full border-border/30 bg-card/60 px-3 py-1 backdrop-blur-sm"
							>
								<Shield class="h-3 w-3 text-green-500" />
								<span class="text-xs">Anonymous</span>
							</Badge>
							<div
								class="flex items-center gap-2 rounded-full border border-border/30 bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm"
							>
								<Clock class="h-3 w-3" />
								<span>{getTimeAgo(reply.timestamp)}</span>
							</div>
						</div>

						<p class="mb-4 text-base leading-relaxed whitespace-pre-wrap text-foreground">
							{reply.content}
						</p>

						<div class="flex items-center justify-between">
							<Button
								variant={likedReplies.has(reply.id) ? 'default' : 'ghost'}
								size="sm"
								class="modern-button gap-2 text-sm {likedReplies.has(reply.id)
									? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md'
									: 'border border-border/30 bg-card/60 backdrop-blur-sm'}"
								onclick={() => handleReplyLike(reply.id)}
								disabled={likedReplies.has(reply.id)}
							>
								<Heart class="h-3 w-3 {likedReplies.has(reply.id) ? 'fill-current' : ''}" />
								<span>{reply.hearts}</span>
								<span class="hidden sm:inline">{reply.hearts === 1 ? 'Heart' : 'Hearts'}</span>
							</Button>

							<div class="flex items-center gap-2 text-xs text-muted-foreground">
								<ThumbsUp class="h-3 w-3 text-green-500" />
								<span>Helpful response</span>
							</div>
						</div>
					</CardContent>
				</div>
			{/each}
		</div>
	{/if}
</div>
