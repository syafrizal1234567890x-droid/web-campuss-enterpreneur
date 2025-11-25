import { db } from "./firebase-config.js";
import { 
    collection, addDoc, getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { 
    getStorage, ref, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const storage = getStorage();

// ===================
// UPLOAD MATERI
// ===================
document.getElementById("form-upload-materi").addEventListener("submit", async (e) => {
    e.preventDefault();

    const mataKuliah = document.getElementById("mataKuliah").value;
    const judul = document.getElementById("judul").value;
    const deskripsi = document.getElementById("deskripsi").value;
    const file = document.getElementById("file-materi").files[0];

    if (!file) {
        alert("File belum dipilih!");
        return;
    }

    const storageRef = ref(storage, "materi/" + file.name);
    await uploadBytes(storageRef, file);

    const fileURL = await getDownloadURL(storageRef);

    await addDoc(collection(db, "materiKuliah"), {
        mataKuliah,
        judul,
        deskripsi,
        fileURL,
        uploadedAt: new Date()
    });

    alert("Materi berhasil diupload!");
    loadMateri();
});


// ===================
// LOAD MATERI
// ===================
async function loadMateri() {
    const materiList = document.getElementById("materi-list");
    materiList.innerHTML = "Memuat...";

    const querySnapshot = await getDocs(collection(db, "materiKuliah"));
    materiList.innerHTML = "";

    querySnapshot.forEach(doc => {
        const data = doc.data();

        materiList.innerHTML += `
            <div class="materi-card">
                <h4>${data.judul}</h4>
                <p><b>Mata Kuliah:</b> ${data.mataKuliah}</p>
                <p>${data.deskripsi}</p>
                <a href="${data.fileURL}" target="_blank">📥 Download Materi</a>
            </div>
        `;
    });
}

loadMateri();
