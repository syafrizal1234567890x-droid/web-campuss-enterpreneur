import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ======================
// Ambil jadwal dari Firestore
// ======================
async function loadJadwal() {
    const snapshot = await getDocs(collection(db, "jadwalKuliah"));

    let jadwal = [];
    snapshot.forEach(doc => {
        jadwal.push(doc.data());
    });

    cekNotifikasi(jadwal);
}


// ======================
// Fungsi cek notifikasi
// ======================
function cekNotifikasi(jadwal) {
    setInterval(() => {
        const now = new Date();
        const jamSekarang = now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0");

        jadwal.forEach(item => {
            // Jika jadwal 15 menit lagi, kirim notif
            const waktuReminder = kurangiMenit(item.waktuMulai, 15);

            if (jamSekarang === waktuReminder) {
                kirimNotifikasi(
                    "Pengingat Jadwal Kuliah",
                    `${item.mataKuliah} akan dimulai 15 menit lagi!`
                );
            }
        });

    }, 30000); // cek setiap 30 detik
}


// ======================
// Kurangi menit
// ======================
function kurangiMenit(waktu, menit) {
    let [jam, mnt] = waktu.split(":").map(Number);

    let total = jam * 60 + mnt;
    total -= menit;

    let j = Math.floor(total / 60);
    let m = total % 60;

    return `${String(j).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}


// ======================
// Kirim Notifikasi Browser
// ======================
function kirimNotifikasi(judul, pesan) {
    if (Notification.permission === "granted") {
        new Notification(judul, {
            body: pesan,
            icon: "https://cdn-icons-png.flaticon.com/512/906/906175.png"
        });
    }
}
<script type="module" src="js/notifikasi.js"></script>

// Mulai
loadJadwal();
