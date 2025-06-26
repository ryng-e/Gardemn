<script lang="ts">

    import { goto } from "$app/navigation";
    import { getLogged, logout } from "$lib/firebase/auth";
    
    async function localLogout() {
        await logout();
        goto('/login');
    }

</script>

<div class="flex flex-col justify-around items-center h-[20vh]">
    <a href="/"><h1 class="h1 font-bold">Gardemn</h1></a>
    <div class="flex flex-row justify-around w-full">
        {#if !getLogged()}
            <a href="/login"><button class="btn preset-filled w-[20vw]">login</button></a>
            <a href="/register"><button class="btn preset-filled w-[20vw]">register</button></a>
        {:else}
            <a href="/profile"><button id="username" class="btn preset-filled w-[20vw]">profile</button></a>
            <a href="/shop"><button id="username" class="btn preset-filled w-[20vw]">shop</button></a>
            <button class="btn preset-filled w-[20vw]" on:click={localLogout}>logout</button>
        {/if}
    </div>
</div>