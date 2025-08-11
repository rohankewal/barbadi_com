<script>
	import { onMount } from 'svelte';
	import Header from '../lib/components/Header.svelte';
	import PostList from '../lib/components/PostList.svelte';
	import CreatePost from '../lib/components/CreatePost.svelte';
	import PostView from '../lib/components/PostView.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { themeStore } from '../lib/stores/theme.js';
	import { postsStore } from '../lib/stores/posts.js';

	let currentView = $state('forum'); // 'forum', 'create', 'post'
	let selectedPost = $state(null);

	function handleViewChange(view, post = null) {
		currentView = view;
		selectedPost = post;
	}

	onMount(() => {
		// Initialize theme from localStorage
		const savedTheme = localStorage.getItem('theme') || 'light';
		themeStore.set(savedTheme);

		// Apply theme immediately
		if (savedTheme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	});

	// Subscribe to theme changes
	$effect(() => {
		const theme = $themeStore;
		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
		localStorage.setItem('theme', theme);
	});
</script>

<div class="min-h-screen bg-background text-foreground transition-colors duration-300">
	<Header {currentView} onViewChange={handleViewChange} />

	<main class="container mx-auto max-w-4xl px-4 py-8">
		{#if currentView === 'forum'}
			<PostList onViewChange={handleViewChange} />
		{:else if currentView === 'create'}
			<CreatePost onViewChange={handleViewChange} />
		{:else if currentView === 'post' && selectedPost}
			<PostView post={selectedPost} onViewChange={handleViewChange} />
		{/if}
	</main>

	<Footer />
</div>
