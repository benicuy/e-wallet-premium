// State Aplikasi
let currentUser = null;
let isKYCVerified = false;
let balance = 0;

// Data User Demo (simulasi akun yang dibuat admin)
const demoUsers = {
    'dzalstore': {
        password: '123456',
        name: 'Dzal Store Admin',
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

// Database Transaksi (untuk simulasi)
let transactions = [
    {
        id: 'TRX001',
        from: 'user2',
        to: 'user3',
        amount: 50000,
        type: 'transfer',
        status: 'completed',
        date: '2026-02-18 10:30',
        notes: 'Pembayaran utang'
    },
    {
        id: 'TRX002',
        from: 'dzalstore',
        to: 'user2',
        amount: 100000,
        type: 'topup',
        status: 'completed',
        date: '2026-02-17 14:20'
    }
];

// Database Permintaan (pending requests)
let pendingKYC = [];
let pendingTopUp = [];
let pendingTransfers = [];

// DOM Elements
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const balanceAmount = document.getElementById('balanceAmount');
const kycStatus = document.getElementById('kycStatus');
const kycStatusText = document.getElementById('kycStatusText');
const dynamicContent = document.getElementById('dynamicContent');
const notificationArea = document.getElementById('notificationArea');

// Menu Items
const kycMenu = document.getElementById('kycMenu');
const topupMenu = document.getElementById('topupMenu');
const transferMenu = document.getElementById('transferMenu');
const historyMenu = document.getElementById('historyMenu');
const profileMenu = document.getElementById('profileMenu');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
kycMenu.addEventListener('click', showKYCForm);
topupMenu.addEventListener('click', showTopUpForm);
transferMenu.addEventListener('click', showTransferForm);
historyMenu.addEventListener('click', showHistory);
profileMenu.addEventListener('click', showProfile);

// Fungsi Login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        showNotification('Username dan password harus diisi!', 'warning');
        return;
    }
    
    if (demoUsers.hasOwnProperty(username)) {
        const user = demoUsers[username];
        
        if (user.password === password) {
            currentUser = username;
            isKYCVerified = user.kycStatus;
            balance = user.balance;
            
            updateDashboard();
            showNotification(`Selamat datang ${user.name}`, 'success');
            
            loginPage.classList.remove('active');
            dashboardPage.classList.add('active');
            
            document.getElementById('loginForm').reset();
            
            if (user.role === 'admin') {
                checkPendingRequests();
            }
        } else {
            showNotification('Password salah! Silakan coba lagi.', 'warning');
        }
    } else {
        showNotification(`Username "${username}" tidak ditemukan! Akun hanya bisa dibuat oleh admin.`, 'warning');
    }
}

// Fungsi Logout
function handleLogout() {
    currentUser = null;
    dashboardPage.classList.remove('active');
    loginPage.classList.add('active');
    dynamicContent.innerHTML = '';
    notificationArea.innerHTML = '';
}

// Update Dashboard
function updateDashboard() {
    balanceAmount.textContent = `Rp ${balance.toLocaleString('id-ID')}`;
    
    if (demoUsers[currentUser].role === 'admin') {
        kycStatus.className = 'kyc-status success';
        kycStatusText.textContent = '👑 Admin Dzal Store';
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

// Tampilkan Notifikasi
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        ${message}
        <span class="close-btn" onclick="this.parentElement.remove()">✕</span>
    `;
    notificationArea.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Cek Pending Requests untuk Admin
function checkPendingRequests() {
    const pendingCount = pendingKYC.length + pendingTopUp.length + pendingTransfers.length;
    if (pendingCount > 0) {
        showNotification(`Ada ${pendingCount} permintaan yang perlu diverifikasi`, 'warning');
    }
}

// Tampilkan Form KYC
function showKYCForm() {
    const user = demoUsers[currentUser];
    
    if (user.role === 'admin') {
        showAdminPanel();
        return;
    }
    
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
    
    const uploadArea = document.getElementById('uploadArea');
    const ktpFile = document.getElementById('ktpFile');
    
    uploadArea.addEventListener('click', () => ktpFile.click());
    ktpFile.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            uploadArea.querySelector('.upload-label').innerHTML = `📎 File dipilih: ${e.target.files[0].name}`;
        }
    });
    
    document.getElementById('kycForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const kycData = {
            username: currentUser,
            name: document.getElementById('fullName').value,
            nik: document.getElementById('nik').value,
            address: document.getElementById('address').value,
            birthDate: document.getElementById('birthDate').value,
            status: 'pending',
            submittedAt: new Date().toLocaleString()
        };
        
        pendingKYC.push(kycData);
        
        showNotification('Dokumen KYC berhasil dikirim! Menunggu verifikasi admin.', 'success');
        dynamicContent.innerHTML = '';
    });
}

// Tampilkan Form Top Up
function showTopUpForm() {
    const user = demoUsers[currentUser];
    
    if (user.role === 'admin') {
        showNotification('Admin tidak perlu melakukan top up', 'info');
        return;
    }
    
    if (!isKYCVerified) {
        showNotification('Anda harus menyelesaikan verifikasi KYC terlebih dahulu!', 'warning');
        return;
    }
    
    dynamicContent.innerHTML = `
        <div class="content-card">
            <h3>Top Up Saldo</h3>
            
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
                    <button type="button" class="btn-secondary" onclick="document.getElementById('dynamicContent').innerHTML=''">Batal</button>
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
    
    const uploadArea = document.getElementById('proofUploadArea');
    const proofFile = document.getElementById('proofFile');
    
    uploadArea.addEventListener('click', () => proofFile.click());
    proofFile.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            uploadArea.querySelector('.upload-label').innerHTML = `📎 File: ${e.target.files[0].name}`;
        }
    });
    
    document.getElementById('topupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const amount = parseInt(document.getElementById('amount').value);
        const notes = document.getElementById('notes').value;
        
        const topupRequest = {
            id: 'TOP' + Date.now(),
            username: currentUser,
            amount: amount,
            notes: notes,
            status: 'pending',
            submittedAt: new Date().toLocaleString(),
            proofFile: proofFile.files[0]?.name || 'No file'
        };
        
        pendingTopUp.push(topupRequest);
        
        showNotification(`Permintaan top up Rp ${amount.toLocaleString('id-ID')} berhasil dikirim! Menunggu verifikasi admin.`, 'success');
        dynamicContent.innerHTML = '';
    });
}

// Tampilkan Form Transfer
function showTransferForm() {
    const user = demoUsers[currentUser];
    
    if (user.role === 'admin') {
        showAdminPanel();
        return;
    }
    
    if (!isKYCVerified) {
        showNotification('Anda harus menyelesaikan verifikasi KYC terlebih dahulu!', 'warning');
        return;
    }
    
    const otherUsers = Object.entries(demoUsers)
        .filter(([username, u]) => username !== currentUser && u.role === 'user')
        .map(([username, u]) => `<option value="${username}">${u.name} (${username})</option>`)
        .join('');
    
    dynamicContent.innerHTML = `
        <div class="content-card">
            <h3>Transfer Saldo</h3>
            
            <div class="balance-card" style="background: #4a5568; padding: 15px; margin-bottom: 20px;">
                <p class="balance-label">Saldo Tersedia</p>
                <p class="balance-amount" style="font-size: 24px;">Rp ${balance.toLocaleString('id-ID')}</p>
            </div>
            
            <form id="transferForm">
                <div class="form-group">
                    <label>Tujuan Transfer</label>
                    <select id="recipient" required>
                        <option value="">Pilih penerima</option>
                        ${otherUsers}
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Jumlah Transfer</label>
                    <input type="number" id="transferAmount" min="1000" step="1000" placeholder="Minimal Rp 1.000" required>
                </div>
                
                <div class="form-group">
                    <label>Catatan (opsional)</label>
                    <textarea id="transferNotes" placeholder="Contoh: Pembayaran, hadiah, dll"></textarea>
                </div>
                
                <div class="upload-area" id="transferUploadArea">
                    <input type="file" id="transferProof" accept="image/*" required>
                    <div class="upload-label">
                        📎 <span>Klik untuk upload bukti transfer</span>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Kirim Permintaan Transfer</button>
                    <button type="button" class="btn-secondary" onclick="document.getElementById('dynamicContent').innerHTML=''">Batal</button>
                </div>
            </form>
            
            <div style="margin-top: 15px; font-size: 12px; color: #666; background: #f0f0f0; padding: 10px; border-radius: 8px;">
                <p>📌 Catatan Penting:</p>
                <ul style="margin-left: 20px;">
                    <li>Transfer akan diproses setelah diverifikasi admin</li>
                    <li>Pastikan saldo mencukupi sebelum transfer</li>
                    <li>Bukti transfer akan dicek oleh admin</li>
                    <li>Dana akan dipotong dari saldo Anda setelah diverifikasi</li>
                </ul>
            </div>
        </div>
    `;
    
    const uploadArea = document.getElementById('transferUploadArea');
    const proofFile = document.getElementById('transferProof');
    
    uploadArea.addEventListener('click', () => proofFile.click());
    proofFile.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            uploadArea.querySelector('.upload-label').innerHTML = `📎 File: ${e.target.files[0].name}`;
        }
    });
    
    document.getElementById('transferForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const recipient = document.getElementById('recipient').value;
        const amount = parseInt(document.getElementById('transferAmount').value);
        const notes = document.getElementById('transferNotes').value;
        
        if (!recipient) {
            showNotification('Pilih tujuan transfer!', 'warning');
            return;
        }
        
        if (amount > balance) {
            showNotification('Saldo tidak mencukupi!', 'warning');
            return;
        }
        
        const transferRequest = {
            id: 'TRF' + Date.now(),
            from: currentUser,
            to: recipient,
            amount: amount,
            notes: notes,
            status: 'pending',
            submittedAt: new Date().toLocaleString(),
            proofFile: proofFile.files[0]?.name || 'No file'
        };
        
        pendingTransfers.push(transferRequest);
        
        balance -= amount;
        demoUsers[currentUser].balance = balance;
        updateDashboard();
        
        showNotification(`Permintaan transfer Rp ${amount.toLocaleString('id-ID')} ke ${recipient} berhasil dikirim! Menunggu verifikasi admin.`, 'success');
        dynamicContent.innerHTML = '';
    });
}

// ============================================
// FUNGSI VERIFIKASI DENGAN TOGGLE SWITCH
// ============================================

// Verifikasi KYC dengan Toggle
window.toggleVerifyKYC = function(username, element) {
    const isApproved = element.checked;
    const statusSpan = element.closest('td').querySelector('.toggle-status');
    
    // Cari index permintaan KYC
    const kycIndex = pendingKYC.findIndex(k => k.username === username);
    
    if (kycIndex === -1) {
        showNotification('Data KYC tidak ditemukan!', 'warning');
        element.checked = !isApproved; // Balikkan lagi
        return;
    }
    
    const kycData = pendingKYC[kycIndex];
    
    if (isApproved) {
        // Setujui KYC
        if (demoUsers[username]) {
            demoUsers[username].kycStatus = true;
            showNotification(`✅ KYC untuk ${username} (${kycData.name}) telah DISETUJUI`, 'success');
            
            transactions.push({
                id: 'KYC' + Date.now(),
                type: 'kyc',
                username: username,
                status: 'approved',
                date: new Date().toLocaleString()
            });
            
            if (statusSpan) {
                statusSpan.textContent = 'Disetujui';
                statusSpan.className = 'toggle-status approve';
            }
        } else {
            showNotification(`User ${username} tidak ditemukan!`, 'warning');
            element.checked = false;
            return;
        }
    } else {
        // Tolak KYC
        showNotification(`❌ KYC untuk ${username} (${kycData.name}) telah DITOLAK`, 'info');
        
        if (statusSpan) {
            statusSpan.textContent = 'Ditolak';
            statusSpan.className = 'toggle-status reject';
        }
    }
    
    // Hapus dari daftar pending setelah 2 detik (biar user lihat perubahannya)
    setTimeout(() => {
        pendingKYC.splice(kycIndex, 1);
        
        // Update dashboard jika user yang sedang login adalah yang bersangkutan
        if (currentUser === username) {
            isKYCVerified = demoUsers[username].kycStatus;
            updateDashboard();
        }
        
        // Refresh panel admin
        if (currentUser === 'dzalstore') {
            showAdminPanel();
        }
    }, 2000);
};

// Verifikasi Top Up dengan Toggle
window.toggleVerifyTopUp = function(topupId, element) {
    const isApproved = element.checked;
    const statusSpan = element.closest('td').querySelector('.toggle-status');
    
    const topupIndex = pendingTopUp.findIndex(t => t.id === topupId);
    if (topupIndex === -1) {
        showNotification('Data top up tidak ditemukan!', 'warning');
        element.checked = !isApproved;
        return;
    }
    
    const topup = pendingTopUp[topupIndex];
    
    if (isApproved) {
        // Top up disetujui
        if (demoUsers[topup.username]) {
            demoUsers[topup.username].balance += topup.amount;
            
            transactions.push({
                id: topup.id,
                to: topup.username,
                amount: topup.amount,
                type: 'topup',
                status: 'completed',
                date: new Date().toLocaleString(),
                notes: topup.notes
            });
            
            showNotification(`✅ Top up Rp ${topup.amount.toLocaleString('id-ID')} untuk ${topup.username} DISETUJUI`, 'success');
            
            if (statusSpan) {
                statusSpan.textContent = 'Disetujui';
                statusSpan.className = 'toggle-status approve';
            }
        } else {
            showNotification(`User ${topup.username} tidak ditemukan!`, 'warning');
            element.checked = false;
            return;
        }
    } else {
        // Top up ditolak
        showNotification(`❌ Top up untuk ${topup.username} DITOLAK`, 'info');
        
        if (statusSpan) {
            statusSpan.textContent = 'Ditolak';
            statusSpan.className = 'toggle-status reject';
        }
    }
    
    setTimeout(() => {
        pendingTopUp.splice(topupIndex, 1);
        
        if (currentUser === topup.username) {
            balance = demoUsers[currentUser].balance;
            updateDashboard();
        }
        
        if (currentUser === 'dzalstore') {
            showAdminPanel();
        }
    }, 2000);
};

// Verifikasi Transfer dengan Toggle
window.toggleVerifyTransfer = function(transferId, element) {
    const isApproved = element.checked;
    const statusSpan = element.closest('td').querySelector('.toggle-status');
    
    const transferIndex = pendingTransfers.findIndex(t => t.id === transferId);
    if (transferIndex === -1) {
        showNotification('Data transfer tidak ditemukan!', 'warning');
        element.checked = !isApproved;
        return;
    }
    
    const transfer = pendingTransfers[transferIndex];
    
    if (isApproved) {
        // Transfer disetujui
        const fromUser = demoUsers[transfer.from];
        const toUser = demoUsers[transfer.to];
        
        if (!fromUser || !toUser) {
            showNotification('User pengirim atau penerima tidak ditemukan!', 'warning');
            element.checked = false;
            return;
        }
        
        if (fromUser.balance < transfer.amount) {
            showNotification(`Saldo ${transfer.from} tidak mencukupi!`, 'warning');
            element.checked = false;
            return;
        }
        
        fromUser.balance -= transfer.amount;
        toUser.balance += transfer.amount;
        
        transactions.push({
            id: transfer.id,
            from: transfer.from,
            to: transfer.to,
            amount: transfer.amount,
            type: 'transfer',
            status: 'completed',
            date: new Date().toLocaleString(),
            notes: transfer.notes
        });
        
        showNotification(`✅ Transfer Rp ${transfer.amount.toLocaleString('id-ID')} dari ${transfer.from} ke ${transfer.to} DISETUJUI`, 'success');
        
        if (statusSpan) {
            statusSpan.textContent = 'Disetujui';
            statusSpan.className = 'toggle-status approve';
        }
        
        if (currentUser === transfer.from || currentUser === transfer.to) {
            balance = demoUsers[currentUser].balance;
            updateDashboard();
        }
    } else {
        // Transfer ditolak, kembalikan saldo
        const fromUser = demoUsers[transfer.from];
        if (fromUser) {
            fromUser.balance += transfer.amount;
            showNotification(`❌ Transfer ditolak, saldo dikembalikan ke ${transfer.from}`, 'info');
            
            if (statusSpan) {
                statusSpan.textContent = 'Ditolak';
                statusSpan.className = 'toggle-status reject';
            }
            
            if (currentUser === transfer.from) {
                balance = fromUser.balance;
                updateDashboard();
            }
        }
    }
    
    setTimeout(() => {
        pendingTransfers.splice(transferIndex, 1);
        
        if (currentUser === 'dzalstore') {
            showAdminPanel();
        }
    }, 2000);
};

// ============================================
// PANEL ADMIN LENGKAP DENGAN TOGGLE SWITCH
// ============================================

// Tampilkan Panel Admin
function showAdminPanel() {
    const totalUsers = Object.keys(demoUsers).length;
    const pendingKYCCount = pendingKYC.length;
    const pendingTopUpCount = pendingTopUp.length;
    const pendingTransferCount = pendingTransfers.length;
    
    dynamicContent.innerHTML = `
        <div class="content-card">
            <h3>👑 Admin Dzal Store</h3>
            
            <!-- Statistik -->
            <div class="admin-stats">
                <div class="stat-box blue">
                    <div class="stat-icon">👥</div>
                    <div class="stat-value">${totalUsers}</div>
                    <div class="stat-label">Total Users</div>
                </div>
                <div class="stat-box yellow">
                    <div class="stat-icon">📝</div>
                    <div class="stat-value">${pendingKYCCount}</div>
                    <div class="stat-label">Pending KYC</div>
                </div>
                <div class="stat-box red">
                    <div class="stat-icon">💰</div>
                    <div class="stat-value">${pendingTopUpCount}</div>
                    <div class="stat-label">Pending Top Up</div>
                </div>
                <div class="stat-box cyan">
                    <div class="stat-icon">↔️</div>
                    <div class="stat-value">${pendingTransferCount}</div>
                    <div class="stat-label">Pending Transfer</div>
                </div>
            </div>
            
            <!-- Form Buat Akun Baru -->
            <div class="create-user-form">
                <h4>➕ Buat Akun User Baru</h4>
                <form id="createUserForm">
                    <input type="text" id="newUsername" placeholder="Username" required>
                    <input type="password" id="newPassword" placeholder="Password" required>
                    <input type="text" id="newName" placeholder="Nama Lengkap" required>
                    <button type="submit" class="btn-primary" style="padding: 8px;">Buat Akun</button>
                </form>
            </div>
            
            <!-- Tab Navigation -->
            <div class="tab-nav">
                <button class="tab-btn active" onclick="showAdminTab('kyc')">📝 KYC (${pendingKYCCount})</button>
                <button class="tab-btn" onclick="showAdminTab('topup')">💰 Top Up (${pendingTopUpCount})</button>
                <button class="tab-btn" onclick="showAdminTab('transfer')">↔️ Transfer (${pendingTransferCount})</button>
                <button class="tab-btn" onclick="showAdminTab('users')">📋 Semua User</button>
                <button class="tab-btn" onclick="showAdminTab('history')">📊 Riwayat</button>
            </div>
            
            <!-- Konten Tab (default KYC) -->
            <div id="adminTabContent">
                ${generateKYCTab()}
            </div>
        </div>
    `;
    
    document.getElementById('createUserForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newUsername = document.getElementById('newUsername').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();
        const newName = document.getElementById('newName').value.trim();
        
        if (newUsername && newPassword && newName) {
            if (demoUsers.hasOwnProperty(newUsername)) {
                showNotification('Username sudah digunakan!', 'warning');
                return;
            }
            
            demoUsers[newUsername] = {
                password: newPassword,
                name: newName,
                kycStatus: false,
                balance: 0,
                role: 'user'
            };
            
            showNotification(`✅ Akun user "${newUsername}" berhasil dibuat!`, 'success');
            
            document.getElementById('newUsername').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('newName').value = '';
            
            showAdminPanel();
        } else {
            showNotification('Semua field harus diisi!', 'warning');
        }
    });
}

// Generate Tab KYC dengan Toggle Switch
function generateKYCTab() {
    if (pendingKYC.length === 0) {
        return '<p style="text-align: center; padding: 20px;">Tidak ada permintaan KYC</p>';
    }
    
    let html = `
        <h4>📝 Permintaan Verifikasi KYC (${pendingKYC.length})</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Nama</th>
                        <th>NIK</th>
                        <th>Alamat</th>
                        <th>Waktu</th>
                        <th>Verifikasi</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    pendingKYC.forEach(k => {
        html += `
            <tr>
                <td>${k.username}</td>
                <td>${k.name}</td>
                <td>${k.nik}</td>
                <td>${k.address.substring(0, 20)}...</td>
                <td>${k.submittedAt}</td>
                <td class="toggle-cell">
                    <label class="toggle-switch toggle-switch-sm">
                        <input type="checkbox" onchange="toggleVerifyKYC('${k.username}', this)">
                        <span class="toggle-slider"></span>
                    </label>
                </td>
                <td>
                    <span class="toggle-status">Pending</span>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    return html;
}

// Generate Tab Top Up dengan Toggle Switch
function generateTopUpTab() {
    if (pendingTopUp.length === 0) {
        return '<p style="text-align: center; padding: 20px;">Tidak ada permintaan top up</p>';
    }
    
    let html = `
        <h4>💰 Permintaan Top Up (${pendingTopUp.length})</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Jumlah</th>
                        <th>Catatan</th>
                        <th>Bukti</th>
                        <th>Waktu</th>
                        <th>Verifikasi</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    pendingTopUp.forEach(t => {
        html += `
            <tr>
                <td>${t.id}</td>
                <td>${t.username}</td>
                <td>Rp ${t.amount.toLocaleString('id-ID')}</td>
                <td>${t.notes || '-'}</td>
                <td>${t.proofFile}</td>
                <td>${t.submittedAt}</td>
                <td class="toggle-cell">
                    <label class="toggle-switch toggle-switch-sm">
                        <input type="checkbox" onchange="toggleVerifyTopUp('${t.id}', this)">
                        <span class="toggle-slider"></span>
                    </label>
                </td>
                <td>
                    <span class="toggle-status">Pending</span>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    return html;
}

// Generate Tab Transfer dengan Toggle Switch
function generateTransferTab() {
    if (pendingTransfers.length === 0) {
        return '<p style="text-align: center; padding: 20px;">Tidak ada permintaan transfer</p>';
    }
    
    let html = `
        <h4>↔️ Permintaan Transfer (${pendingTransfers.length})</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Dari</th>
                        <th>Ke</th>
                        <th>Jumlah</th>
                        <th>Catatan</th>
                        <th>Bukti</th>
                        <th>Waktu</th>
                        <th>Verifikasi</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    pendingTransfers.forEach(t => {
        html += `
            <tr>
                <td>${t.id}</td>
                <td>${t.from}</td>
                <td>${t.to}</td>
                <td>Rp ${t.amount.toLocaleString('id-ID')}</td>
                <td>${t.notes || '-'}</td>
                <td>${t.proofFile}</td>
                <td>${t.submittedAt}</td>
                <td class="toggle-cell">
                    <label class="toggle-switch toggle-switch-sm">
                        <input type="checkbox" onchange="toggleVerifyTransfer('${t.id}', this)">
                        <span class="toggle-slider"></span>
                    </label>
                </td>
                <td>
                    <span class="toggle-status">Pending</span>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    return html;
}

// Generate Tab Users
function generateUsersTab() {
    const userList = Object.entries(demoUsers)
        .filter(([username, user]) => user.role === 'user')
        .map(([username, user]) => `
            <tr>
                <td>${username}</td>
                <td>${user.name}</td>
                <td>Rp ${user.balance.toLocaleString('id-ID')}</td>
                <td>${user.kycStatus ? '<span class="badge success">Verified</span>' : '<span class="badge warning">Pending</span>'}</td>
                <td>
                    <button class="btn-small" onclick="showUserDetail('${username}')">Detail</button>
                    <button class="btn-small" onclick="addSaldoManual('${username}')">Tambah Saldo</button>
                </td>
            </tr>
        `).join('');
    
    return `
        <h4>📋 Daftar Semua User (${Object.values(demoUsers).filter(u => u.role === 'user').length})</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Nama</th>
                        <th>Saldo</th>
                        <th>KYC</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    ${userList || '<tr><td colspan="5" style="text-align: center;">Tidak ada user</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
}

// Generate Tab History
function generateHistoryTab() {
    const allTransactions = transactions.map(t => {
        if (t.type === 'topup') {
            return `
                <tr>
                    <td>${t.id}</td>
                    <td>💰 Top Up</td>
                    <td>-</td>
                    <td>${t.to}</td>
                    <td>Rp ${t.amount.toLocaleString('id-ID')}</td>
                    <td><span class="badge success">Selesai</span></td>
                    <td>${t.date}</td>
                </tr>
            `;
        } else if (t.type === 'transfer') {
            return `
                <tr>
                    <td>${t.id}</td>
                    <td>↔️ Transfer</td>
                    <td>${t.from}</td>
                    <td>${t.to}</td>
                    <td>Rp ${t.amount.toLocaleString('id-ID')}</td>
                    <td><span class="badge success">Selesai</span></td>
                    <td>${t.date}</td>
                </tr>
            `;
        } else if (t.type === 'kyc') {
            return `
                <tr>
                    <td>${t.id}</td>
                    <td>📝 Verifikasi KYC</td>
                    <td>${t.username}</td>
                    <td>-</td>
                    <td>-</td>
                    <td><span class="badge success">${t.status}</span></td>
                    <td>${t.date}</td>
                </tr>
            `;
        }
    }).join('');
    
    return `
        <h4>📊 Riwayat Semua Transaksi</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tipe</th>
                        <th>Dari</th>
                        <th>Ke</th>
                        <th>Jumlah</th>
                        <th>Status</th>
                        <th>Tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    ${allTransactions || '<tr><td colspan="7" style="text-align: center;">Belum ada transaksi</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
}

// Fungsi untuk tab admin
window.showAdminTab = function(tab) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const tabContent = document.getElementById('adminTabContent');
    
    switch(tab) {
        case 'kyc':
            tabContent.innerHTML = generateKYCTab();
            break;
        case 'topup':
            tabContent.innerHTML = generateTopUpTab();
            break;
        case 'transfer':
            tabContent.innerHTML = generateTransferTab();
            break;
        case 'users':
            tabContent.innerHTML = generateUsersTab();
            break;
        case 'history':
            tabContent.innerHTML = generateHistoryTab();
            break;
        default:
            tabContent.innerHTML = generateKYCTab();
    }
};

// Fungsi helper untuk admin
window.showUserDetail = function(username) {
    const user = demoUsers[username];
    showNotification(`📋 ${user.name} - Saldo: Rp ${user.balance.toLocaleString('id-ID')} - KYC: ${user.kycStatus ? 'Verified' : 'Pending'}`, 'info');
};

window.addSaldoManual = function(username) {
    const amount = prompt('Masukkan jumlah saldo yang ingin ditambahkan:', '100000');
    if (amount && !isNaN(amount) && parseInt(amount) > 0) {
        demoUsers[username].balance += parseInt(amount);
        showNotification(`✅ Saldo ${username} bertambah Rp ${parseInt(amount).toLocaleString('id-ID')}`, 'success');
        
        if (currentUser === username) {
            balance = demoUsers[currentUser].balance;
            updateDashboard();
        }
        
        showAdminTab('users');
    }
};

// Tampilkan Riwayat Transaksi (untuk user biasa)
function showHistory() {
    const user = demoUsers[currentUser];
    
    if (user.role === 'admin') {
        showAdminPanel();
        return;
    }
    
    const userTransactions = transactions.filter(t => 
        (t.from === currentUser || t.to === currentUser)
    );
    
    const userTransactionsList = userTransactions.map(t => {
        if (t.type === 'topup') {
            return `
                <tr>
                    <td>${t.id}</td>
                    <td>💰 Top Up</td>
                    <td>Rp ${t.amount.toLocaleString('id-ID')}</td>
                    <td><span class="badge success">Berhasil</span></td>
                    <td>${t.date}</td>
                </tr>
            `;
        } else {
            return `
                <tr>
                    <td>${t.id}</td>
                    <td>↔️ Transfer ${t.from === currentUser ? 'Keluar' : 'Masuk'}</td>
                    <td>Rp ${t.amount.toLocaleString('id-ID')}</td>
                    <td><span class="badge success">Berhasil</span></td>
                    <td>${t.date}</td>
                </tr>
            `;
        }
    }).join('');
    
    dynamicContent.innerHTML = `
        <div class="content-card">
            <h3>Riwayat Transaksi</h3>
            ${userTransactions.length > 0 ? `
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipe</th>
                                <th>Jumlah</th>
                                <th>Status</th>
                                <th>Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${userTransactionsList}
                        </tbody>
                    </table>
                </div>
            ` : '<p style="text-align: center; padding: 20px;">Belum ada transaksi</p>'}
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
    console.log('Akun admin: dzalstore / 123456');
    console.log('Akun demo: user1 / password123');
});
