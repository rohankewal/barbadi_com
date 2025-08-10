import { writable } from 'svelte/store';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize user posts from localStorage
function createUserPostsStore() {
	let initialPosts = [];

	if (isBrowser) {
		try {
			const stored = localStorage.getItem('userPosts');
			if (stored) {
				initialPosts = JSON.parse(stored);
			}
		} catch (error) {
			console.error('Error loading user posts from localStorage:', error);
		}
	}

	const { subscribe, set, update } = writable(initialPosts);

	return {
		subscribe,
		set: (value) => {
			if (isBrowser) {
				localStorage.setItem('userPosts', JSON.stringify(value));
			}
			set(value);
		},
		update: (fn) => {
			update((posts) => {
				const newPosts = fn(posts);
				if (isBrowser) {
					localStorage.setItem('userPosts', JSON.stringify(newPosts));
				}
				return newPosts;
			});
		}
	};
}

export const userPostsStore = createUserPostsStore();
