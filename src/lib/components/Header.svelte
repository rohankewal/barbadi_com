<script>
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import { Moon, Sun, Plus, Search, Heart, Shield, Users, User, FileText } from 'lucide-svelte';
	import { themeStore } from '../stores/theme.js';
	import { postsStore } from '../stores/posts.js';
	import { userPostsStore } from '../stores/userPosts.js';

	let { onViewChange, currentView } = $props();
	let searchQuery = $state('');

	function toggleTheme() {
		themeStore.update((theme) => {
			const newTheme = theme === 'light' ? 'dark' : 'light';
			return newTheme;
		});
	}

	function handleSearch() {
		if (!searchQuery.trim()) return;

		const query = searchQuery.toLowerCase();
		postsStore.update((posts) => {
			return posts.map((post) => ({
				...post,
				_searchMatch:
					post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query)
			}));
		});

		onViewChange('forum');
	}

	function handleKeydown(event) {
		if (event.key === 'Enter') {
			handleSearch();
		}
	}

	const myPostsCount = $derived($userPostsStore.length);
</script>

<header
	class="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
>
	<div
		class="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background"
	></div>
	<div class="relative container mx-auto px-4 py-6">
		<div class="flex items-center justify-between gap-4">
			<!-- Logo and Title -->
			<button
				onclick={() => onViewChange('forum')}
				class="group relative z-10 flex items-center gap-4 transition-all duration-300 hover:opacity-80"
			>
				<div
					class="floating rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 p-3 shadow-lg transition-transform duration-300 group-hover:scale-105"
				>
					<Heart class="h-7 w-7 text-primary" />
				</div>
				<div class="text-left">
					<h1 class="text-2xl font-bold text-black dark:text-white">SafeSpace</h1>
					<p class="text-sm text-muted-foreground">Anonymous Marriage Support</p>
				</div>
			</button>

			<!-- Search Bar -->
			<div class="relative z-10 hidden max-w-md flex-1 items-center gap-3 md:flex">
				<div class="relative flex-1">
					<Search
						class="absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 transform text-muted-foreground"
					/>
					<Input
						bind:value={searchQuery}
						placeholder="Search discussions..."
						class="modern-input h-12 border border-border/50 bg-card/90 pl-12 shadow-md backdrop-blur-sm"
						onkeydown={handleKeydown}
					/>
				</div>
				<Button
					variant="outline"
					size="sm"
					onclick={handleSearch}
					class="modern-button h-12 border border-border/50 bg-card/90 px-6 shadow-md backdrop-blur-sm"
				>
					Search
				</Button>
			</div>

			<!-- Action Buttons -->
			<div class="relative z-10 flex items-center gap-3">
				<!-- My Posts Button -->
				<Button
					variant={currentView === 'my-posts' ? 'default' : 'outline'}
					size="sm"
					onclick={() => onViewChange('my-posts')}
					class="modern-button relative h-12 gap-2 px-4 {currentView === 'my-posts'
						? 'border-0 bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg'
						: 'border border-border/50 bg-card/90 shadow-md backdrop-blur-sm'}"
					title="View your posts"
				>
					<FileText class="h-4 w-4" />
					<span class="hidden sm:inline">My Posts</span>
					{#if myPostsCount > 0}
						<Badge
							variant="secondary"
							class="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-0 bg-gradient-to-r from-primary to-purple-500 p-0 text-xs text-white shadow-lg"
						>
							{myPostsCount}
						</Badge>
					{/if}
				</Button>

				<Button
					variant={currentView === 'create' ? 'default' : 'outline'}
					size="sm"
					onclick={() => onViewChange('create')}
					class="modern-button h-12 gap-2 px-4 {currentView === 'create'
						? 'border-0 bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg'
						: 'border border-border/50 bg-card/90 shadow-md backdrop-blur-sm'}"
				>
					<Plus class="h-4 w-4" />
					<span class="hidden sm:inline">Share</span>
				</Button>

				<Button
					variant="ghost"
					size="sm"
					onclick={toggleTheme}
					class="modern-button h-12 w-12 border border-border/50 bg-card/90 p-3 shadow-md backdrop-blur-sm hover:bg-card/95"
					title="Toggle theme"
				>
					{#if $themeStore === 'light'}
						<Moon class="h-5 w-5" />
					{:else}
						<Sun class="h-5 w-5" />
					{/if}
				</Button>
			</div>
		</div>

		<!-- Mobile Search -->
		<div class="relative z-10 mt-4 md:hidden">
			<div class="relative">
				<Search
					class="absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 transform text-muted-foreground"
				/>
				<Input
					bind:value={searchQuery}
					placeholder="Search discussions..."
					class="modern-input h-12 border border-border/50 bg-card/90 pl-12 shadow-md backdrop-blur-sm"
					onkeydown={handleKeydown}
				/>
			</div>
		</div>

		<!-- Trust Indicators -->
		<div class="relative z-10 mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
			<div
				class="flex items-center gap-2 rounded-full border border-border/30 bg-card/80 px-4 py-2 shadow-sm backdrop-blur-sm"
			>
				<Shield class="h-4 w-4 text-green-500" />
				<span>100% Anonymous</span>
			</div>
			<div
				class="flex items-center gap-2 rounded-full border border-border/30 bg-card/80 px-4 py-2 shadow-sm backdrop-blur-sm"
			>
				<Users class="h-4 w-4 text-blue-500" />
				<span>Safe Community</span>
			</div>
			<Badge
				variant="secondary"
				class="rounded-full border-primary/20 bg-gradient-to-r from-primary/10 to-purple-500/10 px-3 py-1 text-xs shadow-sm"
			>
				No Registration Required
			</Badge>
			{#if myPostsCount > 0}
				<div
					class="flex items-center gap-2 rounded-full border border-border/30 bg-card/80 px-4 py-2 shadow-sm backdrop-blur-sm"
				>
					<User class="h-4 w-4 text-primary" />
					<span>{myPostsCount} {myPostsCount === 1 ? 'post' : 'posts'} from this device</span>
				</div>
			{/if}
		</div>
	</div>
</header>
