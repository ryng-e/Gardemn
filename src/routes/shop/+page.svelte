<script lang="ts">

    import Header from "$lib/components/Header.svelte";

    import { getLogged, getUid } from "$lib/firebase/auth";

    import { auth, db } from "$lib/firebase/firebase";
    import { query, doc, collection, getDoc, getDocs, orderBy } from "firebase/firestore";


    async function getSeeds() {
        const flowerInfo = await getDocs(query(collection(db, "flower"), orderBy("seedPrice")));
        flowerInfo.forEach((doc) => {
            const newDiv = document.createElement("div");
            newDiv.setAttribute("class", `card preset-filled-surface-100-900 pt-[20px] pb-[20px] flex flex-col items-center w-[20vw]`);
            const newImg = document.createElement("img");
            newImg.src = `images/seedsImages/${doc.data().name}Seed.png`;
            newImg.setAttribute("class", "w-[10vw]");
            const newName = document.createElement("p");
            newName.innerHTML = doc.data().name;
            const newPrice= document.createElement("p");
            newPrice.innerHTML = doc.data().seedPrice+"$";
            const newBtn = document.createElement("button");
            newBtn.setAttribute("class", "btn preset-filled");
            newBtn.innerHTML = "BUY";
            newDiv.appendChild(newImg);
            newDiv.appendChild(document.createElement("br"));
            newDiv.appendChild(newName);
            newDiv.appendChild(newPrice);
            newDiv.appendChild(document.createElement("br"));
            newDiv.appendChild(newBtn);
            document.getElementById("seeds")?.appendChild(newDiv);
        });
    }

    async function getIcons() {
        const iconInfo = await getDocs(query(collection(db, "icons"), orderBy("price")));
        iconInfo.forEach((doc) => {
            const newDiv = document.createElement("div");
            newDiv.setAttribute("class", `card preset-filled-surface-100-900 pt-[20px] pb-[20px] flex flex-col items-center w-[20vw]`);
            const newImg = document.createElement("img");
            newImg.src = `images/iconsImages/${doc.id}.png`;
            newImg.setAttribute("class", "w-[10vw]");
            const newName = document.createElement("p");
            newName.innerHTML = doc.data().name;
            const newPrice= document.createElement("p");
            newPrice.innerHTML = doc.data().price+"$";
            const newBtn = document.createElement("button");
            newBtn.setAttribute("class", "btn preset-filled");
            newBtn.innerHTML = "BUY";
            newDiv.appendChild(newImg);
            newDiv.appendChild(document.createElement("br"));
            newDiv.appendChild(newName);
            newDiv.appendChild(newPrice);
            newDiv.appendChild(document.createElement("br"));
            newDiv.appendChild(newBtn);
            document.getElementById("icons")?.appendChild(newDiv);
        });
    }

    async function getBorders() {
        const iconInfo = await getDocs(query(collection(db, "borders"), orderBy("price")));
        iconInfo.forEach((doc) => {
            const newDiv = document.createElement("div");
            newDiv.setAttribute("class", `card preset-filled-surface-100-900 pt-[20px] pb-[20px] flex flex-col items-center w-[20vw]`);
            const newImg = document.createElement("img");
            newImg.src = `images/bordersImages/${doc.id}.png`;
            newImg.setAttribute("class", "w-[10vw]");
            const newName = document.createElement("p");
            newName.innerHTML = doc.data().name;
            const newPrice= document.createElement("p");
            newPrice.innerHTML = doc.data().price+"$";
            const newBtn = document.createElement("button");
            newBtn.setAttribute("class", "btn preset-filled");
            newBtn.innerHTML = "BUY";
            newDiv.appendChild(newImg);
            newDiv.appendChild(document.createElement("br"));
            newDiv.appendChild(newName);
            newDiv.appendChild(newPrice);
            newDiv.appendChild(document.createElement("br"));
            newDiv.appendChild(newBtn);
            document.getElementById("borders")?.appendChild(newDiv);
        });
    }

    async function getCoins() {
        const profileInfo = await getDoc(doc(db, "users", getUid()));
        let newDiv = document.getElementById("coins");
        if(newDiv && profileInfo.data() != undefined) {
            newDiv.innerHTML = profileInfo.data().coins + "$";
        }
    }
    
    if(getLogged()) {
        getCoins();
        getSeeds();
        getIcons();
        getBorders();
    }

</script>

<Header />
{#if getLogged()}
    <h1 class="h1">Shop</h1>
    <div class="flex flex-col items-center">
        <h2 class="h2">Seeds</h2>
        <div id="seeds" class="flex flex-row justify-around w-full"></div>
        <br>
        <h2 class="h2">Icons</h2>
        <div id="icons" class="flex flex-row justify-around w-full"></div>
        <br>
        <h2 class="h2">Borders</h2>
        <div id="borders" class="flex flex-row justify-around w-full"></div>
    </div>
    <div class="card preset-filled-primary-900-100 fixed bottom-0 right-0 mb-[2vw] mr-[2vw] w-[10vw] h-[10vh]">
        <div id="coins" class="flex justify-center items-center w-full h-full"></div>
    </div>
{/if}