/* ============================================
   CATEGORIES.JS
   ============================================ */

(function () {
    'use strict';

    var allFiles = [];
    var currentCategory = null;
    var pendingDownloadFile = null;

    var CATEGORIES = [{
            id: 'background',
            name: 'بک گراند',
            icon: '🎨',
            description: 'تصاویر و بک‌گراندهای حرفه‌ای'
        },
        {
            id: 'css',
            name: 'فایل CSS',
            icon: '🎨',
            description: 'استایل‌های آماده و حرفه‌ای'
        },
        {
            id: 'html',
            name: 'فایل HTML',
            icon: '💻',
            description: 'صفحات و قالب‌های HTML'
        },
        {
            id: 'javascript',
            name: 'فایل JavaScript',
            icon: '⚙️',
            description: 'اسکریپت‌های آماده'
        },
        {
            id: 'logo',
            name: 'لوگو',
            icon: '🖋️',
            description: 'لوگوهای آماده و لایه باز'
        },
        {
            id: 'icon',
            name: 'آیکون',
            icon: '🧩',
            description: 'مجموعه آیکون‌های حرفه‌ای'
        },
        {
            id: 'font',
            name: 'فونت',
            icon: '🔤',
            description: 'فونت‌های فارسی و انگلیسی'
        },
        {
            id: 'project',
            name: 'پروژه کامل',
            icon: '📦',
            description: 'پروژه‌های آماده وب'
        },
        {
            id: 'ui',
            name: 'UI Kit',
            icon: '🎛️',
            description: 'رابط‌های کاربری آماده'
        },
        {
            id: 'effect',
            name: 'افکت CSS',
            icon: '✨',
            description: 'انیمیشن و افکت‌های حرفه‌ای'
        },
        {
            id: 'responsive',
            name: 'قالب ریسپانسیو',
            icon: '📱',
            description: 'قالب‌های واکنش‌گرا'
        },
        {
            id: 'other',
            name: 'سایر فایل‌ها',
            icon: '📂',
            description: 'فایل‌های متفرقه'
        }
    ];

    var BANK_INFO = {
        cardNumber: '6037-9918-1234-5678',
        accountName: 'محمد مهدی ابراهیمی کهکی',
        bankName: 'بانک ملی',
        shaba: 'IR570170000000123456789001'
    };

    // ===== مدیریت کاربر =====
    function getCurrentUser() {
        var user = localStorage.getItem('pixelcode_user');
        if (user) {
            try {
                return JSON.parse(user);
            } catch (e) {}
        }
        user = localStorage.getItem('currentUser');
        if (user) {
            try {
                return JSON.parse(user);
            } catch (e) {}
        }
        var users = localStorage.getItem('users');
        if (users) {
            try {
                var allUsers = JSON.parse(users);
                if (allUsers && allUsers.length > 0) {
                    return allUsers[allUsers.length - 1];
                }
            } catch (e) {}
        }
        return null;
    }

    function isUserLoggedIn() {
        if (localStorage.getItem('pixelcode_isLoggedIn') === 'true') return true;
        if (localStorage.getItem('isLoggedIn') === 'true') return true;
        return getCurrentUser() !== null;
    }

    // ===== مدیریت لایک‌ها =====
    function getUserFavorites() {
        var user = getCurrentUser();
        if (!user) return [];
        var key = 'user_favorites_' + user.id;
        var favorites = localStorage.getItem(key);
        return favorites ? JSON.parse(favorites) : [];
    }

    function isUserFavorite(fileId) {
        var favorites = getUserFavorites();
        return favorites.includes(fileId);
    }

    function getFavoritesCount() {
        return getUserFavorites().length;
    }

    function updateFavoritesBadge() {
        var count = getFavoritesCount();
        var badge = document.getElementById('favoritesCount');
        if (badge) {
            badge.textContent = count;
            if (count > 0) {
                badge.classList.add('show');
            } else {
                badge.classList.remove('show');
            }
        }
    }

    // ===== مدیریت دانلودهای کاربر =====
    function getUserDownloadKey() {
        var userData = getCurrentUser();
        if (!userData) return null;
        return 'user_downloads_' + userData.id;
    }

    function getUserDownloads() {
        var key = getUserDownloadKey();
        if (!key) return [];
        var downloads = localStorage.getItem(key);
        return downloads ? JSON.parse(downloads) : [];
    }

    function saveUserDownload(fileId) {
        var key = getUserDownloadKey();
        if (!key) return;
        var downloads = getUserDownloads();
        if (!downloads.includes(fileId)) {
            downloads.push(fileId);
            localStorage.setItem(key, JSON.stringify(downloads));
        }
    }

    function hasUserDownloaded(fileId) {
        var downloads = getUserDownloads();
        return downloads.includes(fileId);
    }

    // ===== HEADER =====
    function updateHeader() {
        var userData = getCurrentUser();
        var isLoggedIn = isUserLoggedIn();

        var loginBtn = document.getElementById('loginBtn');
        var registerBtn = document.getElementById('registerBtn');
        var profileBox = document.getElementById('profileBox');
        var profileAvatar = document.getElementById('profileAvatar');
        var profileTitle = document.getElementById('profileTitle');
        var profileStatus = document.getElementById('profileStatus');

        if (isLoggedIn && userData) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (profileBox) profileBox.style.display = 'flex';
            if (profileAvatar) profileAvatar.src = userData.avatar || '../images/avatar-default.svg';
            if (profileTitle) profileTitle.textContent = userData.fullname || 'کاربر';
            if (profileStatus) {
                profileStatus.textContent = 'آنلاین';
                profileStatus.style.color = '#22C55E';
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-flex';
            if (registerBtn) registerBtn.style.display = 'inline-flex';
            if (profileBox) profileBox.style.display = 'flex';
            if (profileAvatar) profileAvatar.src = '../images/avatar-default.svg';
            if (profileTitle) profileTitle.textContent = 'پروفایل';
            if (profileStatus) {
                profileStatus.textContent = 'ثبت نام نکرده‌ای';
                profileStatus.style.color = '#94A3B8';
            }
        }
        updateFavoritesBadge();
    }

    // ===== STORAGE =====
    function loadFiles() {
        getAllFilesFromDB().then(function (data) {
            allFiles = data || [];
            updateStats();
            renderCategories();
        }).catch(function (e) {
            allFiles = [];
            updateStats();
            renderCategories();
        });
    }

    // ===== STATS =====
    function updateStats() {
        var published = allFiles.filter(function (f) {
            return f.status === 'فعال';
        });
        var total = published.length;
        var downloads = 0,
            free = 0,
            premium = 0;
        for (var i = 0; i < published.length; i++) {
            downloads += (published[i].downloads || 0);
            if (published[i].price === 0) free++;
            else premium++;
        }
        document.getElementById('totalFiles').textContent = total;
        document.getElementById('totalDownloads').textContent = downloads;
        document.getElementById('freeCount').textContent = free;
        document.getElementById('premiumCount').textContent = premium;

        CATEGORIES.forEach(function (cat) {
            var count = published.filter(function (f) {
                return f.category === cat.id;
            }).length;
            var badge = document.querySelector('.category-card[data-category="' + cat.id + '"] .card-count strong');
            if (badge) badge.textContent = count;
        });
    }

    // ===== RENDER CATEGORIES =====
    function renderCategories() {
        var grid = document.getElementById('categoriesGrid');
        if (!grid) return;
        grid.innerHTML = CATEGORIES.map(function (cat) {
            return '<a href="#" class="category-card" data-category="' + cat.id + '" onclick="window.openCategory(\'' + cat.id + '\')">' +
                '<span class="card-icon">' + cat.icon + '</span>' +
                '<h3>' + cat.name + '</h3>' +
                '<p>' + cat.description + '</p>' +
                '<span class="card-count"><strong>0</strong> فایل</span>' +
                '</a>';
        }).join('');
        updateStats();
    }

    // ===== OPEN CATEGORY =====
    window.openCategory = function (categoryId) {
        currentCategory = categoryId;
        var category = null;
        for (var i = 0; i < CATEGORIES.length; i++) {
            if (CATEGORIES[i].id === categoryId) {
                category = CATEGORIES[i];
                break;
            }
        }
        if (!category) return;

        var published = allFiles.filter(function (f) {
            return f.category === categoryId && f.status === 'فعال';
        });

        document.getElementById('categoriesGrid').style.display = 'none';
        var header = document.querySelector('.section-header');
        if (header) header.style.display = 'none';

        var section = document.getElementById('categoryFilesSection');
        section.style.display = 'block';
        document.getElementById('categoryFilesTitle').textContent = '📁 ' + category.name;
        document.getElementById('categoryFilesCount').textContent = published.length + ' فایل';

        var grid = document.getElementById('categoryFilesGrid');
        if (published.length === 0) {
            grid.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><h3>هیچ فایلی در این دسته وجود ندارد</h3><p>به زودی فایل‌های جدید اضافه می‌شوند</p></div>';
            return;
        }

        grid.innerHTML = published.map(function (file) {
            var isFree = file.price === 0;
            var priceClass = isFree ? 'free' : '';
            var priceLabel = isFree ? 'رایگان' : file.price.toLocaleString() + ' تومان';
            var icon = getFileIcon(file.category);
            var alreadyDownloaded = hasUserDownloaded(file.id);
            var downloadText = alreadyDownloaded ? 'دانلود مجدد' : 'دانلود';
            var isFav = isUserFavorite(file.id);

            return '<div class="file-item-card">' +
                '<span class="file-icon">' + icon + '</span>' +
                '<div class="file-info">' +
                '<h4>' + file.name + '</h4>' +
                '<div class="file-meta">' +
                '<span>📁 ' + getCategoryName(file.category) + '</span>' +
                '<span>📅 ' + (file.date || 'نامشخص') + '</span>' +
                '<span>📦 ' + (file.fileSize || 'نامشخص') + '</span>' +
                '</div>' +
                '</div>' +
                '<span class="file-price-tag ' + priceClass + '">' + priceLabel + '</span>' +
                '<button class="favorite-btn ' + (isFav ? 'active' : '') + '" onclick="window.toggleFavoriteFile(\'' + file.id + '\')" title="علاقه‌مندی">' +
                '<i class="ri-heart-' + (isFav ? 'fill' : 'line') + '"></i>' +
                '</button>' +
                '<button class="download-btn" onclick="window.downloadOrPay(\'' + file.id + '\')" title="دانلود">' +
                '<i class="ri-download-2-line"></i>' +
                '<span style="font-size:0.6rem;margin-right:0.2rem;">' + downloadText + '</span>' +
                '</button>' +
                '</div>';
        }).join('');
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    // ============================================
    // TOGGLE FAVORITE - لایک در categories
    // ============================================
    window.toggleFavoriteFile = function (id) {
        var user = getCurrentUser();
        if (!user) {
            showToast('لطفاً وارد حساب خود شوید', 'warning');
            setTimeout(function () {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }

        var key = 'user_favorites_' + user.id;
        var favorites = JSON.parse(localStorage.getItem(key)) || [];
        var index = favorites.indexOf(id);

        if (index !== -1) {
            favorites.splice(index, 1);
            showToast('💔 از علاقه‌مندی‌ها حذف شد', 'warning');
        } else {
            favorites.push(id);
            showToast('❤️ به علاقه‌مندی‌ها اضافه شد', 'success');
        }

        localStorage.setItem(key, JSON.stringify(favorites));

        // بروزرسانی نشانگر
        var count = favorites.length;
        var badge = document.getElementById('favoritesCount');
        if (badge) {
            badge.textContent = count;
            if (count > 0) {
                badge.classList.add('show');
            } else {
                badge.classList.remove('show');
            }
        }

        if (currentCategory) {
            window.openCategory(currentCategory);
        }
    };


    // ===== DOWNLOAD REAL FILE =====
    function downloadRealFile(file) {
        if (!isUserLoggedIn()) {
            showToast('لطفاً وارد حساب خود شوید', 'warning');
            setTimeout(function () {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }

        var alreadyDownloaded = hasUserDownloaded(file.id);

        if (!alreadyDownloaded) {
            saveUserDownload(file.id);
            file.downloads = (file.downloads || 0) + 1;
            saveFileToDB(file).then(function () {
                updateStats();
                if (currentCategory) window.openCategory(currentCategory);
            });
        }

        if (file.isBase64 && file.content) {
            var link = document.createElement('a');
            link.href = file.content;
            link.download = file.fileName || (file.name + '.' + file.fileType);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            if (!alreadyDownloaded) {
                showToast('✅ فایل "' + file.name + '" دانلود شد', 'success');
            } else {
                showToast('📥 فایل "' + file.name + '" دانلود مجدد شد', 'success');
            }
            return;
        }
        var content = file.content || 'محتوای فایل در دسترس نیست';
        var fileName = file.fileName || (file.name + '.' + (file.fileType || 'txt'));
        var blob = new Blob([content], {
            type: 'application/octet-stream'
        });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(function () {
            URL.revokeObjectURL(url);
        }, 1000);

        if (!alreadyDownloaded) {
            showToast('✅ فایل "' + file.name + '" دانلود شد', 'success');
        } else {
            showToast('📥 فایل "' + file.name + '" دانلود مجدد شد', 'success');
        }
    }

    // ===== DOWNLOAD OR PAY =====
    window.downloadOrPay = function (id) {
        getFileFromDB(id).then(function (file) {
            if (!file) {
                showToast('فایل یافت نشد', 'error');
                return;
            }

            if (!isUserLoggedIn()) {
                showToast('لطفاً وارد حساب خود شوید', 'warning');
                setTimeout(function () {
                    window.location.href = 'login.html';
                }, 1500);
                return;
            }

            if (hasUserDownloaded(file.id)) {
                downloadRealFile(file);
                return;
            }

            if (file.price === 0) {
                downloadRealFile(file);
                return;
            }

            pendingDownloadFile = file;
            openPaymentModal(file);
        });
    };

    // ===== PAYMENT =====
    function openPaymentModal(file) {
        var bank = BANK_INFO;

        document.getElementById('paymentFileIcon').textContent = getFileIcon(file.category);
        document.getElementById('paymentFileName').textContent = file.name;
        document.getElementById('paymentFilePrice').textContent = file.price.toLocaleString() + ' تومان';
        document.getElementById('paymentTotal').textContent = file.price.toLocaleString() + ' تومان';
        document.getElementById('paymentAmount').textContent = file.price.toLocaleString();

        document.getElementById('cardNumber').textContent = bank.cardNumber;
        document.getElementById('accountName').textContent = bank.accountName;
        document.getElementById('bankName').textContent = bank.bankName;
        document.getElementById('shaba').textContent = bank.shaba;

        document.getElementById('paymentModal').classList.add('active');
    }

    function closePaymentModal() {
        document.getElementById('paymentModal').classList.remove('active');
        pendingDownloadFile = null;
    }

    function confirmPayment() {
        if (!pendingDownloadFile) {
            showToast('خطا در پرداخت', 'error');
            return;
        }

        var trackingCode = prompt('کد پیگیری واریز رو وارد کنید:');
        if (trackingCode && trackingCode.trim().length > 0) {
            submitTrackingCode(trackingCode.trim(), pendingDownloadFile);
        } else {
            showToast('لطفاً کد پیگیری رو وارد کنید', 'error');
        }
    }

    function submitTrackingCode(code, file) {
        var pending = getPendingPayments();
        var exists = pending.some(function (p) {
            return p.code === code;
        });
        if (exists) {
            showToast('❌ این کد پیگیری قبلاً ثبت شده است', 'error');
            return;
        }

        var userData = getCurrentUser();
        var username = userData ? userData.fullname : 'کاربر ناشناس';

        var paymentData = {
            code: code,
            fileId: file.id,
            fileName: file.name,
            amount: file.price,
            username: username,
            status: 'pending',
            date: new Date().toLocaleDateString('fa-IR'),
            time: new Date().toLocaleTimeString('fa-IR')
        };

        savePendingPayment(paymentData);

        showToast('✅ کد پیگیری ثبت شد! منتظر تایید مدیر باشید', 'success');
        pendingDownloadFile = null;

        setTimeout(function () {
            showToast('📋 به پنل مدیریت بروید و پرداخت را تایید کنید', 'warning');
        }, 2000);
    }

    function checkPaymentStatus() {
        if (!pendingDownloadFile) return;

        var payments = getPendingPayments();
        for (var i = 0; i < payments.length; i++) {
            if (payments[i].fileId === pendingDownloadFile.id && payments[i].status === 'verified') {
                showToast('✅ پرداخت شما تایید شد! فایل در حال دانلود است...', 'success');
                downloadRealFile(pendingDownloadFile);
                pendingDownloadFile = null;
                break;
            }
            if (payments[i].fileId === pendingDownloadFile.id && payments[i].status === 'rejected') {
                showToast('❌ پرداخت شما رد شد! لطفاً با پشتیبانی تماس بگیرید', 'error');
                pendingDownloadFile = null;
                break;
            }
        }
    }

    // ===== BACK TO CATEGORIES =====
    function backToCategories() {
        document.getElementById('categoriesGrid').style.display = 'grid';
        var header = document.querySelector('.section-header');
        if (header) header.style.display = 'block';
        document.getElementById('categoryFilesSection').style.display = 'none';
        currentCategory = null;
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ===== HELPERS =====
    function getCategoryName(id) {
        for (var i = 0; i < CATEGORIES.length; i++) {
            if (CATEGORIES[i].id === id) return CATEGORIES[i].name;
        }
        return id;
    }

    function getFileIcon(category) {
        for (var i = 0; i < CATEGORIES.length; i++) {
            if (CATEGORIES[i].id === category) return CATEGORIES[i].icon;
        }
        return '📄';
    }

    // ===== TOAST =====
    function showToast(message, type) {
        type = type || 'success';
        var container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        var icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️'
        };
        var toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.innerHTML = '<span class="toast-icon">' + (icons[type] || '📢') + '</span><span class="toast-message">' + message + '</span><button class="toast-close" onclick="this.parentElement.remove()">✕</button>';
        container.appendChild(toast);
        setTimeout(function () {
            if (toast.parentElement) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(50px)';
                setTimeout(function () {
                    if (toast.parentElement) toast.remove();
                }, 300);
            }
        }, 8000);
    }

    // ===== INIT =====
    document.addEventListener('DOMContentLoaded', function () {
        updateHeader();
        document.getElementById('backToCategories').addEventListener('click', backToCategories);
        document.getElementById('closePaymentModal').addEventListener('click', closePaymentModal);
        document.getElementById('cancelPaymentBtn').addEventListener('click', closePaymentModal);
        document.getElementById('confirmPaymentBtn').addEventListener('click', confirmPayment);
        document.getElementById('paymentModal').addEventListener('click', function (e) {
            if (e.target === this) closePaymentModal();
        });

        openPixelDB().then(function () {
            loadFiles();
        }).catch(function (e) {
            showToast('خطا در اتصال به دیتابیس', 'error');
        });

        setInterval(function () {
            checkPaymentStatus();
        }, 5000);
    });

    window.openCategory = openCategory;
    window.downloadOrPay = downloadOrPay;
    window.showToast = showToast;
    window.toggleFavoriteFile = toggleFavoriteFile;
    window.isUserFavorite = isUserFavorite;
    window.updateFavoritesBadge = updateFavoritesBadge;

})();