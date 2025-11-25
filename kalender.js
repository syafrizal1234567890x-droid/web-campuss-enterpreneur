// public/js/modules/kalender.js

import { db } from "../firebase.js";
import { collection, addDoc, getDocs, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const eventsCollection = collection(db, "kalenderEvents");

// --- 1. MENAMBAH EVENT (CREATE) ---
/**
 * Menambahkan event baru ke kalender.
 * @param {string} judul - Judul acara/event.
 * @param {string} deskripsi - Deskripsi acara.
 * @param {string} start - Tanggal dan waktu mulai (ISO string).
 * @param {string} end - Tanggal dan waktu berakhir (ISO string).
 * @param {string} tipe - Tipe event (Kuliah, Ujian, Acara).
 */
export async function tambahEvent(judul, deskripsi, start, end, tipe) {
    try {
        const docRef = await addDoc(eventsCollection, {
            judul: judul,
            deskripsi: deskripsi,
            start: new Date(start), // Firestore Timestamp
            end: new Date(end),     // Firestore Timestamp
            tipe: tipe,
            createdAt: new Date()
        });
        console.log("Event berhasil ditambahkan dengan ID:", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error saat menambahkan event:", e);
        throw e;
    }
}

// --- 2. MEMUAT SEMUA EVENT (READ) ---
/**
 * Memuat semua event kalender dan mengembalikannya dalam format list.
 */
export async function loadEvents() {
    try {
        // Query: Urutkan berdasarkan tanggal mulai
        const q = query(eventsCollection, orderBy("start", "asc"));

        const querySnapshot = await getDocs(q);
        const eventsList = [];
        querySnapshot.forEach((doc) => {
            eventsList.push({
                id: doc.id,
                ...doc.data(),
                // Konversi Timestamp ke string format yang mudah digunakan
                start: doc.data().start.toDate().toISOString(), 
                end: doc.data().end.toDate().toISOString()
            });
        });
        return eventsList;
    } catch (e) {
        console.error("Error saat memuat event:", e);
        throw e;
    }
}

// Anda bisa menambahkan fungsi hapus/update event jika diperlukan