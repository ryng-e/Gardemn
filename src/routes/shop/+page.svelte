<script lang="ts">

    import Header from "$lib/components/Header.svelte";

    import { getLogged, getUid } from "$lib/firebase/auth";

    import { auth, db } from "$lib/firebase/firebase";
    import { query, doc, collection, getDoc, getDocs, updateDoc, orderBy } from "firebase/firestore";


    async function getSeeds() {
       
        let checkInventory: number = 0;
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
            newBtn.dataset.id = checkInventory.toString();
            newBtn.addEventListener("click", (event) => {
                const id = (event.currentTarget as HTMLButtonElement).dataset.id;
                if(id) { buySeed(id); }
            });
            newBtn.innerHTML = "BUY";

            checkInventory++;

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

        let checkInventory: number = 0;
        const profileInfo = await getDoc(doc(db, "users", getUid()));

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
            newBtn.dataset.id = checkInventory.toString();
            newBtn.addEventListener("click", (event) => {
                const id = (event.currentTarget as HTMLButtonElement).dataset.id;
                if(id) { buyIcon(id, newBtn); }
            });
            newBtn.innerHTML = "BUY";

            if(profileInfo.data() != undefined && profileInfo.data()?.icons[checkInventory]) {
                newBtn.setAttribute("disabled", "");
                newBtn.innerHTML = "SOLD OUT";
            }
            checkInventory++;

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

        let checkInventory: number = 0;
        const profileInfo = await getDoc(doc(db, "users", getUid()));

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
            newBtn.dataset.id = checkInventory.toString();
            newBtn.addEventListener("click", (event) => {
                const id = (event.currentTarget as HTMLButtonElement).dataset.id;
                if(id) { BuyBorder(id, newBtn); }
            });
            newBtn.innerHTML = "BUY";

            if(profileInfo.data() != undefined && profileInfo.data()?.borders[checkInventory]) {
                newBtn.setAttribute("disabled", "");
                newBtn.innerHTML = "SOLD OUT";
            }
            checkInventory++;

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
        let getDiv = document.getElementById("coins");
        if(getDiv && profileInfo.data() != undefined) { getDiv.innerHTML = profileInfo.data()?.coins + "$"; }

    }

    async function buySeed(seedId:string) {
        
        const mapName = new Map();
        mapName.set("0", "daisy");
        mapName.set("1", "sunflower");
        mapName.set("2", "tulip");
        mapName.set("3", "rose");

        const profile = doc(db, "users", getUid());
        const profileInfo = await getDoc(profile);
        const seedInfo = await getDoc(doc(db, "flower", mapName.get(seedId)));

        if(profileInfo.data() != undefined && seedInfo.data != undefined) {
            const profileCoins: number = profileInfo.data()?.coins;
            const seedPrice: number = seedInfo.data()?.seedPrice;
            if(profileCoins >= seedPrice) {
                let updateSeedInventory: Array<number> = profileInfo.data()?.seeds;
                updateSeedInventory[Number(seedId)] += 1;
                const profileCoinsLeft: number = profileCoins - seedPrice;
                await updateDoc(profile, {"coins": profileCoinsLeft, "seeds": updateSeedInventory });
                getCoins();
            }
        }

    }

    async function BuyBorder(borderId: string, btn: HTMLButtonElement) {

        const mapName = new Map();
        mapName.set("0", "TriangleBorder");
        mapName.set("1", "BubbleBorder");
        mapName.set("2", "StarsBorder");

        const profile = doc(db, "users", getUid());
        const profileInfo = await getDoc(profile);
        const borderInfo = await getDoc(doc(db, "borders", mapName.get(borderId)));

        if(profileInfo.data() != undefined && borderInfo.data != undefined) {
            const profileCoins: number = profileInfo.data()?.coins;
            const borderPrice: number = borderInfo.data()?.price;
            if(profileCoins >= borderPrice) {
                btn.setAttribute("disabled", "");
                btn.innerHTML = "SOLD OUT";
                let updateBorderInventory: Array<boolean> = profileInfo.data()?.borders;
                updateBorderInventory[Number(borderId)] = true;
                const profileCoinsLeft: number = profileCoins - borderPrice;
                await updateDoc(profile, {"coins": profileCoinsLeft, "borders": updateBorderInventory });
                getCoins();
            }
        }

    }

    async function buyIcon(iconId:string, btn: HTMLButtonElement) {
        
        const mapName = new Map();
        mapName.set("0", "DaisyUserIcon");
        mapName.set("1", "SunflowerUserIcon");
        mapName.set("2", "TulipUserIcon");
        mapName.set("3", "RoseUserIcon");

        const profile = doc(db, "users", getUid());
        const profileInfo = await getDoc(profile);
        const iconInfo = await getDoc(doc(db, "icons", mapName.get(iconId)));

        if(profileInfo.data() != undefined && iconInfo.data != undefined) {
            const profileCoins: number = profileInfo.data()?.coins;
            const iconPrice: number = iconInfo.data()?.price;
            if(profileCoins >= iconPrice) {
                btn.setAttribute("disabled", "");
                btn.innerHTML = "SOLD OUT";
                let updateIconInventory: Array<boolean> = profileInfo.data()?.icons;
                updateIconInventory[Number(iconId)] = true;
                const profileCoinsLeft: number = profileCoins - iconPrice;
                await updateDoc(profile, {"coins": profileCoinsLeft, "icons": updateIconInventory });
                getCoins();
            }
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
{:else}
    <div class="flex flex-col justify-center items-center w-full h-[80vh]">
        <h1 class="h1">You shouldn't be here!</h1>
        <p class="p">Log in to have acces to this page</p>
    </div>
{/if}