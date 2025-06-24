<script lang="ts">

    import Header from "$lib/components/Header.svelte";
    
    import { goto } from '$app/navigation';
    import { register, setLoggedTrue } from '$lib/firebase/auth';

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
                    owner: auth.currentUser?.uid,
                    coins: 100,
                    seeds: [0, 0, 0, 0],
                    icons: [false, false, false, false],
                    borders: [false, false, false],
                    activeIcon: "DefaultUserIcon",
                    activeBorder: null
                });
                setLoggedTrue();
                goto('/');
            } catch (err) {
                error = 'Email already in use.';
                console.error(err);
            }
        }
    }

</script>

<Header />

<h1 class="h1">Registration</h1>
<form on:submit|preventDefault={handleRegistration}>
    <input type="text" class="input" placeholder="Email" bind:value={email} required />
    <input type="text" class="input" placeholder="Username" bind:value={username} required />
    <input type="password" class="input" placeholder="Password" bind:value={password} required />
    <input type="password" class="input" placeholder="Password Confirmation" bind:value={confirmPassword} required />
    <button class="btn preset-filled">Register</button>
</form>
{#if error}
    <p class="p">{error}</p>
{/if}