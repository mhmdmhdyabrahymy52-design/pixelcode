/* ============================================
   ADMIN-PANEL.JS
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // دریافت پرداخت‌ها
    // ============================================
    function getPayments() {
        var payments = localStorage.getItem('pixelcode_pending_payments');
        return payments ? JSON.parse(payments) : [];
    }

    function savePayments(payments) {
        localStorage.setItem('pixelcode_pending_payments', JSON.stringify(payments));
    }

    // ============================================
    // رندر جدول
    // ============================================
    function renderTable() {
        var payments = getPayments();
        var tbody = document.getElementById('paymentsTableBody');
        var emptyState = document.getElementById('emptyState');

        if (payments.length === 0) {
            tbody.innerHTML = '';
            emptyState.style.display = 'block';
            document.querySelector('.payments-table-wrapper').style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        document.querySelector('.payments-table-wrapper').style.display = 'block';

        // مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
        payments.sort(function(a, b) {
            return new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time);
        });

        var html = '';
        for (var i = 0; i < payments.length; i++) {
            var p = payments[i];
            var statusClass = p.status === 'pending' ? 'pending' : (p.status === 'verified' ? 'verified' : 'rejected');
            var statusLabel = p.status === 'pending' ? 'در انتظار تایید' : (p.status === 'verified' ? 'تایید شده' : 'رد شده');
            var amountLabel = p.amount ? p.amount.toLocaleString() + ' تومان' : 'نامشخص';

            html += '<tr>';
            html += '<td>' + (i + 1) + '</td>';
            html += '<td><strong>' + (p.fileName || 'نامشخص') + '</strong></td>';
            html += '<td>' + amountLabel + '</td>';
            html += '<td><code style="background:#0F172A;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;direction:ltr;display:inline-block;">' + p.code + '</code></td>';
            html += '<td>' + (p.username || 'کاربر') + '</td>';
            html += '<td>' + (p.date || '') + ' - ' + (p.time || '') + '</td>';
            html += '<td><span class="status-badge ' + statusClass + '">' + statusLabel + '</span></td>';
            html += '<td>';

            if (p.status === 'pending') {
                html += '<div class="action-buttons">';
                html += '<button class="action-btn success" onclick="window.verifyPayment(\'' + p.code + '\')">';
                html += '<i class="ri-check-line"></i> تایید';
                html += '</button>';
                html += '<button class="action-btn danger" onclick="window.rejectPayment(\'' + p.code + '\')">';
                html += '<i class="ri-close-line"></i> رد';
                html += '</button>';
                html += '</div>';
            } else {
                html += '<button class="action-btn secondary" onclick="window.deletePayment(\'' + p.code + '\')">';
                html += '<i class="ri-delete-bin-6-line"></i> حذف';
                html += '</button>';
            }

            html += '</td>';
            html += '</tr>';
        }

        tbody.innerHTML = html;
        updateStats();
    }

    // ============================================
    // آمار
    // ============================================
    function updateStats() {
        var payments = getPayments();
        var pending = payments.filter(function(p) { return p.status === 'pending'; }).length;
        var verified = payments.filter(function(p) { return p.status === 'verified'; }).length;
        var rejected = payments.filter(function(p) { return p.status === 'rejected'; }).length;

        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('verifiedCount').textContent = verified;
        document.getElementById('rejectedCount').textContent = rejected;
        document.getElementById('totalPayments').textContent = payments.length;
    }

    // ============================================
    // تایید پرداخت
    // ============================================
    window.verifyPayment = function(code) {
        if (!confirm('آیا از تایید این پرداخت مطمئن هستید؟')) return;

        var payments = getPayments();
        var found = false;

        for (var i = 0; i < payments.length; i++) {
            if (payments[i].code === code && payments[i].status === 'pending') {
                payments[i].status = 'verified';
                found = true;
                break;
            }
        }

        if (!found) {
            showToast('کد پیگیری پیدا نشد یا قبلاً تایید شده است', 'error');
            return;
        }

        savePayments(payments);
        renderTable();
        showToast('✅ پرداخت با کد ' + code + ' تایید شد!', 'success');
    };

    // ============================================
    // رد پرداخت
    // ============================================
    window.rejectPayment = function(code) {
        if (!confirm('آیا از رد این پرداخت مطمئن هستید؟')) return;

        var payments = getPayments();
        var found = false;

        for (var i = 0; i < payments.length; i++) {
            if (payments[i].code === code && payments[i].status === 'pending') {
                payments[i].status = 'rejected';
                found = true;
                break;
            }
        }

        if (!found) {
            showToast('کد پیگیری پیدا نشد یا قبلاً رد شده است', 'error');
            return;
        }

        savePayments(payments);
        renderTable();
        showToast('❌ پرداخت با کد ' + code + ' رد شد!', 'error');
    };

    // ============================================
    // حذف پرداخت
    // ============================================
    window.deletePayment = function(code) {
        if (!confirm('آیا از حذف این پرداخت مطمئن هستید؟')) return;

        var payments = getPayments();
        var newPayments = [];

        for (var i = 0; i < payments.length; i++) {
            if (payments[i].code !== code) {
                newPayments.push(payments[i]);
            }
        }

        savePayments(newPayments);
        renderTable();
        showToast('پرداخت حذف شد', 'success');
    };

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
    // INIT
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        updateHeader();
        renderTable();

        // آپدیت خودکار هر 10 ثانیه
        setInterval(function() {
            renderTable();
        }, 10000);
    });

    window.verifyPayment = verifyPayment;
    window.rejectPayment = rejectPayment;
    window.deletePayment = deletePayment;

})();