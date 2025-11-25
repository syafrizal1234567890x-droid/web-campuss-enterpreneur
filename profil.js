import { auth, db } from "./firebase-config.js";
import {
    updateProfile,
    updatePassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    doc, getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
    getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";


// ===========================
// LOAD DATA USER
// ===========================
auth.onAuthStateChanged(async (user) => {
    if (!user) return window.location.href = "login.html";

    // Ambil data dari Firestore
    const docRef = doc(db, "users", user.uid);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
        const data = snap.data();

        document.getElementById("nama").value = data.nama;
        document.getElementById("email").value = data.email;
        document.getElementById("foto-profil").src = data.fotoURL;
    }
});


// ===========================
// SIMPAN PROFIL
// ===========================
document.getElementById("btn-simpan").addEventListener("click", async () => {
    const user = auth.currentUser;

    const nama = document.getElementById("nama").value;
    const password = document.getElementById("password").value;
    const fileFoto = document.getElementById("file-foto").files[0];

    let fotoURL = null;

    // === Upload Foto Baru Jika Ada ===
    if (fileFoto) {
        const storage = getStorage();
        const fotoRef = ref(storage, `fotoProfil/${user.uid}.jpg`);

        await uploadBytes(fotoRef, fileFoto);
        fotoURL = await getDownloadURL(fotoRef);

        await updateProfile(user, { photoURL: fotoURL });
    }

    // === Update Password Jika Diisi ===
    if (password.trim() !== "") {
        await updatePassword(user, password);
    }

    // === Update Firestore ===
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, {
        nama: nama,
        fotoURL: fotoURL ? fotoURL : user.photoURL
    });

    alert("Profil berhasil diperbarui!");
});


// ===========================
// LOGOUT
// ===========================
document.getElementById("btn-logout").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
});
