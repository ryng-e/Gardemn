<script lang="ts">

    import Header from "$lib/components/Header.svelte";
    
    import { goto } from '$app/navigation';
    import { login } from '$lib/firebase/auth';

    let email: string = '';
    let password: string = '';
    let error: string | null = null;

    async function handleLogin() {
        try {
            await login(email, password);
            goto('/');
        } catch (err) {
            error = "Something went wrong."
            console.error(err);
        }
    }

</script>

<Header />
<div class="flex flex-col justify-center items-center w-full h-[80vh]">
    <h1 class="h1">Welcome back!</h1>
    <br>
    <form class="flex flex-col items-center" on:submit|preventDefault={handleLogin}>
        <input type="text" class="input w-[20vw] text-center" placeholder="Email" bind:value={email} required />
        <input type="password" class="input w-[20vw] text-center" placeholder="Password" bind:value={password} required />
        <br>
        <button class="btn preset-filled w-[15vw]">Log In</button>
    </form>
    <br>
    {#if error}
        <p class="p text-warning-900">{error}</p>
    {:else}
        <p class="p">‎</p>
    {/if}
</div>