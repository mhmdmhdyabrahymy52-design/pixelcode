/* ============================================
   DASHBOARD.JS
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // دریافت داده‌ها
    // ============================================
    function getPayments() {
        var payments = localStorage.getItem('pixelcode_pending_payments');
        return payments ? JSON.parse(payments) : [];
    }

    function getFiles() {
        var files = localStorage.getItem('pixelcode_files');
        return files ? JSON.parse(files) : [];
    }

    function getUsers() {
        var users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    // ============================================
    // آمار
    // ============================================
    function updateStats() {
        var payments = getPayments();
        var pending = payments.filter(function(p) { return p.status === 'pending'; }).length;
        
        var files = getFiles();
        var totalDownloads = 0;
        for (var i = 0; i < files.length; i++) {
            totalDownloads += (files[i].downloads || 0);
        }

        var users = getUsers();

        document.getElementById('pendingPaymentsCount').textContent = pending;
        document.getElementById('totalFilesCount').textContent = files.length;
        document.getElementById('totalUsersCount').textContent = users.length;
        document.getElementById('totalDownloadsCount').textContent = totalDownloads;

        // آپدیت نشانگر روی کارت تایید پرداخت
        var badge = document.getElementById('pendingBadge');
        if (badge) {
            badge.textContent = pending;
            badge.style.display = pending > 0 ? 'flex' : 'none';
        }
    }

    // ============================================
    // پرداخت‌های اخیر
    // ============================================
    function renderRecentPayments() {
        var payments = getPayments();
        var tbody = document.getElementById('recentPaymentsBody');

        // مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
        payments.sort(function(a, b) {
            return new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time);
        });

        // فقط 5 مورد آخر
        var recent = payments.slice(0, 5);

        if (recent.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-row"><i class="ri-inbox-line"></i><span>هیچ پرداختی ثبت نشده است</span></td></tr>';
            return;
        }

        var html = '';
        for (var i = 0; i < recent.length; i++) {
            var p = recent[i];
            var statusClass = p.status === 'pending' ? 'pending' : (p.status === 'verified' ? 'verified' : 'rejected');
            var statusLabel = p.status === 'pending' ? 'در انتظار' : (p.status === 'verified' ? 'تایید شده' : 'رد شده');
            var amountLabel = p.amount ? p.amount.toLocaleString() + ' تومان' : 'نامشخص';

            html += '<tr>';
            html += '<td><strong>' + (p.fileName || 'نامشخص') + '</strong></td>';
            html += '<td>' + amountLabel + '</td>';
            html += '<td>' + (p.username || 'کاربر') + '</td>';
            html += '<td><code style="background:#0F172A;padding:0.1rem 0.4rem;border-radius:4px;font-size:0.7rem;direction:ltr;">' + p.code + '</code></td>';
            html += '<td><span class="status-badge ' + statusClass + '">' + statusLabel + '</span></td>';
            html += '</tr>';
        }

        tbody.innerHTML = html;
    }

    // ============================================
    // HEADER PROFILE
    // ============================================
    function updateHeader() {
        var userData = JSON.parse(localStorage.getItem('pixelcode_user'));
        if (!userData) userData = JSON.parse(localStorage.getItem('currentUser'));
        var isLoggedIn = localStorage.getItem('pixelcode_isLoggedIn') === 'true' || localStorage.getItem('isLoggedIn') === 'true';

        var avatar = document.getElementById('profileAvatar');
        var title = document.getElementById('profileTitle');
        var status = document.getElementById('profileStatus');

        if (avatar) avatar.src = userData?.avatar || '../images/avatar-default.svg';
        if (title) title.textContent = isLoggedIn ? (userData?.fullname || 'ادمین') : 'ادمین';
        if (status) {
            status.textContent = isLoggedIn ? 'مدیر' : 'مدیر';
            status.style.color = '#3B82F6';
        }
    }

    // ============================================
    // TOAST
    // ============================================
    function showToast(message, type) {
        type = type || 'success';
        var container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        var icons = { success: '✅', error: '❌', warning: '⚠️' };
        var toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.innerHTML = '<span class="toast-icon">' + (icons[type] || '📢') + '</span><span class="toast-message">' + message + '</span><button class="toast-close" onclick="this.parentElement.remove()">✕</button>';
        container.appendChild(toast);
        setTimeout(function() {
            if (toast.parentElement) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(50px)';
                setTimeout(function() { if (toast.parentElement) toast.remove(); }, 300);
            }
        }, 8000);
    }

    // ============================================
    // INIT
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        updateHeader();
        updateStats();
        renderRecentPayments();

        // آپدیت خودکار هر 10 ثانیه
        setInterval(function() {
            updateStats();
            renderRecentPayments();
        }, 10000);
    });

})();