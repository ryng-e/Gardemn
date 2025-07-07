<script lang="ts">

    import { getLogged, getUid } from "$lib/firebase/auth";

    import { db } from "$lib/firebase/firebase";
    import { collection, doc, DocumentReference, DocumentSnapshot, getDoc, getDocs, orderBy, query, Timestamp, updateDoc, type DocumentData } from "firebase/firestore";

    let seedSelected: (string | null) = null;
    let notificationsAllowed = true;
    
    // function that print your garden
    async function getFlowers():Promise<void> {
        
        const gardenInfo = await getDoc(doc(db, "gardens", getUid()));
        if(gardenInfo.exists()) {
            
            const gardenFlower: any[] = gardenInfo.data().flowers;
            const gardenSize: number = gardenFlower.length;
            for(let i: number = 0; i < gardenSize; i++) {

                const newDiv: HTMLDivElement = document.createElement("div");
                newDiv.setAttribute("class", `card flex flex-col justify-end items-center w-[20vw] h-full`);

                const newPlace: HTMLDivElement = document.createElement("div");
                newPlace.setAttribute("class", `card preset-filled-surface-100-900 flex justify-center items-center w-[10vw] h-[10vh]`);
                newPlace.dataset.id = i.toString();
                newPlace.addEventListener("click", (event) => {
                    const id: (string | undefined) = (event.currentTarget as HTMLButtonElement).dataset.id;
                    if(id) { toggleSelectSpace(id, newPlace); }
                });

                if(gardenFlower[i].name) {
                    
                    const rn = new Date();
                    const blossomDate = (gardenFlower[i].ready).toDate();

                    const newImg: HTMLImageElement = document.createElement("img");
                    newImg.id = "img";
                    newImg.setAttribute("class", "w-[5vw]");
                    if(blossomDate <= rn) {
                        newImg.src = `images/flowersImages/${gardenFlower[i].name}.png`;
                    } else {
                        newImg.src = `images/flowersImages/Sprout.png`;
                    }
                    newPlace.appendChild(newImg);

                }
            
                newDiv.appendChild(newPlace);
                document.getElementById("garden")?.appendChild(newDiv);
            
            }

        }

    }

    // function that print the seeds in your inventory
    async function getSeeds(): Promise<void> {

        let numberId: number = 0;
        const userInfo = await getDoc(doc(db, "users", getUid()));
        if(userInfo.exists()) {

            const seedArray: number[] = userInfo.data().seeds;
            const flowerInfo = await getDocs(query(collection(db, "flower"), orderBy("seedPrice")));
            flowerInfo.forEach((doc) => {

                const newDiv: HTMLDivElement = document.createElement("div");
                newDiv.setAttribute("class", `card flex flex-col justify-center items-center align w-[10vw] h-[20vh]`);
                newDiv.setAttribute("id", numberId.toString());
                newDiv.dataset.id = numberId.toString();
                newDiv.addEventListener("click", (event) => {
                    const id: (string | undefined) = (event.currentTarget as HTMLButtonElement).dataset.id;
                    if(id) { toggleSelectSeed(id, newDiv); }
                });

                const newImg: HTMLImageElement = document.createElement("img");
                newImg.src = `images/seedsImages/${doc.data().name}Seed.png`;
                newImg.setAttribute("class", "w-[5vw]");

                const newName: HTMLParagraphElement = document.createElement("p");
                newName.innerHTML = doc.data().name;

                const newAmount: HTMLParagraphElement = document.createElement("p");
                const amountId: string = "amount" + numberId.toString()
                newAmount.setAttribute("id", amountId);
                newAmount.innerHTML = seedArray[numberId].toString();

                newDiv.appendChild(newImg);
                newDiv.appendChild(newName);
                newDiv.appendChild(newAmount);
                document.getElementById("seeds")?.appendChild(newDiv);
                
                numberId++;

            });

        }

    }

    // function that select which kind of seed plant
    function toggleSelectSeed(id: string, div: HTMLDivElement): void {

        if(seedSelected) {

            if(id == seedSelected) {

                seedSelected = null;
                div.setAttribute("class", "card flex flex-col justify-center items-center align w-[10vw] h-[20vh]");

            } else {

                document.getElementById(seedSelected)?.setAttribute("class", "card flex flex-col justify-center items-center align w-[10vw] h-[20vh]");
                seedSelected = id;
                div.setAttribute("class", "card preset-filled-surface-100-900 flex flex-col justify-center items-center align w-[10vw] h-[20vh]");

            }

        } else {

            seedSelected = id;
            div.setAttribute("class", "card preset-filled-surface-100-900 flex flex-col justify-center items-center align w-[10vw] h-[20vh]");

        }

    }

    // function that select where to plant the seed
    async function toggleSelectSpace(id: string, place: HTMLDivElement): Promise<void> {

        if(seedSelected) {

            const userRef = doc(db, "users", getUid());
            const userInfo: DocumentSnapshot = await getDoc(userRef);
            if(userInfo.exists()) {

                // check seed amount in inventory
                if(userInfo.data().seeds[seedSelected] > 0) {

                    const gardenRef = doc(db, "gardens", getUid());
                    const gardenInfo: DocumentSnapshot = await getDoc(gardenRef);
                    if(gardenInfo.exists()) {

                        const userFlowerData = gardenInfo.data().flowers;
                        // check if there is already a flower
                        if(userFlowerData[id].name == null) {
                            
                            // client side operation
                            let value: (string | undefined) = document.getElementById("amount"+seedSelected)?.innerHTML;
                            value = (Number(value)-1).toString();
                            const getAmount = document.getElementById("amount"+seedSelected);
                            if(getAmount) { getAmount.innerHTML = value }

                            
                            const newImg: HTMLImageElement = document.createElement("img");
                            newImg.id = "img";
                            newImg.src = `images/flowersImages/Sprout.png`;
                            newImg.setAttribute("class", "w-[5vw]");
                            place.appendChild(newImg);

                            // removed used seed
                            let updateSeedInventory: Array<number> = userInfo.data()?.seeds;
                            updateSeedInventory[Number(seedSelected)] -= 1;
                            await updateDoc(userRef, {seeds: updateSeedInventory});

                            // insert seed in space
                            const mapName = new Map();
                            mapName.set("0", "daisy");
                            mapName.set("1", "sunflower");
                            mapName.set("2", "tulip");
                            mapName.set("3", "rose");
                            
                            const flowerInfo = await getDoc(doc(db, "flower", mapName.get(seedSelected)));
                            if(flowerInfo.exists()) {

                                userFlowerData[id].name = flowerInfo.data().name;
                                
                                const rn = new Date();
                                const rnUpdate = new Date();
                                rnUpdate.setMinutes(rnUpdate.getMinutes() + flowerInfo.data().time);
                                userFlowerData[id].ready = Timestamp.fromDate(rnUpdate);

                                await updateDoc(gardenRef, {flowers: userFlowerData});

                                // set notification
                                if(notificationsAllowed) {

                                    setTimeout(() => {
                                        navigator.serviceWorker.ready.then((registration) => {

                                            try {
                                        
                                                registration.showNotification(
                                                    "Gardemn",
                                                    {
                                                        lang: "it",
                                                        body: `Hey! A new ${userFlowerData[id].name} is blossomed!\nGo check your garden!`,    
                                                        icon: "/icons/icon.png"
                                                    }
                                                )

                                            } catch(err) {
                                                console.log(err);
                                            }

                                        })}, (rnUpdate.getTime() - rn.getTime())
                                    );

                                }

                            }

                        }

                    }
                    
                }

            }

        }

    }

    async function getCoins() {

        const profileInfo = await getDoc(doc(db, "users", getUid()));
        let getDiv = document.getElementById("coins");
        if(getDiv && profileInfo.data() != undefined) { getDiv.innerHTML = profileInfo.data()?.coins + "$"; }

    }

    async function sellAll() {

        const gardenRef: DocumentReference = doc(db, "gardens", getUid());
        const gardenInfo: DocumentSnapshot = await getDoc(gardenRef);
        const userRef: DocumentReference = doc(db, "users", getUid());
        const userInfo: DocumentSnapshot = await getDoc(userRef);

        if(gardenInfo.exists() && userInfo.exists()) {

            const flowerData: any[] = gardenInfo.data().flowers;
            const userData: DocumentData = userInfo.data();
            const rn = new Date();
            let coinUpdate: number = userData.coins;

            for(let i = 0; i < flowerData.length; i++) {
                
                if(flowerData[i].name) {

                    const img = document.getElementById("img");
                    if(img) { img.remove(); }

                    const flowerInfo: DocumentSnapshot = await getDoc(doc(db, "flower", (flowerData[i].name).toLowerCase()));

                    if(flowerInfo.exists()) {

                        if((flowerData[i].ready).toDate() <= rn) {
                            coinUpdate += flowerInfo.data().sellPrice;
                        }

                    }

                }

            }

            updateDoc(gardenRef, {flowers: [{name: null, ready: null}, {name: null, ready: null}, {name: null, ready: null}, {name: null, ready: null}, {name: null, ready: null}, {name: null, ready: null},]});
            updateDoc(userRef, {coins: coinUpdate});
            getCoins();

        }

    }

    /*
    async function getTimer() {
        
        if(notificationsAllowed) {

            const gardenInfo = await getDoc(doc(db, "gardens", getUid()));
            if(gardenInfo.exists()) {
                gardenInfo.data().flowers.forEach((element: any) => {
                    if(element.name) {

                        const rn = new Date();
                        // set notification
                        if(element.ready.toDate().getTime() > rn.getTime()) {

                            setTimeout(() => {
                                navigator.serviceWorker.ready.then((registration) => {
                                    
                                    try {
                                        
                                        registration.showNotification(
                                            "Gardemn",
                                            {
                                                lang: "it",
                                                body: `Hey! A new ${element.name} is blossomed!\nGo check your garden!`,    
                                                icon: "/icons/icon.png"
                                            }
                                        )

                                    } catch(err) {
                                        console.log(err);
                                    }
    
                                })}, (element.ready.toDate().getTime() - rn.getTime())
                            );
                            
                        }
                        
                    }

                });

            }
        }

    }
    */

    if(getLogged()) {

        getFlowers();
        getSeeds();
        // getTimer();
        getCoins();

        if (!("Notification" in window)) {
            alert("Questo browser non supporta le notifiche!");
        } else {
            Notification.requestPermission().then((permission) => {
                if (permission !== "granted") {
                    notificationsAllowed = false;
                }
            })
        }

    }


</script>

{#if getLogged()}
    <div class="flex flex-col justify-center items-center w-full h-[80vh]">
        <div id="garden" class="flex justify-around items-end w-[80vw] h-[50vh]"></div>
        <div id="seeds" class="flex justify-around items-center w-[40vw] h-[30vh]"></div>
    </div>
    <button class="btn preset-filled-primary-900-100 fixed bottom-0 left-0 mb-[2vw] ml-[2vw] w-[10vw] h-[10vh]" on:click={sellAll}>Sell All</button>
    <div class="card preset-filled-primary-900-100 fixed bottom-0 right-0 mb-[2vw] mr-[2vw] w-[10vw] h-[10vh]">
        <div id="coins" class="flex justify-center items-center w-full h-full"></div>
    </div>
{:else}
    <div class="flex flex-col justify-center items-center w-full h-[80vh]">
        <h1 class="h1">Log In to see your Gardemn!</h1>
        <h4 class="h4">Or Register to create yours</h4>
    </div>
{/if}