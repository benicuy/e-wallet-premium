// State Aplikasi
let currentUser = null;
let isKYCVerified = false;
let balance = 0;

// Data User Demo (simulasi akun yang dibuat admin)
const demoUsers = {
    'admin': {
        password: 'admin123',
        name: 'Admin Dzal',
        kycStatus: true,
        balance: 1000000,
        role: 'admin'
    },
    'user1': {
        password: 'password123',
        name: 'Budi Santoso',
        kycStatus: false,
        balance: 0,
        role: 'user'
    },
    'user2': {
        password: 'user456',
        name: 'Siti Aminah',
        kycStatus: true,
        balance: 250000,
        role: 'user'
    },
    'user3': {
        password: 'user789',
        name: 'Ahmad Hidayat',
        kycStatus: false,
        balance: 50000,
        role: 'user'
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

// Fungsi Login (DIPERBAIKI)
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Validasi input tidak kosong
    if (!username || !password) {
        alert('Username dan password harus diisi!');
        return;
    }
    
    // Cek apakah username ada di database demo
    if (demoUsers.hasOwnProperty(username)) {
        const user = demoUsers[username];
        
        // Verifikasi password
        if (user.password === password) {
            // Login berhasil
            currentUser = username;
            isKYCVerified = user.kycStatus;
            balance = user.balance;
            
            // Update UI
            updateDashboard();
            
            // Tampilkan pesan selamat datang
            if (user.role === 'admin') {
                alert(`Selamat datang Admin ${user.name}`);
            } else {
                alert(`Selamat datang ${user.name}`);
            }
            
            // Pindah ke dashboard
            loginPage.classList.remove('active');
            dashboardPage.classList.add('active');
            
            // Reset form login
            document.getElementById('loginForm').reset();
        } else {
            alert('Password salah! Silakan coba lagi.');
        }
    } else {
        alert(`Username "${username}" tidak ditemukan! Akun hanya bisa dibuat oleh admin.`);
    }
}

// Fungsi Logout
function handleLogout() {
    currentUser = null;
    dashboardPage.classList.remove('active');
    loginPage.classList.add('active');
    dynamicContent.innerHTML = ''; // Bersihkan konten dinamis
}

// Update Dashboard
function updateDashboard() {
    // Update saldo
    balanceAmount.textContent = `Rp ${balance.toLocaleString('id-ID')}`;
    
    // Update status KYC berdasarkan role
    if (demoUsers[currentUser].role === 'admin') {
        kycStatus.className = 'kyc-status success';
        kycStatusText.textContent = '👑 Admin Dashboard';
    } else {
        if (isKYCVerified) {
            kycStatus.className = 'kyc-status success';
            kycStatusText.textContent = '✓ KYC Terverifikasi';
        } else {
            kycStatus.className = 'kyc-status warning';
            kycStatusText.textContent = '⚠️ Menunggu Verifikasi KYC';
        }
    }
}

// Tampilkan Form KYC (DIPERBAIKI untuk admin)
function showKYCForm() {
    const user = demoUsers[currentUser];
    
    // Jika admin, tampilkan panel admin sederhana
    if (user.role === 'admin') {
        showAdminPanel();
        return;
    }
    
    // Untuk user biasa
    if (isKYCVerified) {
        dynamicContent.innerHTML = `
            <div class="content-card">
                <h3>Status KYC</h3>
                <div class="kyc-status success">
                    <p>✓ KYC Anda sudah terverifikasi</p>
                </div>
                <p><strong>Nama:</strong> ${user.name}</p>
                <p><strong>Username:</strong> ${currentUser}</p>
                <p><strong>Status:</strong> Terverifikasi</p>
                <p><strong>Saldo:</strong> Rp ${balance.toLocaleString('id-ID')}</p>
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
                    <input type="text" id="fullName" placeholder="Masukkan nama lengkap" value="${user.name}" required>
                </div>
                
                <div class="form-group">
                    <label>NIK</label>
                    <input type="text" id="nik" placeholder="16 digit NIK" maxlength="16" required>
                </div>
                
                <div class="form-group">
                    <label>Alamat</label>
                    <input type="text" id="address" placeholder="Alamat sesuai KTP" required>
                </div>
                
                <div class="form-group">
                    <label>Tanggal Lahir</label>
                    <input type="date" id="birthDate" required>
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
    });
}

// Panel Admin (FITUR BARU)
function showAdminPanel() {
    // Hitung statistik
    const totalUsers = Object.keys(demoUsers).length;
    const pendingKYC = Object.values(demoUsers).filter(user => !user.kycStatus && user.role === 'user').length;
    const totalBalance = Object.values(demoUsers).reduce((sum, user) => sum + user.balance, 0);
    
    // Daftar user untuk ditampilkan
    const userList = Object.entries(demoUsers)
        .filter(([username, user]) => user.role === 'user')
        .map(([username, user]) => `
            <tr>
                <td>${username}</td>
                <td>${user.name}</td>
                <td>Rp ${user.balance.toLocaleString('id-ID')}</td>
                <td>${user.kycStatus ? '✓ Verified' : '⏳ Pending'}</td>
                <td><button class="btn-small" onclick="alert('Fitur verifikasi KYC untuk ${username}')">Verifikasi</button></td>
            </tr>
        `).join('');
    
    dynamicContent.innerHTML = `
        <div class="content-card">
            <h3>👑 Panel Admin</h3>
            
            <!-- Statistik -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0;">
                <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px;">👥</div>
                    <div style="font-weight: bold;">${totalUsers}</div>
                    <div style="font-size: 12px;">Total Users</div>
                </div>
                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px;">⏳</div>
                    <div style="font-weight: bold;">${pendingKYC}</div>
                    <div style="font-size: 12px;">Pending KYC</div>
                </div>
                <div style="background: #d4edda; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px;">💰</div>
                    <div style="font-weight: bold;">Rp ${(totalBalance/1000000).toFixed(1)}Jt</div>
                    <div style="font-size: 12px;">Total Saldo</div>
                </div>
            </div>
            
            <!-- Form Buat Akun Baru -->
            <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4>➕ Buat Akun User Baru</h4>
                <form id="createUserForm" style="display: grid; gap: 10px; margin-top: 10px;">
                    <input type="text" id="newUsername" placeholder="Username" style="padding: 8px;">
                    <input type="password" id="newPassword" placeholder="Password" style="padding: 8px;">
                    <input type="text" id="newName" placeholder="Nama Lengkap" style="padding: 8px;">
                    <button type="submit" class="btn-primary" style="padding: 8px;">Buat Akun</button>
                </form>
            </div>
            
            <!-- Daftar User -->
            <h4>📋 Daftar User</h4>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background: #667eea; color: white;">
                            <th style="padding: 10px;">Username</th>
                            <th style="padding: 10px;">Nama</th>
                            <th style="padding: 10px;">Saldo</th>
                            <th style="padding: 10px;">KYC</th>
                            <th style="padding: 10px;">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${userList}
                    </tbody>
                </table>
            </div>
            
            <!-- Daftar Permintaan Top Up -->
            <h4 style="margin-top: 20px;">💰 Permintaan Top Up</h4>
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; text-align: center; color: #856404;">
                <p>Tidak ada permintaan top up yang pending</p>
                <p style="font-size: 12px;">(Fitur ini akan aktif ketika ada user yang melakukan top up)</p>
            </div>
        </div>
    `;
    
    // Handle form create user
    document.getElementById('createUserForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newUsername = document.getElementById('newUsername').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();
        const newName = document.getElementById('newName').value.trim();
        
        if (newUsername && newPassword && newName) {
            // Cek apakah username sudah ada
            if (demoUsers.hasOwnProperty(newUsername)) {
                alert('Username sudah digunakan!');
                return;
            }
            
            // Tambah user baru ke demoUsers
            demoUsers[newUsername] = {
                password: newPassword,
                name: newName,
                kycStatus: false,
                balance: 0,
                role: 'user'
            };
            
            alert(`Akun user "${newUsername}" berhasil dibuat!`);
            
            // Refresh panel admin
            showAdminPanel();
        } else {
            alert('Semua field harus diisi!');
        }
    });
}

// Tampilkan Form Top Up
function showTopUpForm() {
    const user = demoUsers[currentUser];
    
    // Cek role
    if (user.role === 'admin') {
        alert('Admin tidak perlu melakukan top up');
        return;
    }
    
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
                         alt="QRIS Dzal Store"
                         onerror="this.src='https://via.placeholder.com/200x200?text=QRIS+Dzal+Store'">
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
    const user = demoUsers[currentUser];
    
    if (user.role === 'admin') {
        dynamicContent.innerHTML = `
            <div class="content-card">
                <h3>📊 Laporan Transaksi</h3>
                <p style="text-align: center; color: #666; padding: 20px;">
                    Fitur laporan transaksi untuk admin akan segera hadir
                </p>
            </div>
        `;
        return;
    }
    
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
    const user = demoUsers[currentUser];
    
    dynamicContent.innerHTML = `
        <div class="content-card">
            <h3>Profil Pengguna</h3>
            <div style="margin-top: 15px;">
                <p><strong>Username:</strong> ${currentUser}</p>
                <p><strong>Nama:</strong> ${user.name}</p>
                <p><strong>Role:</strong> ${user.role === 'admin' ? 'Administrator' : 'Pengguna Biasa'}</p>
                <p><strong>Status KYC:</strong> ${isKYCVerified ? 'Terverifikasi' : 'Belum Verifikasi'}</p>
                <p><strong>Saldo:</strong> Rp ${balance.toLocaleString('id-ID')}</p>
            </div>
        </div>
    `;
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    console.log('Aplikasi Dzal E-Wallet siap!');
    console.log('Akun demo: admin / admin123');
});
