import { browserLocalPersistence, createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from './firebase'

export const register = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);

export const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

await setPersistence(auth, browserLocalPersistence);

export function getLogged(): boolean {
    return ((auth.currentUser) ? true : false);
}

export function getUid(): string {
    if(auth.currentUser?.uid) {
        return auth.currentUser?.uid;
    } else {
        return "error";
    }
    
}