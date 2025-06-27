<script lang="ts">

    import Header from "$lib/components/Header.svelte";
    
    import { getLogged, getUid } from "$lib/firebase/auth";

    import { db } from "$lib/firebase/firebase";
    import { collection, doc, DocumentSnapshot, getDoc, getDocs, query, QuerySnapshot, updateDoc, where } from "firebase/firestore";

    let userToFind: string = '';
    let gardenViewMode: boolean = false;
    let iconSelected: string;
    let borderSelected: string;

    async function handleUserFinder(): Promise<void> {

        // remove all old istances
        while(document.getElementById("userFound")) {
            document.getElementById("userFound")?.remove();
        }
        
        // find new users
        const queryProfile: QuerySnapshot = await getDocs(query(collection(db, "users"), where("username", "==", userToFind)));
        queryProfile.forEach((doc) => {

            const userInfo = doc.data();

            const newDiv: HTMLDivElement = document.createElement("div");
            newDiv.id = "userFound";
            newDiv.setAttribute("class", "flex justify-around items-center w-[30vw]");

            const newImgDiv: HTMLDivElement = document.createElement("div");
            newImgDiv.setAttribute("class", "relative");
            newDiv.appendChild(newImgDiv);

            const newIcon: HTMLImageElement = document.createElement("img");
            newIcon.src = `images/iconsImages/${userInfo.activeIcon}.png`
            newIcon.setAttribute("class", "w-[5vw]");
            newImgDiv.appendChild(newIcon);

            if(userInfo.activeBorder != "null") {
                const newBorder: HTMLImageElement = document.createElement("img");
                newBorder.src = `images/bordersImages/${userInfo.activeBorder}.png`;
                newBorder.setAttribute("class", "absolute top-0 left-0");
                newImgDiv.appendChild(newBorder);
            }

            const newUsername: HTMLParagraphElement = document.createElement("p");
            newUsername.innerHTML = userToFind;
            newDiv.appendChild(newUsername);

            const newBtn: HTMLButtonElement = document.createElement("button");
            newBtn.setAttribute("class", "btn preset-filled");
            newBtn.setAttribute("id", "button");
            newBtn.dataset.id = userInfo.owner;
            newBtn.addEventListener("click", (event) => {
                if(!gardenViewMode) {
                    gardenViewMode = true;
                    const id: string | undefined = (event.currentTarget as HTMLButtonElement).dataset.id;
                    if(id) { getGarden(id, newDiv); }
                } else {
                    gardenViewMode = false;
                    while(document.getElementById("userFound")) {
                        document.getElementById("userFound")?.remove();
                    }
                    getIcons();
                    getBorders();
                    getFollower();
                }
            });
            newBtn.innerHTML = "Enter";
            newDiv.appendChild(newBtn);

            const newBtnFollow: HTMLButtonElement = document.createElement("button");
            newBtnFollow.setAttribute("class", "btn preset-filled");
            newBtnFollow.dataset.id = userInfo.owner;
            newBtnFollow.addEventListener("click", (event) => {
                const id: string | undefined = (event.currentTarget as HTMLButtonElement).dataset.id;
                if(id) { setFollower(id)};
            });
            newBtnFollow.innerHTML = "Follow";
            newDiv.appendChild(newBtnFollow);

            document.getElementById("find-user")?.appendChild(newDiv);

        });

    }

    async function getGarden(id: string, div: HTMLDivElement) {

        const btn: HTMLElement | null = document.getElementById("button");
        if(btn) { btn.innerHTML = "Exit"; }
        document.getElementById("all")?.appendChild(div);
        
        const gardenInfo = await getDoc(doc(db, "gardens", id));
        if(gardenInfo.exists()) {

            const gardenFlower: any[] = gardenInfo.data().flowers;
            const gardenSize: number = gardenFlower.length;
            for(let i: number = 0; i < gardenSize; i++) {

                const newDiv: HTMLDivElement = document.createElement("div");
                newDiv.setAttribute("class", `card flex flex-col justify-end items-center w-[20vw] h-full`);

                const newPlace: HTMLDivElement = document.createElement("div");
                newPlace.setAttribute("class", `card preset-filled-surface-100-900 flex justify-center items-center w-[10vw] h-[10vh]`);
                newPlace.dataset.id = i.toString();

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

    async function getIcons() {

        const mapName: Map<number, string> = new Map();
        mapName.set(0, "DaisyUserIcon");
        mapName.set(1, "SunflowerUserIcon");
        mapName.set(2, "TulipUserIcon");
        mapName.set(3, "RoseUserIcon");

        const profileInfo: DocumentSnapshot = await getDoc(doc(db, "users", getUid()));
        if(profileInfo.exists()) {

            const profileData = profileInfo.data();
            for(let i = 0; i < profileData.icons.length; i++) {

                if(profileData.icons[i]) {

                    const newDiv = document.createElement("div");
                    if(mapName.get(i) == iconSelected) {
                        newDiv.setAttribute("class", "flex card preset-filled-surface-100-900 justify-center items-center pt-[5px] pb-[5px] pl-[5px] pr-[5px]");
                    } else {
                        newDiv.setAttribute("class", "flex card justify-center items-center pt-[5px] pb-[5px] pl-[5px] pr-[5px]");
                    }
                    const id: string | undefined = mapName.get(i);
                    if(id != undefined) {
                        newDiv.setAttribute("id", id)
                    }
                    newDiv.dataset.id = mapName.get(i);
                    newDiv.addEventListener("click", (event) => {
                        const id: (string | undefined) = (event.currentTarget as HTMLButtonElement).dataset.id;
                        if(id) { toggleIcon(id); }
                    });

                    const newImg = document.createElement("img");
                    newImg.setAttribute("class", "w-[5vw]");
                    newImg.src = `images/iconsImages/${mapName.get(i)}.png`;
                    newDiv.append(newImg)

                    document.getElementById("icons")?.append(newDiv);

                }

            }

        }

        const newDDiv = document.createElement("div");
        if(iconSelected == "DefaultUserIcon") {
            newDDiv.setAttribute("class", "flex card preset-filled-surface-100-900 justify-center items-center pt-[5px] pb-[5px] pl-[5px] pr-[5px]");
        } else {
            newDDiv.setAttribute("class", "flex card justify-center items-center pt-[5px] pb-[5px] pl-[5px] pr-[5px]");
        }
        newDDiv.setAttribute("id", "DefaultUserIcon");
        newDDiv.dataset.id = "DefaultUserIcon";
        newDDiv.addEventListener("click", (event) => {
            const id: (string | undefined) = (event.currentTarget as HTMLButtonElement).dataset.id;
            if(id) { toggleIcon(id); }
        });

        const newDImg = document.createElement("img");
        newDImg.setAttribute("class", "w-[5vw]");
        newDImg.src = `images/iconsImages/DefaultUserIcon.png`;
        
        newDDiv.append(newDImg)

        document.getElementById("icons")?.append(newDDiv);

    }

    async function getBorders() {

        const mapName: Map<number, string> = new Map();
        mapName.set(0, "TriangleBorder");
        mapName.set(1, "BubbleBorder");
        mapName.set(2, "StarsUserIcon");

        const profileInfo: DocumentSnapshot = await getDoc(doc(db, "users", getUid()));
        if(profileInfo.exists()) {

            const profileData = profileInfo.data();
            for(let i = 0; i < profileData.borders.length; i++) {

                if(profileData.borders[i]) {

                    const newDiv = document.createElement("div");
                    if(mapName.get(i) == borderSelected) {
                        newDiv.setAttribute("class", "flex card preset-filled-surface-100-900 justify-center items-center pt-[5px] pb-[5px] pl-[5px] pr-[5px]");
                    } else {
                        newDiv.setAttribute("class", "flex card justify-center items-center pt-[5px] pb-[5px] pl-[5px] pr-[5px]");
                    }
                    const id: string | undefined = mapName.get(i);
                    if(id != undefined) {
                        newDiv.setAttribute("id", id);
                    }
                    newDiv.dataset.id = mapName.get(i);
                    newDiv.addEventListener("click", (event) => {
                        const id: (string | undefined) = (event.currentTarget as HTMLButtonElement).dataset.id;
                        if(id) { toggleBorder(id); }
                    });

                    const newImg = document.createElement("img");
                    newImg.setAttribute("class", "w-[5vw]");
                    newImg.src = `images/bordersImages/${mapName.get(i)}.png`;

                    newDiv.append(newImg);

                    document.getElementById("borders")?.append(newDiv);

                }

            }

        }
        
    }

    async function getUsedIcon() {
        
        const profileInfo = await getDoc(doc(db, "users", getUid()));
        if(profileInfo.exists()) {

            iconSelected = profileInfo.data().activeIcon;

        }

    }

    async function getUsedBorder() {
        
        const profileInfo = await getDoc(doc(db, "users", getUid()));
        if(profileInfo.exists()) {

            borderSelected = profileInfo.data().activeBorder;

        }

    }

    async function getFollower() {
        
        document.getElementById("following")?.remove();
        const newFollowing = document.createElement("div");
        newFollowing.id = "following";
        newFollowing.setAttribute("class", "flex flex-col justify-center");
        document.getElementById("followingDiv")?.append(newFollowing);

        const profileInfo: DocumentSnapshot = await getDoc(doc(db, "users", getUid()));
        if(profileInfo.exists()) {

            let profileData = profileInfo.data();
            for(let i = 0; i < profileData.follow.length; i++) {

                const userFound = await getDoc(doc(db, "users", profileData.follow[i]));
                if(userFound.exists()) {

                    const userFoundData = userFound.data();

                    const newDiv: HTMLDivElement = document.createElement("div");
                    newDiv.id = userFoundData.owner;
                    newDiv.setAttribute("class", "flex justify-around items-center w-[30vw]");

                    const newImgDiv: HTMLDivElement = document.createElement("div");
                    newImgDiv.setAttribute("class", "relative");
                    newDiv.appendChild(newImgDiv);

                    const newIcon: HTMLImageElement = document.createElement("img");
                    newIcon.src = `images/iconsImages/${userFoundData.activeIcon}.png`
                    newIcon.setAttribute("class", "w-[5vw]");
                    newImgDiv.appendChild(newIcon);

                    if(userFoundData.activeBorder != "null") {
                        const newBorder: HTMLImageElement = document.createElement("img");
                        newBorder.src = `images/bordersImages/${userFoundData.activeBorder}.png`;
                        newBorder.setAttribute("class", "absolute top-0 left-0");
                        newImgDiv.appendChild(newBorder);
                    }

                    const newUsername: HTMLParagraphElement = document.createElement("p");
                    newUsername.innerHTML = userFoundData.username;
                    newDiv.appendChild(newUsername);

                    const newBtn: HTMLButtonElement = document.createElement("button");
                    newBtn.setAttribute("class", "btn preset-filled");
                    newBtn.setAttribute("id", "button");
                    newBtn.dataset.id = userFoundData.owner;
                    newBtn.addEventListener("click", (event) => {
                        if(!gardenViewMode) {
                            gardenViewMode = true;
                            const id: string | undefined = (event.currentTarget as HTMLButtonElement).dataset.id;
                            newDiv.setAttribute("id", "userFound");
                            if(id) { getGarden(id, newDiv); }
                        } else {
                            gardenViewMode = false;
                            while(document.getElementById("userFound")) {
                                document.getElementById("userFound")?.remove();
                            }
                            getIcons();
                            getBorders();
                            getFollower();
                        }
                    });
                    newBtn.innerHTML = "Enter";
                    newDiv.appendChild(newBtn);

                    const newBtnUnfollow: HTMLButtonElement = document.createElement("button");
                    newBtnUnfollow.setAttribute("class", "btn preset-filled");
                    newBtnUnfollow.dataset.id = userFoundData.owner;
                    newBtnUnfollow.addEventListener("click", (event) => {
                        const id: string | undefined = (event.currentTarget as HTMLButtonElement).dataset.id;
                        if(id) { unsetFollower(id)};
                    });
                    newBtnUnfollow.innerHTML = "Unfollow";
                    newDiv.appendChild(newBtnUnfollow);

                    document.getElementById("following")?.appendChild(newDiv);

                }

            }

        }

    }

    async function setFollower(id: string) {

        const profileRef = doc(db, "users", getUid());
        const profileInfo = await getDoc(profileRef);
        if(profileInfo.exists()) {
        
            const followingArray = profileInfo.data().follow;
            followingArray.push(id);
            updateDoc(profileRef, {follow: followingArray});

        }

        getFollower();

    }

    async function unsetFollower(id: string) {
        
        const profileRef = doc(db, "users", getUid());
        const profileInfo = await getDoc(profileRef);
        if(profileInfo.exists()) {
        
            const followingArray = profileInfo.data().follow;
            updateDoc(profileRef, {follow: followingArray.filter((f: string) => f !== id)});

        }

        getFollower();

    }

    async function toggleIcon(id: string) {

        if(iconSelected != id) {

            document.getElementById(iconSelected)?.setAttribute("class", "flex card justify-center items-center pt-[5px] pb-[5px] pl-[5px] pr-[5px]");
            document.getElementById(id)?.setAttribute("class", "flex card preset-filled-surface-100-900 justify-center items-center pt-[5px] pb-[5px] pl-[5px] pr-[5px]")
            iconSelected = id;

            const profileRef = doc(db, "users", getUid());
            await updateDoc(profileRef, {activeIcon: id});

        }

    }

    async function toggleBorder(id: string) {

        const profileRef = doc(db, "users", getUid());
        if(borderSelected != id) {

            document.getElementById(borderSelected)?.setAttribute("class", "flex card justify-center items-center pt-[5px] pb-[5px] pl-[5px] pr-[5px]");
            document.getElementById(id)?.setAttribute("class", "flex card preset-filled-surface-100-900 justify-center items-center pt-[5px] pb-[5px] pl-[5px] pr-[5px]")
            borderSelected = id;

            await updateDoc(profileRef, {activeBorder: id});

        } else {

            document.getElementById(id)?.setAttribute("class", "flex card justify-center items-center pt-[5px] pb-[5px] pl-[5px] pr-[5px]");
            borderSelected = "null";

            await updateDoc(profileRef, {activeBorder: "null"});

        }

    }

    if(getLogged()) {
        getUsedIcon();
        getUsedBorder();
        getIcons();
        getBorders();
        getFollower();
    }

</script>

<Header />
{#if getLogged()}
    
    <div id="all" class="flex flex-col justify-center items-center w-full h-[80vh]">
        {#if !gardenViewMode}

            <div class="flex w-full">
                <div class="flex flex-col justify-center items-center w-full h-full">
                    <div class="flex flex-col h-[35vh]">
                        <h2 class="h2 text-center">Select</h2>
                        <br>
                        <div id="icons" class="flex justify-center"></div>
                        <br>
                        <div id="borders" class="flex justify-center"></div>
                    </div>
                    <div id="followingDiv" class="flex flex-col h-[35vh]">
                        <h2 class="h2 text-center">Following</h2>
                        <div id="following" class="flex flex-col justify-center"></div>
                    </div>
                </div>
                <div class="flex justify-center items-center w-full h-full">
                    <div id="find-user" class="flex flex-col items-center h-[70vh]">
                        <h2 class="h2">UserFinder</h2>
                        <br>
                        <form class="flex" on:submit|preventDefault={handleUserFinder}>
                            <input type="text" class="input w-[20vw] text-center" placeholder="Username" bind:value={userToFind} required />
                            <button class="btn preset-filled">Search</button>
                        </form>
                        <br>
                    </div>
                </div>
            </div>

        {:else}
            <div id="garden" class="flex justify-around items-end w-[80vw] h-[40vh]"></div>
            <br><br>
        {/if}
    </div>
{:else}
    <div class="flex flex-col justify-center items-center w-full h-[80vh]">
        <h1 class="h1">You shouldn't be here!</h1>
        <p>Log in to have acces to this page</p>
    </div>
{/if}