import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from './firebase'

export const register = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);

export const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

// Variables that know if user is logged
let logged: boolean = false;
export function getLogged(): boolean {
    return logged;
}
export function setLoggedTrue() {
    logged = true;
}
export function setLoggedFalse() {
    logged = false;
}

export function getUid(): string {
    if(auth.currentUser?.uid) {
        return auth.currentUser?.uid;
    } else {
        return "error";
    }
    
}