<script lang="ts">

    import Header from "$lib/components/Header.svelte";
    
    import { goto } from '$app/navigation';
    import { register } from '$lib/firebase/auth';

    import { doc, setDoc  } from "firebase/firestore";
    import { auth, db } from "$lib/firebase/firebase";

    let email: string = '';
    let username: string = '';
    let password: string = '';
    let confirmPassword: string = '';
    let error: string | null = null;

    async function handleRegistration() {
        if (password !== confirmPassword) {
            error = 'Password do not match.'
        } else if(password.length < 6) {
            error = 'Password too short.'
        } else {
            try {
                await register(email, password);
                if(auth.currentUser?.uid == undefined) {
                    throw "error";
                }
                let uid: string = auth.currentUser?.uid;
                await setDoc(doc(db, "users", uid), {
                    username: username,
                    owner: uid,
                    coins: 100,
                    seeds: [0, 0, 0, 0],
                    icons: [false, false, false, false],
                    borders: [false, false, false],
                    activeIcon: "DefaultUserIcon",
                    activeBorder: null
                });
                await setDoc(doc(db, "gardens", uid), {
                    owner: uid,
                    flowers: [{
                        name: null,
                        ready: null
                    }, {
                        name: null,
                        ready: null
                    }, {
                        name: null,
                        ready: null
                    }, {
                        name: null,
                        ready: null
                    }, {
                        name: null,
                        ready: null
                    }, {
                        name: null,
                        ready: null
                    }] 
                });
                goto('/');
            } catch (err) {
                error = 'Email already in use.';
                console.error(err);
            }
        }
    }

</script>

<Header />
<div class="flex flex-col justify-center items-center w-full h-[80vh]">
    <h1 class="h1">Registration</h1>
    <br>
    <form class="flex flex-col items-center" on:submit|preventDefault={handleRegistration}>
        <input type="text" class="input w-[20vw] text-center" placeholder="Email" bind:value={email} required />
        <input type="text" class="input w-[20vw] text-center" placeholder="Username" bind:value={username} required />
        <input type="password" class="input w-[20vw] text-center" placeholder="Password" bind:value={password} required />
        <input type="password" class="input w-[20vw] text-center" placeholder="Password Confirmation" bind:value={confirmPassword} required />
        <br>
        <button class="btn preset-filled w-[15vw]">Register</button>
    </form>
    <br>
    {#if error}
        <p class="p text-warning-900">{error}</p>
    {:else}
        <p class="p">‎</p>
    {/if}
</div>