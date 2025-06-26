<script lang="ts">

    import Header from "$lib/components/Header.svelte";
    
    import { getLogged } from "$lib/firebase/auth";



</script>

<Header />
{#if getLogged()}
    ciao
{:else}
    <div class="flex flex-col justify-center items-center w-full h-[80vh]">
        <h1 class="h1">You shouldn't be here!</h1>
        <p>Log in to have acces to this page</p>
    </div>
{/if}