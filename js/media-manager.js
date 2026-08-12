/* ============================================
   MEDIA-MANAGER.JS
   ============================================ */

(function() {
    'use strict';

    var files = [];
    var editingId = null;
    var deleteTargetId = null;

    var DOM = {
        tableBody: document.getElementById('mediaTableBody'),
        searchInput: document.getElementById('searchInput'),
        categoryFilter: document.getElementById('categoryFilter'),
        priceFilter: document.getElementById('priceFilter'),
        statusFilter: document.getElementById('statusFilter'),
        modal: document.getElementById('mediaModal'),
        modalTitle: document.getElementById('modalTitle'),
        mediaId: document.getElementById('mediaId'),
        fileName: document.getElementById('fileName'),
        fileCategory: document.getElementById('fileCategory'),
        filePrice: document.getElementById('filePrice'),
        fileStatus: document.getElementById('fileStatus'),
        fileImage: document.getElementById('fileImage'),
        closeModal: document.getElementById('closeModal'),
        cancelBtn: document.getElementById('cancelBtn'),
        mediaForm: document.getElementById('mediaForm'),
        deleteModal: document.getElementById('deleteModal'),
        deleteCancel: document.getElementById('deleteCancel'),
        deleteAccept: document.getElementById('deleteAccept'),
        addBtn: document.getElementById('addMediaBtn'),
        totalFiles: document.getElementById('totalFiles'),
        freeFiles: document.getElementById('freeFiles'),
        premiumFiles: document.getElementById('premiumFiles'),
        totalDownloads: document.getElementById('totalDownloads')
    };

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

    function updateHeader() {
        var userData = JSON.parse(localStorage.getItem('pixelcode_user'));
        if (!userData) userData = JSON.parse(localStorage.getItem('currentUser'));
        var isLoggedIn = localStorage.getItem('pixelcode_isLoggedIn') === 'true' || localStorage.getItem('isLoggedIn') === 'true';
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
            if (profileStatus) { profileStatus.textContent = 'آنلاین'; profileStatus.style.color = '#22C55E'; }
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-flex';
            if (registerBtn) registerBtn.style.display = 'inline-flex';
            if (profileBox) profileBox.style.display = 'flex';
            if (profileAvatar) profileAvatar.src = '../images/avatar-default.svg';
            if (profileTitle) profileTitle.textContent = 'پروفایل';
            if (profileStatus) { profileStatus.textContent = 'ثبت نام نکرده‌ای'; profileStatus.style.color = '#94A3B8'; }
        }
    }

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    function getCategoryName(id) {
        var names = { 'background': 'بک گراند', 'css': 'CSS', 'html': 'HTML', 'javascript': 'JavaScript', 'logo': 'لوگو', 'icon': 'آیکون', 'font': 'فونت', 'project': 'پروژه', 'ui': 'UI Kit', 'effect': 'افکت', 'responsive': 'قالب ریسپانسیو', 'other': 'سایر' };
        return names[id] || id;
    }

    function getFileIcon(category) {
        var icons = { 'background': '🎨', 'css': '🎨', 'html': '💻', 'javascript': '⚙️', 'logo': '🖋️', 'icon': '🧩', 'font': '🔤', 'project': '📦', 'ui': '🎛️', 'effect': '✨', 'responsive': '📱', 'other': '📂' };
        return icons[category] || '📄';
    }

    window.setPriceType = function(type) {
        var btns = document.querySelectorAll('.toggle-btn');
        btns.forEach(function(btn) {
            btn.classList.remove('active');
            if (btn.dataset.value === type) btn.classList.add('active');
        });
        document.getElementById('priceType').value = type;
        var priceInput = document.getElementById('filePrice');
        if (type === 'free') {
            priceInput.value = 0;
            priceInput.disabled = true;
            priceInput.style.opacity = '0.5';
            priceInput.style.cursor = 'not-allowed';
        } else {
            priceInput.disabled = false;
            priceInput.style.opacity = '1';
            priceInput.style.cursor = 'text';
            if (priceInput.value === '0') priceInput.value = '';
        }
    };

    function loadFiles() {
        getAllFilesFromDB().then(function(data) {
            files = data || [];
            renderTable();
            updateStats();
        }).catch(function(e) {
            files = [];
            renderTable();
            updateStats();
        });
    }

    function renderTable() {
        if (!DOM.tableBody) return;
        var search = DOM.searchInput ? DOM.searchInput.value.trim().toLowerCase() : '';
        var category = DOM.categoryFilter ? DOM.categoryFilter.value : 'all';
        var price = DOM.priceFilter ? DOM.priceFilter.value : 'all';
        var status = DOM.statusFilter ? DOM.statusFilter.value : 'all';

        var filtered = files.filter(function(file) {
            var matchSearch = file.name.toLowerCase().includes(search);
            var matchCategory = category === 'all' || file.category === category;
            var matchPrice = price === 'all' || file.priceType === price;
            var matchStatus = status === 'all' || file.status === status;
            return matchSearch && matchCategory && matchPrice && matchStatus;
        });

        if (filtered.length === 0) {
            DOM.tableBody.innerHTML = '<tr><td colspan="8" class="empty-row"><i class="ri-inbox-line"></i><span>هیچ فایلی یافت نشد</span></td></tr>';
            return;
        }

        var html = '';
        for (var i = 0; i < filtered.length; i++) {
            var f = filtered[i];
            var isFree = f.price === 0;
            var statusClass = f.status === 'فعال' ? 'active' : 'inactive';
            var priceClass = isFree ? 'free' : 'premium';
            var priceLabel = isFree ? 'رایگان' : f.price.toLocaleString() + ' تومان';

            html += '<tr>';
            html += '<td><input type="checkbox" class="file-checkbox" data-id="' + f.id + '"></td>';
            html += '<td><div class="file-preview">';
            if (f.content && f.content.startsWith('data:image')) {
                html += '<img src="' + f.content + '" alt="' + f.name + '">';
            } else {
                html += '<span class="file-icon-preview">' + getFileIcon(f.category) + '</span>';
            }
            html += '</div></td>';
            html += '<td><strong>' + f.name + '</strong></td>';
            html += '<td><span class="category-badge">' + getCategoryName(f.category) + '</span></td>';
            html += '<td><span class="price-badge ' + priceClass + '">' + priceLabel + '</span></td>';
            html += '<td>' + (f.downloads || 0) + '</td>';
            html += '<td><span class="status-badge ' + statusClass + '">' + f.status + '</span></td>';
            html += '<td><div class="action-buttons">';
            html += '<button class="action-btn action-edit" onclick="window.editFile(\'' + f.id + '\')" title="ویرایش"><i class="ri-edit-2-line"></i></button>';
            html += '<button class="action-btn action-delete" onclick="window.confirmDelete(\'' + f.id + '\')" title="حذف"><i class="ri-delete-bin-6-line"></i></button>';
            html += '<button class="action-btn action-status" onclick="window.toggleStatus(\'' + f.id + '\')" title="تغییر وضعیت"><i class="ri-' + (f.status === 'فعال' ? 'eye-line' : 'eye-off-line') + '"></i></button>';
            html += '</div></td>';
            html += '</tr>';
        }
        DOM.tableBody.innerHTML = html;

        document.querySelectorAll('.file-checkbox').forEach(function(cb) {
            cb.addEventListener('change', function() { updateSelectAllState(); });
        });
    }

    function updateStats() {
        var total = files.length;
        var free = 0, premium = 0, downloads = 0;
        for (var i = 0; i < files.length; i++) {
            if (files[i].price === 0) free++;
            else premium++;
            downloads += (files[i].downloads || 0);
        }
        if (DOM.totalFiles) DOM.totalFiles.textContent = total;
        if (DOM.freeFiles) DOM.freeFiles.textContent = free;
        if (DOM.premiumFiles) DOM.premiumFiles.textContent = premium;
        if (DOM.totalDownloads) DOM.totalDownloads.textContent = downloads;
    }

    function updateSelectAllState() {
        var selectAll = document.getElementById('selectAll');
        var checkboxes = document.querySelectorAll('.file-checkbox');
        var checked = document.querySelectorAll('.file-checkbox:checked');
        if (selectAll) {
            if (checkboxes.length > 0 && checked.length === checkboxes.length) {
                selectAll.checked = true;
                selectAll.indeterminate = false;
            } else if (checked.length > 0) {
                selectAll.checked = false;
                selectAll.indeterminate = true;
            } else {
                selectAll.checked = false;
                selectAll.indeterminate = false;
            }
        }
    }

    function openAddModal() {
        editingId = null;
        DOM.modalTitle.textContent = 'افزودن فایل جدید';
        DOM.mediaForm.reset();
        DOM.mediaId.value = '';
        DOM.fileName.value = '';
        DOM.fileCategory.value = 'background';
        DOM.filePrice.value = '';
        DOM.fileStatus.value = 'فعال';
        DOM.fileImage.value = '';
        window.setPriceType('free');
        document.getElementById('priceType').value = 'free';
        DOM.modal.classList.add('active');
    }

    window.editFile = function(id) {
        getFileFromDB(id).then(function(file) {
            if (!file) { showToast('فایل یافت نشد', 'error'); return; }
            editingId = id;
            DOM.modalTitle.textContent = 'ویرایش فایل';
            DOM.mediaId.value = file.id;
            DOM.fileName.value = file.name;
            DOM.fileCategory.value = file.category;
            DOM.filePrice.value = file.price;
            DOM.fileStatus.value = file.status;
            DOM.fileImage.value = '';
            var type = file.price === 0 ? 'free' : 'premium';
            window.setPriceType(type);
            document.getElementById('priceType').value = type;
            DOM.modal.classList.add('active');
        });
    };

    function saveFile(e) {
        e.preventDefault();
        var name = DOM.fileName.value.trim();
        var category = DOM.fileCategory.value;
        var price = parseInt(DOM.filePrice.value) || 0;
        var status = DOM.fileStatus.value;
        var priceType = document.getElementById('priceType').value;
        var fileInput = DOM.fileImage;

        if (!name) { showToast('لطفاً نام فایل را وارد کنید', 'error'); DOM.fileName.focus(); return; }

        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                var fileData = {
                    id: editingId || generateId(),
                    name: name,
                    category: category,
                    price: priceType === 'free' ? 0 : price,
                    priceType: priceType,
                    status: status,
                    downloads: 0,
                    date: new Date().toLocaleDateString('fa-IR'),
                    fileName: file.name,
                    fileType: file.name.split('.').pop(),
                    fileSize: (file.size / 1024).toFixed(1) + ' KB',
                    content: e.target.result,
                    isBase64: true
                };
                saveFileToDB(fileData).then(function() {
                    if (editingId) {
                        var index = files.findIndex(function(f) { return f.id === editingId; });
                        if (index !== -1) files[index] = fileData;
                        showToast('فایل ویرایش شد', 'success');
                    } else {
                        files.push(fileData);
                        showToast('فایل اضافه شد', 'success');
                    }
                    renderTable();
                    updateStats();
                    closeModal();
                });
            };
            reader.readAsDataURL(file);
        } else if (editingId) {
            getFileFromDB(editingId).then(function(existingFile) {
                if (!existingFile) { showToast('فایل یافت نشد', 'error'); return; }
                existingFile.name = name;
                existingFile.category = category;
                existingFile.price = priceType === 'free' ? 0 : price;
                existingFile.priceType = priceType;
                existingFile.status = status;
                saveFileToDB(existingFile).then(function() {
                    var index = files.findIndex(function(f) { return f.id === editingId; });
                    if (index !== -1) files[index] = existingFile;
                    showToast('فایل ویرایش شد', 'success');
                    renderTable();
                    updateStats();
                    closeModal();
                });
            });
        } else {
            showToast('لطفاً یک فایل انتخاب کنید', 'error');
        }
    }

    window.confirmDelete = function(id) {
        deleteTargetId = id;
        DOM.deleteModal.classList.add('active');
    };

    window.deleteFile = function() {
        if (!deleteTargetId) return;
        deleteFileFromDB(deleteTargetId).then(function() {
            files = files.filter(function(f) { return f.id !== deleteTargetId; });
            renderTable();
            updateStats();
            showToast('فایل حذف شد', 'success');
            deleteTargetId = null;
            closeDeleteModal();
        });
    };

    window.toggleStatus = function(id) {
        getFileFromDB(id).then(function(file) {
            if (!file) return;
            file.status = file.status === 'فعال' ? 'غیرفعال' : 'فعال';
            saveFileToDB(file).then(function() {
                var index = files.findIndex(function(f) { return f.id === id; });
                if (index !== -1) files[index] = file;
                renderTable();
                showToast('وضعیت تغییر کرد', 'success');
            });
        });
    };

    function deleteSelected() {
        var checked = document.querySelectorAll('.file-checkbox:checked');
        if (checked.length === 0) { showToast('هیچ فایلی انتخاب نشده', 'error'); return; }
        if (!confirm('آیا از حذف ' + checked.length + ' فایل مطمئن هستید؟')) return;
        var ids = [];
        checked.forEach(function(cb) { ids.push(cb.dataset.id); });
        var promises = ids.map(function(id) { return deleteFileFromDB(id); });
        Promise.all(promises).then(function() {
            files = files.filter(function(f) { return ids.indexOf(f.id) === -1; });
            renderTable();
            updateStats();
            showToast(checked.length + ' فایل حذف شد', 'success');
        });
    }

    function closeModal() { DOM.modal.classList.remove('active'); editingId = null; }
    function closeDeleteModal() { DOM.deleteModal.classList.remove('active'); deleteTargetId = null; }

    document.addEventListener('DOMContentLoaded', function() {
        updateHeader();
        document.getElementById('selectAll').addEventListener('change', function() {
            document.querySelectorAll('.file-checkbox').forEach(function(cb) { cb.checked = this.checked; });
        });
        DOM.addBtn.addEventListener('click', openAddModal);
        DOM.mediaForm.addEventListener('submit', saveFile);
        DOM.closeModal.addEventListener('click', closeModal);
        DOM.cancelBtn.addEventListener('click', closeModal);
        DOM.modal.addEventListener('click', function(e) { if (e.target === this) closeModal(); });
        DOM.deleteCancel.addEventListener('click', closeDeleteModal);
        DOM.deleteAccept.addEventListener('click', window.deleteFile);
        DOM.deleteModal.addEventListener('click', function(e) { if (e.target === this) closeDeleteModal(); });
        document.getElementById('deleteSelected').addEventListener('click', deleteSelected);
        document.getElementById('refreshMedia').addEventListener('click', function() { loadFiles(); showToast('بروزرسانی شد', 'success'); });
        DOM.searchInput.addEventListener('input', renderTable);
        DOM.categoryFilter.addEventListener('change', renderTable);
        DOM.priceFilter.addEventListener('change', renderTable);
        DOM.statusFilter.addEventListener('change', renderTable);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') { closeModal(); closeDeleteModal(); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); DOM.searchInput.focus(); }
        });
        openPixelDB().then(function() { loadFiles(); }).catch(function(e) { showToast('خطا در اتصال به دیتابیس', 'error'); });
    });

    window.editFile = window.editFile;
    window.confirmDelete = window.confirmDelete;
    window.deleteFile = window.deleteFile;
    window.toggleStatus = window.toggleStatus;
    window.showToast = showToast;
    window.setPriceType = window.setPriceType;

})();