import { db } from "../firebase";
import { get, ref } from "firebase/database";

export async function firebaseRead(path) {   
    const snapshot = await get(ref(db, path));
    return snapshot.val();
}

export async function firebaseWrite(path, data) {
    await set(ref(db, path), data);
}

export async function firebaseDelete(path) {
    await remove(ref(db, path));
}

export async function firebaseUpdate(path, data) {
    await update(ref(db, path), data);
}


