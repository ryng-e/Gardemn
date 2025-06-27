<script lang="ts">
	import '../app.css';
	if ('serviceWorker' in navigator) {
  		navigator.serviceWorker.register('/service-worker.js')
    	.then(reg => console.log('Service Worker registrato:', reg))
    	.catch(err => console.error('Errore registrazione SW:', err));
	}
	
	let { children } = $props();
</script>

{@render children()}
