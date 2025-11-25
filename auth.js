// public/js/modules/auth.js

import { auth } from "../firebase.js";
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Google Provider
const googleProvider = new GoogleAuthProvider();

// --- 1. REGISTER DENGAN EMAIL ---
export async function registerEmail(email, password, nama) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update nama pengguna
        await updateProfile(userCredential.user, {
            displayName: nama
        });
        
        console.log("✅ Registrasi berhasil:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("❌ Error registrasi:", error);
        
        // Terjemahkan error ke Bahasa Indonesia
        switch (error.code) {
            case 'auth/email-already-in-use':
                throw new Error('Email sudah terdaftar. Silakan gunakan email lain.');
            case 'auth/invalid-email':
                throw new Error('Format email tidak valid.');
            case 'auth/weak-password':
                throw new Error('Password terlalu lemah. Gunakan minimal 6 karakter.');
            default:
                throw error;
        }
    }
}

// --- 2. LOGIN DENGAN EMAIL ---
export async function loginEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ Login berhasil:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("❌ Error login:", error);
        
        switch (error.code) {
            case 'auth/user-not-found':
                throw new Error('Email tidak terdaftar.');
            case 'auth/wrong-password':
                throw new Error('Password salah.');
            case 'auth/invalid-email':
                throw new Error('Format email tidak valid.');
            case 'auth/invalid-credential':
                throw new Error('Email atau password salah.');
            case 'auth/too-many-requests':
                throw new Error('Terlalu banyak percobaan. Coba lagi nanti.');
            default:
                throw error;
        }
    }
}

// --- 3. LOGIN DENGAN GOOGLE ---
export async function loginGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log("✅ Login Google berhasil:", result.user);
        return result.user;
    } catch (error) {
        console.error("❌ Error login Google:", error);
        
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                throw new Error('Popup login ditutup. Silakan coba lagi.');
            case 'auth/popup-blocked':
                throw new Error('Popup diblokir browser. Izinkan popup untuk situs ini.');
            default:
                throw error;
        }
    }
}

// --- 4. LOGOUT ---
export async function logout() {
    try {
        await signOut(auth);
        console.log("✅ Logout berhasil");
        return true;
    } catch (error) {
        console.error("❌ Error logout:", error);
        throw error;
    }
}

// --- 5. CEK STATUS LOGIN ---
export function cekStatusLogin(callback) {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("👤 User logged in:", user.email);
        } else {
            console.log("👤 User not logged in");
        }
        callback(user);
    });
}

// --- 6. GET CURRENT USER ---
export function getCurrentUser() {
    return auth.currentUser;
}

// --- 7. GET USER ID ---
export function getUserId() {
    const user = auth.currentUser;
    return user ? user.uid : null;
}