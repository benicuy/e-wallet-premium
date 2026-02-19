// State Aplikasi
let currentUser = null;
let isKYCVerified = false;
let balance = 0;

// Data User Demo (simulasi akun yang dibuat admin)
const demoUsers = {
    'user1': {
        password: 'password123',
        name: 'Budi Santoso',
        kycStatus: false,
        balance: 0
    },
    'admin': {
        password: 'admin123',
        name: 'AdminDzal',
        kycStatus: true,
        balance: 1000000
    }
};

// DOM Elements
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const balanceAmount = document.getElementById('balanceAmount');
const kycStatus = document.getElementById('kycStatus');
const kycStatusText = document.getElementById('kycStatusText');
const dynamicContent = document.getElementById('dynamicContent');

// Menu Items
const kycMenu = document.getElementById('kycMenu');
const topupMenu = document.getElementById('topupMenu');
const historyMenu = document.getElementById('historyMenu');
const profileMenu = document.getElementById('profileMenu');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
kycMenu.addEventListener('click', showKYCForm);
topupMenu.addEventListener('click', showTopUpForm);
historyMenu.addEventListener('click', showHistory);
profileMenu.addEventListener('click', showProfile);

// Fungsi Login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simulasi verifikasi login
    if (demoUsers[username] && demoUsers[username].password === password) {
        currentUser = username;
        isKYCVerified = demoUsers[username].kycStatus;
        balance = demoUsers[username].balance;
        
        // Update UI
        updateDashboard();
        
        // Pindah ke dashboard
        loginPage.classList.remove('active');
        dashboardPage.classList.add('active');
    } else {
        alert('Username atau password salah!');
    }
}

// Fungsi Logout
function handleLogout() {
    currentUser = null;
    dashboardPage.classList.remove('active');
    loginPage.classList.add('active');
    document.getElementById('loginForm').reset();
}

// Update Dashboard
function updateDashboard() {
    // Update saldo
    balanceAmount.textContent = `Rp ${balance.toLocaleString('id-ID')}`;
    
    // Update status KYC
    if (isKYCVerified) {
        kycStatus.className = 'kyc-status success';
        kycStatusText.textContent = '✓ KYC Terverifikasi';
    } else {
        kycStatus.className = 'kyc-status warning';
        kycStatusText.textContent = '⚠️ Menunggu Verifikasi KYC';
    }
}

// Tampilkan Form KYC
function showKYCForm() {
    if (isKYCVerified) {
        dynamicContent.innerHTML = `
            <div class="content-card">
                <h3>Status KYC</h3>
                <div class="kyc-status success">
                    <p>✓ KYC Anda sudah terverifikasi</p>
                </div>
                <p>Nama: ${demoUsers[currentUser].name}</p>
                <p>Status: Terverifikasi</p>
            </div>
        `;
        return;
    }
    
    dynamicContent.innerHTML = `
        <div class="content-card">
            <h3>Verifikasi KYC</h3>
            <p class="info-box">Upload dokumen identitas Anda untuk verifikasi</p>
            
            <form id="kycForm">
                <div class="form-group">
                    <label>Nama Lengkap (sesuai KTP)</label>
                    <input type="text" id="fullName" placeholder="Masukkan nama lengkap" required>
                </div>
                
                <div class="form-group">
                    <label>NIK</label>
                    <input type="text" id="nik" placeholder="16 digit NIK" maxlength="16" required>
                </div>
                
                <div class="form-group">
                    <label>Alamat</label>
                    <input type="text" id="address" placeholder="Alamat sesuai KTP" required>
                </div>
                
                <div class="upload-area" id="uploadArea">
                    <input type="file" id="ktpFile" accept="image/*" required>
                    <div class="upload-label">
                        📎 <span>Klik untuk upload foto KTP</span>
                    </div>
                </div>
                
                <button type="submit" class="btn-primary">Kirim Verifikasi KYC</button>
            </form>
        </div>
    `;
    
    // Event listener untuk upload area
    const uploadArea = document.getElementById('uploadArea');
    const ktpFile = document.getElementById('ktpFile');
    
    uploadArea.addEventListener('click', () => ktpFile.click());
    ktpFile.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            uploadArea.querySelector('.upload-label').innerHTML = `📎 File dipilih: ${e.target.files[0].name}`;
        }
    });
    
    // Handle form KYC
    document.getElementById('kycForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulasi pengiriman KYC
        alert('Dokumen KYC berhasil dikirim! Menunggu verifikasi admin.');
        
        // Reset form dan kembali ke dashboard
        dynamicContent.innerHTML = '';
        updateDashboard();
    });
}

// Tampilkan Form Top Up
function showTopUpForm() {
    if (!isKYCVerified) {
        alert('Anda harus menyelesaikan verifikasi KYC terlebih dahulu!');
        return;
    }
    
    dynamicContent.innerHTML = `
        <div class="content-card">
            <h3>Top Up Saldo</h3>
            
            <!-- QRIS Dzal Store -->
            <div class="qris-container">
                <div class="qris-image">
                    <img src="https://cdn.phototourl.com/uploads/2026-02-14-fa0f1899-4605-43bb-947b-27c76ee1a1e6.jpg" 
                         alt="QRIS Dzal Store">
                </div>
                
                <div class="qris-info">
                    <p><strong>Dzal Store</strong></p>
                    <p>QRIS Standar - Pembayaran Nasional</p>
                    <p style="font-size: 12px; margin-top: 5px;">Scan untuk melakukan pembayaran</p>
                </div>
            </div>
            
            <form id="topupForm">
                <div class="form-group">
                    <label>Jumlah Top Up</label>
                    <input type="number" id="amount" min="10000" step="10000" placeholder="Minimal Rp 10.000" required>
                </div>
                
                <div class="upload-area" id="proofUploadArea">
                    <input type="file" id="proofFile" accept="image/*" required>
                    <div class="upload-label">
                        📎 <span>Klik untuk upload bukti transfer</span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Catatan (opsional)</label>
                    <input type="text" id="notes" placeholder="Contoh: Top up dari BCA">
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Kirim Bukti Pembayaran</button>
                    <button type="button" class="btn-secondary" onclick="dynamicContent.innerHTML=''">Batal</button>
                </div>
            </form>
            
            <div style="margin-top: 15px; font-size: 12px; color: #666;">
                <p>⚠️ Instruksi:</p>
                <ol style="margin-left: 20px;">
                    <li>Scan QRIS di atas menggunakan aplikasi pembayaran</li>
                    <li>Lakukan pembayaran sesuai jumlah top up</li>
                    <li>Screenshot bukti pembayaran</li>
                    <li>Upload bukti melalui form di atas</li>
                    <li>Admin akan memverifikasi dan menambahkan saldo</li>
                </ol>
            </div>
        </div>
    `;
    
    // Event listener untuk upload area
    const uploadArea = document.getElementById('proofUploadArea');
    const proofFile = document.getElementById('proofFile');
    
    uploadArea.addEventListener('click', () => proofFile.click());
    proofFile.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            uploadArea.querySelector('.upload-label').innerHTML = `📎 File: ${e.target.files[0].name}`;
        }
    });
    
    // Handle form top up
    document.getElementById('topupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const amount = document.getElementById('amount').value;
        
        // Simulasi pengiriman bukti
        alert(`Permintaan top up Rp ${parseInt(amount).toLocaleString('id-ID')} berhasil dikirim!\nMenunggu verifikasi admin.`);
        
        // Reset form dan kembali ke dashboard
        dynamicContent.innerHTML = '';
    });
}

// Tampilkan Riwayat Transaksi
function showHistory() {
    dynamicContent.innerHTML = `
        <div class="content-card">
            <h3>Riwayat Transaksi</h3>
            <p style="text-align: center; color: #666; padding: 20px;">
                Belum ada transaksi
            </p>
        </div>
    `;
}

// Tampilkan Profil
function showProfile() {
    dynamicContent.innerHTML = `
        <div class="content-card">
            <h3>Profil Pengguna</h3>
            <div style="margin-top: 15px;">
                <p><strong>Username:</strong> ${currentUser}</p>
                <p><strong>Nama:</strong> ${demoUsers[currentUser].name}</p>
                <p><strong>Status KYC:</strong> ${isKYCVerified ? 'Terverifikasi' : 'Belum Verifikasi'}</p>
                <p><strong>Saldo:</strong> Rp ${balance.toLocaleString('id-ID')}</p>
            </div>
        </div>
    `;
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    console.log('Aplikasi Dzal E-Wallet siap!');
});
