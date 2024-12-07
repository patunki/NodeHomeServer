<script>
    import { onMount } from 'svelte';

    // Redirect the user to the home page
    onMount(() => {
        if (window.location.pathname === '/home') {
            window.location.replace('/');
        }
    });
</script>