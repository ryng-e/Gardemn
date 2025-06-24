<script lang="ts">

    import Header from "$lib/components/Header.svelte";
    
    import { goto } from '$app/navigation';
    import { login, setLoggedTrue } from '$lib/firebase/auth';

    let email: string = '';
    let password: string = '';
    let error: string | null = null;

    async function handleLogin() {
        try {
            await login(email, password);
            setLoggedTrue();
            goto('/');
        } catch (err) {
            error = "Something went wrong."
            console.error(err);
        }
    }

</script>

<Header />

<h1 class="h1">Welcome back!</h1>
<form on:submit|preventDefault={handleLogin}>
    <input type="text" class="input" placeholder="Email" bind:value={email} required />
    <input type="password" class="input" placeholder="Password" bind:value={password} required />
    <button class="btn preset-filled">Log In</button>
</form>
{#if error}
    <p class="p">{error}</p>
{/if}