import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let dataJadwal = [];

// ==========================
// LOAD JADWAL DARI FIRESTORE
// ==========================
async function loadJadwal() {
    const list = document.getElementById("jadwal-list");
    list.innerHTML = "Memuat...";

    const snapshot = await getDocs(collection(db, "jadwalKuliah"));

    dataJadwal = [];

    snapshot.forEach(doc => {
        dataJadwal.push(doc.data());
    });

    tampilkanJadwal(dataJadwal);
}

// ==========================
// TAMPILKAN JADWAL
// ==========================
function tampilkanJadwal(data) {
    const list = document.getElementById("jadwal-list");
    list.innerHTML = "";

    if (data.length === 0) {
        list.innerHTML = "<p>Tidak ada data ditemukan</p>";
        return;
    }

    data.forEach(item => {
        list.innerHTML += `
            <div class="jadwal-card">
                <p class="hari">🗓 ${item.hari}</p>
                <p class="mata-kuliah">${item.mataKuliah}</p>
                <p>Dosen: ${item.dosen}</p>
                <p>Waktu: ${item.waktu}</p>
                <p>Ruangan: ${item.ruangan}</p>
            </div>
        `;
    });
}


// ==========================
// FITUR PENCARIAN
// ==========================
document.getElementById("search").addEventListener("input", function () {
    const keyword = this.value.toLowerCase();

    const hasilFilter = dataJadwal.filter(item =>
        item.mataKuliah.toLowerCase().includes(keyword)
    );

    tampilkanJadwal(hasilFilter);
});


loadJadwal();
