<script>
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import { Label } from '$lib/components/ui/label';
	import { InputOTP, InputOTPGroup, InputOTPSlot } from '$lib/components/ui/input-otp';
	import {
		ArrowLeft,
		Heart,
		MessageCircle,
		Clock,
		FileText,
		Trash2,
		Eye,
		TrendingUp,
		BarChart3,
		Shield,
		Phone,
		Send,
		CheckCircle,
		AlertCircle,
		Edit3,
		Smartphone
	} from 'lucide-svelte';
	import { postsStore } from '../stores/posts.js';
	import { userPostsStore } from '../stores/userPosts.js';
	import { onMount } from 'svelte';

	let { onViewChange } = $props();

	// Security states
	let securityStep = $state('phone'); // 'phone', 'sending', 'otp', 'verified', 'change-phone'
	let phoneNumber = $state('');
	let storedPhoneNumber = $state('');
	let newPhoneNumber = $state('');
	let otpValue = $state('');
	let isLoading = $state(false);
	let generatedCode = $state('');
	let attempts = $state(0);
	let maxAttempts = 3;
	let timeLeft = $state(0);
	let timer = $state(null);
	let showChangePhone = $state(false);

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

	onMount(() => {
		// Load stored phone number
		const stored = localStorage.getItem('securePhoneNumber');
		if (stored) {
			storedPhoneNumber = stored;
			phoneNumber = stored;
		}
	});

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

	function formatPhoneNumber(value) {
		const cleaned = value.replace(/\D/g, '');
		const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
		if (match) {
			return `(${match[1]}) ${match[2]}-${match[3]}`;
		}
		return value;
	}

	function maskPhoneNumber(phone) {
		if (!phone) return '';
		const cleaned = phone.replace(/\D/g, '');
		if (cleaned.length === 10) {
			return `(${cleaned.slice(0, 3)}) ***-${cleaned.slice(-4)}`;
		}
		return phone;
	}

	function startTimer() {
		timeLeft = 60; // 60 seconds
		timer = setInterval(() => {
			timeLeft--;
			if (timeLeft <= 0) {
				clearInterval(timer);
				timer = null;
			}
		}, 1000);
	}

	async function handleSendCode() {
		const numberToUse = securityStep === 'change-phone' ? newPhoneNumber : phoneNumber;

		if (!numberToUse.trim() || numberToUse.replace(/\D/g, '').length !== 10) {
			return;
		}

		// If this is a new phone number, validate it's different
		if (securityStep === 'change-phone' && newPhoneNumber === storedPhoneNumber) {
			return;
		}

		isLoading = true;
		securityStep = 'sending';

		// Generate a random 6-digit code
		generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

		// Simulate sending SMS
		await new Promise((resolve) => setTimeout(resolve, 2000));

		isLoading = false;
		securityStep = 'otp';
		startTimer();
	}

	async function handleVerifyOTP() {
		if (otpValue.length !== 6) return;

		isLoading = true;

		// Simulate verification delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		if (otpValue === generatedCode) {
			// If we were changing phone number, update stored number
			if (newPhoneNumber && newPhoneNumber !== storedPhoneNumber) {
				storedPhoneNumber = newPhoneNumber;
				phoneNumber = newPhoneNumber;
				localStorage.setItem('securePhoneNumber', newPhoneNumber);
				newPhoneNumber = '';
			} else if (!storedPhoneNumber) {
				// First time setup
				storedPhoneNumber = phoneNumber;
				localStorage.setItem('securePhoneNumber', phoneNumber);
			}

			securityStep = 'verified';
			showChangePhone = false;
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
		} else {
			attempts++;
			if (attempts >= maxAttempts) {
				// Reset everything after max attempts
				resetSecurity();
			} else {
				otpValue = '';
			}
		}

		isLoading = false;
	}

	function handleResendCode() {
		if (timeLeft > 0) return;
		otpValue = '';
		handleSendCode();
	}

	function resetSecurity() {
		securityStep = storedPhoneNumber ? 'phone' : 'phone';
		if (storedPhoneNumber) {
			phoneNumber = storedPhoneNumber;
		}
		newPhoneNumber = '';
		otpValue = '';
		attempts = 0;
		generatedCode = '';
		timeLeft = 0;
		showChangePhone = false;
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	function startChangePhone() {
		securityStep = 'change-phone';
		newPhoneNumber = '';
		showChangePhone = true;
	}

	function cancelChangePhone() {
		securityStep = 'phone';
		newPhoneNumber = '';
		showChangePhone = false;
	}

	function clearStoredPhone() {
		if (
			confirm(
				'Are you sure you want to remove the stored phone number? You will need to set up a new number next time.'
			)
		) {
			localStorage.removeItem('securePhoneNumber');
			storedPhoneNumber = '';
			phoneNumber = '';
			resetSecurity();
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
			class="modern-button gap-2 bg-card/80 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
		>
			<ArrowLeft class="h-4 w-4" />
			<span class="hidden sm:inline">Back to Forum</span>
		</Button>
	</div>

	{#if securityStep !== 'verified'}
		<!-- Security Verification Flow -->
		<div class="mx-auto max-w-md">
			<!-- Security Header -->
			<div class="modern-card mb-8">
				<CardContent class="p-8 text-center">
					<div class="mb-4 flex items-center justify-center gap-3">
						<div class="rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 p-3">
							<Shield class="h-8 w-8 text-primary" />
						</div>
						<h1 class="text-3xl font-bold">Secure Access</h1>
					</div>
					<p class="text-lg leading-relaxed text-muted-foreground">
						{storedPhoneNumber
							? 'Verify your identity with your registered phone number.'
							: 'Set up secure access by registering your phone number.'}
					</p>
				</CardContent>
			</div>

			{#if securityStep === 'phone'}
				<!-- Phone Number Input/Display -->
				<div class="modern-card">
					<CardHeader class="surface-2 rounded-t-2xl">
						<h3 class="flex items-center gap-3 text-xl font-semibold">
							<div class="rounded-lg bg-blue-500/20 p-2">
								<Phone class="h-5 w-5 text-blue-500" />
							</div>
							{storedPhoneNumber ? 'Verify Your Number' : 'Register Your Phone'}
						</h3>
						<p class="mt-2 text-sm text-muted-foreground">
							{storedPhoneNumber
								? "We'll send a code to your registered number"
								: 'This number will be tied to this device for security'}
						</p>
					</CardHeader>
					<CardContent class="space-y-6 p-6">
						{#if storedPhoneNumber}
							<!-- Show stored number -->
							<div class="space-y-4">
								<div class="surface-2 rounded-xl p-4 text-center">
									<div class="mb-2 flex items-center justify-center gap-2">
										<Smartphone class="h-4 w-4 text-primary" />
										<span class="text-sm font-medium text-primary">Registered Number</span>
									</div>
									<p class="font-mono text-lg font-bold">{maskPhoneNumber(storedPhoneNumber)}</p>
									<p class="mt-1 text-xs text-muted-foreground">Registered to this device</p>
								</div>

								<Button
									onclick={handleSendCode}
									disabled={isLoading}
									class="modern-button glow-primary h-12 w-full bg-gradient-to-r from-primary to-purple-500 text-base font-semibold text-white shadow-lg"
								>
									<Send class="mr-2 h-4 w-4" />
									Send Code to This Number
								</Button>

								<div class="flex gap-2">
									<Button
										variant="outline"
										onclick={startChangePhone}
										class="modern-button flex-1 text-sm"
									>
										<Edit3 class="mr-2 h-3 w-3" />
										Change Number
									</Button>
									<Button
										variant="ghost"
										onclick={clearStoredPhone}
										class="modern-button flex-1 text-sm text-destructive hover:bg-destructive/10"
									>
										Remove Number
									</Button>
								</div>
							</div>
						{:else}
							<!-- First time setup -->
							<div class="space-y-3">
								<Label for="phone" class="text-base font-semibold">Phone Number</Label>
								<Input
									id="phone"
									type="tel"
									bind:value={phoneNumber}
									placeholder="(555) 123-4567"
									maxlength="14"
									class="modern-input h-12 text-center font-mono text-base"
									oninput={(e) => {
										phoneNumber = formatPhoneNumber(e.target.value);
									}}
								/>
								<p class="text-center text-xs text-muted-foreground">
									This number will be saved and required for future access
								</p>
							</div>

							<Button
								onclick={handleSendCode}
								disabled={!phoneNumber.trim() ||
									phoneNumber.replace(/\D/g, '').length !== 10 ||
									isLoading}
								class="modern-button glow-primary h-12 w-full bg-gradient-to-r from-primary to-purple-500 text-base font-semibold text-white shadow-lg disabled:opacity-50"
							>
								<Send class="mr-2 h-4 w-4" />
								Register & Send Code
							</Button>
						{/if}
					</CardContent>
				</div>
			{:else if securityStep === 'change-phone'}
				<!-- Change Phone Number -->
				<div class="modern-card">
					<CardHeader class="surface-2 rounded-t-2xl">
						<h3 class="flex items-center gap-3 text-xl font-semibold">
							<div class="rounded-lg bg-orange-500/20 p-2">
								<Edit3 class="h-5 w-5 text-orange-500" />
							</div>
							Change Phone Number
						</h3>
						<p class="mt-2 text-sm text-muted-foreground">
							Enter a new phone number to replace your current one
						</p>
					</CardHeader>
					<CardContent class="space-y-6 p-6">
						<!-- Current number -->
						<div class="surface-2 rounded-xl p-4">
							<p class="mb-1 text-sm text-muted-foreground">Current Number:</p>
							<p class="font-mono font-semibold">{maskPhoneNumber(storedPhoneNumber)}</p>
						</div>

						<!-- New number input -->
						<div class="space-y-3">
							<Label for="newPhone" class="text-base font-semibold">New Phone Number</Label>
							<Input
								id="newPhone"
								type="tel"
								bind:value={newPhoneNumber}
								placeholder="(555) 123-4567"
								maxlength="14"
								class="modern-input h-12 text-center font-mono text-base"
								oninput={(e) => {
									newPhoneNumber = formatPhoneNumber(e.target.value);
								}}
							/>
							<p class="text-center text-xs text-muted-foreground">
								This will replace your current registered number
							</p>
						</div>

						<div class="flex gap-3">
							<Button
								onclick={handleSendCode}
								disabled={!newPhoneNumber.trim() ||
									newPhoneNumber.replace(/\D/g, '').length !== 10 ||
									newPhoneNumber === storedPhoneNumber ||
									isLoading}
								class="modern-button glow-warning h-12 flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-base font-semibold text-white shadow-lg disabled:opacity-50"
							>
								<Send class="mr-2 h-4 w-4" />
								Send Code
							</Button>
							<Button variant="outline" onclick={cancelChangePhone} class="modern-button h-12 px-6">
								Cancel
							</Button>
						</div>
					</CardContent>
				</div>
			{:else if securityStep === 'sending'}
				<!-- Sending Code -->
				<div class="modern-card">
					<CardContent class="p-8 text-center">
						<div class="mb-6 flex items-center justify-center gap-3">
							<div
								class="h-8 w-8 animate-spin rounded-full border-3 border-primary/30 border-t-primary"
							></div>
							<h3 class="text-xl font-semibold">Sending Code...</h3>
						</div>
						<p class="text-muted-foreground">
							We're sending a 6-digit verification code to<br />
							<span class="font-mono font-semibold text-foreground">
								{newPhoneNumber ? maskPhoneNumber(newPhoneNumber) : maskPhoneNumber(phoneNumber)}
							</span>
						</p>
					</CardContent>
				</div>
			{:else if securityStep === 'otp'}
				<!-- OTP Input -->
				<div class="modern-card">
					<CardHeader class="surface-2 rounded-t-2xl">
						<h3 class="flex items-center gap-3 text-xl font-semibold">
							<div class="rounded-lg bg-green-500/20 p-2">
								<Shield class="h-5 w-5 text-green-500" />
							</div>
							Enter Verification Code
						</h3>
						<p class="mt-2 text-sm text-muted-foreground">
							Code sent to {newPhoneNumber
								? maskPhoneNumber(newPhoneNumber)
								: maskPhoneNumber(phoneNumber)}
							{#if timeLeft > 0}
								• Expires in {timeLeft}s
							{/if}
						</p>
					</CardHeader>
					<CardContent class="space-y-6 p-6">
						<!-- Demo Code Display (remove in production) -->
						<div class="surface-2 rounded-xl p-4 text-center">
							<p class="mb-2 text-xs text-muted-foreground">Demo Code (for testing):</p>
							<p class="font-mono text-lg font-bold text-primary">{generatedCode}</p>
						</div>

						<div class="flex justify-center">
							<InputOTP bind:value={otpValue} maxlength={6} onComplete={handleVerifyOTP}>
								<InputOTPGroup>
									<InputOTPSlot index={0} class="modern-input h-12 w-12 font-mono text-lg" />
									<InputOTPSlot index={1} class="modern-input h-12 w-12 font-mono text-lg" />
									<InputOTPSlot index={2} class="modern-input h-12 w-12 font-mono text-lg" />
									<InputOTPSlot index={3} class="modern-input h-12 w-12 font-mono text-lg" />
									<InputOTPSlot index={4} class="modern-input h-12 w-12 font-mono text-lg" />
									<InputOTPSlot index={5} class="modern-input h-12 w-12 font-mono text-lg" />
								</InputOTPGroup>
							</InputOTP>
						</div>

						{#if attempts > 0}
							<div
								class="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
							>
								<AlertCircle class="h-4 w-4" />
								<span>
									Invalid code. {maxAttempts - attempts}
									{maxAttempts - attempts === 1 ? 'attempt' : 'attempts'} remaining.
								</span>
							</div>
						{/if}

						<div class="flex gap-3">
							<Button
								onclick={handleVerifyOTP}
								disabled={otpValue.length !== 6 || isLoading}
								class="modern-button glow-success h-12 flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-base font-semibold text-white shadow-lg disabled:opacity-50"
							>
								{#if isLoading}
									<div
										class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
									></div>
									Verifying...
								{:else}
									<CheckCircle class="mr-2 h-4 w-4" />
									Verify Code
								{/if}
							</Button>

							<Button
								variant="outline"
								onclick={handleResendCode}
								disabled={timeLeft > 0}
								class="modern-button h-12 px-6 {timeLeft > 0 ? 'opacity-50' : ''}"
							>
								{timeLeft > 0 ? `${timeLeft}s` : 'Resend'}
							</Button>
						</div>

						<Button
							variant="ghost"
							onclick={resetSecurity}
							class="modern-button w-full text-sm text-muted-foreground"
						>
							Cancel Verification
						</Button>
					</CardContent>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Verified - Show Posts -->
		<div class="space-y-8">
			<!-- Success Message -->
			<div class="modern-card glow-success">
				<CardContent class="p-6">
					<div class="flex items-center gap-4 text-green-800 dark:text-green-200">
						<div class="rounded-full bg-green-500/20 p-3">
							<CheckCircle class="h-6 w-6 text-green-600" />
						</div>
						<div class="flex-1">
							<h3 class="mb-1 text-lg font-semibold">Access Granted!</h3>
							<p class="text-sm text-green-700 dark:text-green-300">
								Verified with {maskPhoneNumber(storedPhoneNumber)}
							</p>
						</div>
						<Button variant="ghost" size="sm" onclick={resetSecurity} class="modern-button text-xs">
							Logout
						</Button>
					</div>
				</CardContent>
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
								<h1 class="mb-2 text-3xl font-bold text-black">My Posts</h1>
								<p class="text-lg text-muted-foreground">Posts you've shared from this device</p>
							</div>
						</div>

						<!-- Stats -->
						<div class="flex gap-4">
							<div class="surface-2 rounded-2xl p-4 text-center">
								<div class="text-2xl font-bold text-primary">{myPosts.length}</div>
								<div class="text-xs text-muted-foreground">Posts</div>
							</div>
							<div class="surface-2 rounded-2xl p-4 text-center">
								<div class="text-2xl font-bold text-red-500">{totalHearts}</div>
								<div class="text-xs text-muted-foreground">Hearts</div>
							</div>
							<div class="surface-2 rounded-2xl p-4 text-center">
								<div class="text-2xl font-bold text-blue-500">{totalReplies}</div>
								<div class="text-xs text-muted-foreground">Replies</div>
							</div>
						</div>
					</div>
				</CardContent>
			</div>

			<!-- Privacy Notice -->
			<div class="modern-card surface-2">
				<CardContent class="p-6">
					<div class="flex items-start gap-4">
						<div class="rounded-lg bg-blue-500/20 p-2">
							<Eye class="h-5 w-5 text-blue-600 dark:text-blue-400" />
						</div>
						<div class="flex-1">
							<h3 class="mb-2 font-semibold text-blue-800 dark:text-blue-200">
								Privacy & Security
							</h3>
							<p class="text-sm leading-relaxed text-blue-700 dark:text-blue-300">
								Your posts are stored locally on this device and protected by SMS verification to
								your registered number:
								<span class="font-mono font-semibold">{maskPhoneNumber(storedPhoneNumber)}</span>
							</p>
						</div>
					</div>
				</CardContent>
			</div>

			<!-- Posts List -->
			{#if myPosts.length > 0}
				<div class="space-y-6">
					{#each myPosts as post (post.id)}
						<div
							class="modern-card group overflow-hidden transition-all duration-300 hover:shadow-xl"
						>
							<div class="surface-2 rounded-t-3xl p-6">
								<div class="flex items-start justify-between gap-4">
									<div class="flex-1">
										<div class="mb-3 flex flex-wrap items-center gap-3">
											<Badge
												class="rounded-full px-3 py-1 font-medium shadow-sm {categories.find(
													(c) => c.id === post.category
												)?.color}"
											>
												<span class="mr-1"
													>{categories.find((c) => c.id === post.category)?.icon}</span
												>
												{categories.find((c) => c.id === post.category)?.label}
											</Badge>
											<div
												class="surface-1 flex items-center gap-2 rounded-full px-3 py-1 text-sm text-muted-foreground"
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

								<div class="soft-divider my-4"></div>

								<div class="flex items-center justify-between">
									<div class="flex items-center gap-6">
										<div class="surface-2 flex items-center gap-2 rounded-full px-3 py-2 text-sm">
											<Heart class="h-4 w-4 text-red-500" />
											<span class="font-medium">{post.hearts}</span>
										</div>
										<div class="surface-2 flex items-center gap-2 rounded-full px-3 py-2 text-sm">
											<MessageCircle class="h-4 w-4 text-blue-500" />
											<span class="font-medium">{post.replies.length}</span>
										</div>
										{#if post.hearts > 5 || post.replies.length > 3}
											<div
												class="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-600"
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
								class="modern-button glow-primary bg-gradient-to-r from-primary to-purple-500 px-8 py-3 text-base text-white shadow-lg hover:shadow-xl"
							>
								<Heart class="mr-2 h-4 w-4" />
								Share Your First Story
							</Button>
						</div>
					</CardContent>
				</div>
			{/if}
		</div>
	{/if}
</div>
