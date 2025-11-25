// public/js/app.js

import { tambahTugas, loadTugas, toggleStatusTugas, hapusTugas } from "./modules/tugas.js";
import { cekStatusLogin, logout, getCurrentUser } from "./modules/auth.js";

// --- VARIABEL GLOBAL ---
let CURRENT_USER_ID = null;
let currentUser = null;

// --- ELEMEN DOM ---
const formTugas = document.getElementById('form-tambah-tugas');
const daftarTugasContainer = document.getElementById('daftar-tugas');
const userNameElement = document.getElementById('user-name');
const btnLogout = document.getElementById('btn-logout');

// --- FUNGSI TAMPILAN (VIEW) - MODERN UI ---
function renderTugas(tugasList) {
    if (!daftarTugasContainer) return;

    daftarTugasContainer.innerHTML = '';

    if (tugasList.length === 0) {
        daftarTugasContainer.innerHTML = `
            <div class="empty-state">
                <h3>📭 Belum Ada Tugas</h3>
                <p>Anda tidak memiliki tugas saat ini. Tambahkan tugas baru di atas!</p>
            </div>
        `;
        return;
    }

    tugasList.forEach(tugas => {
        const div = document.createElement('div');
        div.className = 'task-card';
        if (tugas.status === 'Selesai') {
            div.style.opacity = '0.7';
            div.style.borderLeftColor = '#10b981';
        }
        div.dataset.tugasId = tugas.id;

        const dateString = tugas.dueDate.toDate().toLocaleDateString('id-ID', {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });

        const statusBadge = tugas.status === 'Selesai' 
            ? '<span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">✓ Selesai</span>'
            : '<span style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">⏳ Progress</span>';

        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                <div class="task-title" style="${tugas.status === 'Selesai' ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                    ${tugas.judul}
                </div>
                ${statusBadge}
            </div>
            <div class="task-description" style="${tugas.status === 'Selesai' ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                ${tugas.deskripsi}
            </div>
            <div class="task-date">
                📅 ${dateString}
            </div>
            <div class="task-actions">
                <button class="btn-edit toggle-btn" data-status="${tugas.status}">
                    ${tugas.status === 'Selesai' ? '↩️ Belum Selesai' : '✅ Selesaikan'}
                </button>
                <button class="btn-delete hapus-btn">
                    🗑️ Hapus
                </button>
            </div>
        `;
        daftarTugasContainer.appendChild(div);
    });
}

// --- FUNGSI UPDATE USER INFO ---
function updateUserInfo(user) {
    if (userNameElement && user) {
        const displayName = user.displayName || user.email.split('@')[0];
        userNameElement.textContent = `Halo, ${displayName}!`;
    }
}

// --- FUNGSI LOADING & NOTIFIKASI ---
function showLoading() {
    if (daftarTugasContainer) {
        daftarTugasContainer.innerHTML = '<div class="loading">⏳ Memuat tugas...</div>';
    }
}

function showSuccess(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white; padding: 15px 25px; border-radius: 10px;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        z-index: 1000; animation: slideIn 0.3s ease; font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showError(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white; padding: 15px 25px; border-radius: 10px;
        box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        z-index: 1000; animation: slideIn 0.3s ease; font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// --- FUNGSI UTAMA ---
async function handleLoadTugas() {
    if (!CURRENT_USER_ID) {
        console.log('⚠️ User belum login');
        return;
    }
    
    showLoading();
    try {
        console.log('🔄 Memuat tugas untuk user:', CURRENT_USER_ID);
        const tugasList = await loadTugas(CURRENT_USER_ID);
        console.log('✅ Tugas berhasil dimuat:', tugasList.length, 'tugas');
        renderTugas(tugasList);
    } catch (error) {
        console.error('❌ Error detail:', error);
        showError('❌ Gagal memuat tugas: ' + error.message);
        daftarTugasContainer.innerHTML = `
            <div class="empty-state">
                <h3>⚠️ Gagal Memuat</h3>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}

// --- EVENT LISTENERS ---

// 1. Tambah Tugas
if (formTugas) {
    formTugas.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!CURRENT_USER_ID) {
            showError('⚠️ Silakan login terlebih dahulu!');
            return;
        }
        
        const judul = document.getElementById('judul').value;
        const deskripsi = document.getElementById('deskripsi').value;
        const dueDate = document.getElementById('due-date').value;

        if (!judul || !deskripsi || !dueDate) {
            showError('⚠️ Semua field harus diisi!');
            return;
        }

        const submitBtn = formTugas.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '⏳ Menyimpan...';
        submitBtn.disabled = true;

        try {
            console.log('📝 Menambah tugas:', { judul, deskripsi, dueDate });
            await tambahTugas(CURRENT_USER_ID, judul, deskripsi, dueDate);
            formTugas.reset();
            showSuccess('✅ Tugas berhasil ditambahkan!');
            handleLoadTugas();
        } catch (error) {
            console.error('❌ Error tambah tugas:', error);
            showError('❌ Gagal menambahkan tugas: ' + error.message);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// 2. Aksi Tugas (Toggle Status & Hapus)
if (daftarTugasContainer) {
    daftarTugasContainer.addEventListener('click', async (e) => {
        const tugasItem = e.target.closest('.task-card');
        if (!tugasItem) return;

        const tugasId = tugasItem.dataset.tugasId;

        if (e.target.classList.contains('toggle-btn')) {
            const currentStatus = e.target.dataset.status;
            const newStatus = currentStatus === 'Selesai' ? 'Belum Selesai' : 'Selesai';
            
            e.target.disabled = true;
            const originalText = e.target.textContent;
            e.target.textContent = '⏳ Proses...';

            try {
                await toggleStatusTugas(tugasId, newStatus);
                showSuccess(newStatus === 'Selesai' ? '✅ Tugas diselesaikan!' : '↩️ Status diubah');
                handleLoadTugas();
            } catch (error) {
                showError('❌ Gagal mengubah status: ' + error.message);
                e.target.textContent = originalText;
                e.target.disabled = false;
            }
        } 
        else if (e.target.classList.contains('hapus-btn')) {
            if (confirm("🗑️ Hapus Tugas?\n\nApakah Anda yakin ingin menghapus tugas ini?")) {
                e.target.disabled = true;
                e.target.textContent = '⏳ Menghapus...';

                try {
                    await hapusTugas(tugasId);
                    showSuccess('🗑️ Tugas berhasil dihapus!');
                    tugasItem.style.transition = 'all 0.3s ease';
                    tugasItem.style.opacity = '0';
                    tugasItem.style.transform = 'scale(0.9)';
                    setTimeout(() => handleLoadTugas(), 300);
                } catch (error) {
                    showError('❌ Gagal menghapus: ' + error.message);
                    e.target.textContent = '🗑️ Hapus';
                    e.target.disabled = false;
                }
            }
        }
    });
}

// 3. Tombol Logout
if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
        if (confirm('👋 Logout?\n\nApakah Anda yakin ingin keluar?')) {
            try {
                await logout();
                window.location.href = 'login.html';
            } catch (error) {
                showError('❌ Gagal logout: ' + error.message);
            }
        }
    });
}

// --- INISIALISASI ---
document.addEventListener('DOMContentLoaded', () => {
    // Tambahkan animasi CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Cek status login
    cekStatusLogin((user) => {
        if (user) {
            // User sudah login
            CURRENT_USER_ID = user.uid;
            currentUser = user;
            console.log('✅ User logged in:', user.email, 'UID:', user.uid);
            
            updateUserInfo(user);
            handleLoadTugas();
        } else {
            // User belum login - redirect ke login page
            console.log('⚠️ User not logged in, redirecting...');
            window.location.href = 'login.html';
        }
    });
    
    console.log('✅ Aplikasi Mahasiswa berhasil diinisialisasi!');
});