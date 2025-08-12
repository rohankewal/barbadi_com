<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="mt-16 border-t border-slate-200 bg-white">
	<div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
			<p class="text-sm text-slate-500">&copy; {year} Barbadi.com. All rights reserved.</p>
			<div class="flex space-x-6">
				<a
					href="#"
					class="hover: cursor-pointer text-sm text-slate-500 transition-colors hover:text-rose-600"
					>About</a
				>
				<a
					href="#"
					class="hover: cursor-pointer text-sm text-slate-500 transition-colors hover:text-rose-600"
					>Privacy Policy</a
				>
				<a
					href="#"
					class="hover: cursor-pointer text-sm text-slate-500 transition-colors hover:text-rose-600"
					>Terms of Service</a
				>
			</div>
		</div>
	</div>
</footer>
