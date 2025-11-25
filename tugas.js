// public/js/modules/tugas.js

import { db } from "../firebase.js";
import { 
    collection, 
    addDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tugasCollection = collection(db, "tugas");

// --- 1. MENAMBAH TUGAS (CREATE) ---
export async function tambahTugas(mahasiswaId, judul, deskripsi, dueDate) {
    try {
        const docRef = await addDoc(tugasCollection, {
            mahasiswaId: mahasiswaId,
            judul: judul,
            deskripsi: deskripsi,
            dueDate: new Date(dueDate), // Simpan sebagai Firestore Timestamp
            status: 'Belum Selesai',
            createdAt: new Date()
        });
        console.log("✅ Dokumen tugas berhasil ditambahkan dengan ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("❌ Error saat menambahkan dokumen: ", e);
        throw e;
    }
}

// --- 2. MEMUAT TUGAS (READ) ---
export async function loadTugas(mahasiswaId) {
    try {
        // Buat Query: Filter berdasarkan mahasiswaId dan urutkan berdasarkan dueDate
        const q = query(
            tugasCollection,
            where("mahasiswaId", "==", mahasiswaId),
            orderBy("dueDate", "asc")
        );

        const querySnapshot = await getDocs(q);
        const tugasList = [];
        querySnapshot.forEach((doc) => {
            tugasList.push({
                id: doc.id,
                ...doc.data()
            });
        });
        console.log(`✅ Berhasil memuat ${tugasList.length} tugas`);
        return tugasList;
    } catch (e) {
        console.error("❌ Error saat memuat tugas: ", e);
        throw e;
    }
}

// --- 3. MENGUBAH STATUS TUGAS (UPDATE) ---
export async function toggleStatusTugas(tugasId, statusBaru) {
    try {
        const tugasRef = doc(db, "tugas", tugasId);
        await updateDoc(tugasRef, {
            status: statusBaru // Contoh: 'Selesai' atau 'Belum Selesai'
        });
        console.log(`✅ Status tugas ${tugasId} berhasil diupdate menjadi ${statusBaru}`);
    } catch (e) {
        console.error("❌ Error saat mengupdate tugas: ", e);
        throw e;
    }
}

// --- 4. MENGHAPUS TUGAS (DELETE) ---
export async function hapusTugas(tugasId) {
    try {
        await deleteDoc(doc(db, "tugas", tugasId));
        console.log("✅ Tugas berhasil dihapus!");
    } catch (e) {
        console.error("❌ Error saat menghapus tugas: ", e);
        throw e;
    }
}