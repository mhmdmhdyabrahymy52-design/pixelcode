"use strict";

/* ==================================================
                    PIXELCODE PROFILE
================================================== */

/* ==================================================
                    STORAGE
================================================== */

function getCurrentUser() {
    try {
        const data = localStorage.getItem("currentUser");
        if (!data) return null;
        return JSON.parse(data);
    } catch (error) {
        console.error("خطا در دریافت کاربر:", error);
        return null;
    }
}

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem("users")) || [];
    } catch (error) {
        console.error("خطا در دریافت کاربران:", error);
        return [];
    }
}

function saveUsers(users) {
    try {
        localStorage.setItem("users", JSON.stringify(users));
        return true;
    } catch (error) {
        console.error("خطا در ذخیره کاربران:", error);
        return false;
    }
}

/* ==================================================
                ACCOUNT TYPE NORMALIZER
================================================== */

function normalizeAccountData(user) {
    if (!user) return null;

    // Normalize role
    const oldRole = String(user.role || "").trim().toLowerCase();

    // Migrate old role values to accountType
    if (oldRole === "freelancer" || oldRole === "فریلنسر") {
        if (!user.accountType) user.accountType = "freelancer";
        user.role = "کاربر";
    }

    if (oldRole === "employer" || oldRole === "کارفرما") {
        if (!user.accountType) user.accountType = "employer";
        user.role = "کاربر";
    }

    // Clean role
    if (user.role === "super_admin" || user.role === "superadmin" || user.role === "ادمین ارشد") {
        user.role = "سوپر مدیر";
    }

    if (user.role === "admin" || user.role === "administrator" || user.role === "ادمین") {
        user.role = "مدیر";
    }

    if (!user.role || !["سوپر مدیر", "مدیر", "کاربر"].includes(user.role)) {
        user.role = "کاربر";
    }

    // Clean account type - اولویت با projectRole از projects.js
    const projectRole = user.projectRole || "";
    if (projectRole === "freelancer") {
        user.accountType = "freelancer";
    } else if (projectRole === "employer") {
        user.accountType = "employer";
    } else {
        const accountType = user.accountType || user.userType || user.type || "";
        if (accountType === "freelancer" || accountType === "فریلنسر") {
            user.accountType = "freelancer";
        } else if (accountType === "employer" || accountType === "کارفرما") {
            user.accountType = "employer";
        } else {
            user.accountType = "";
        }
    }

    return user;
}

function normalizeAndSaveCurrentUser() {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;

    const normalized = normalizeAccountData(currentUser);
    const users = getUsers();
    const index = users.findIndex(user => user.id === normalized.id);

    if (index !== -1) {
        users[index] = normalized;
    } else {
        users.push(normalized);
    }

    saveUsers(users);
    localStorage.setItem("currentUser", JSON.stringify(normalized));
    return normalized;
}

/* ==================================================
                ROLE LABEL
================================================== */

function getRoleLabel(role) {
    switch (role) {
        case "سوپر مدیر":
            return "سوپر مدیر";
        case "مدیر":
            return "مدیر";
        default:
            return "کاربر";
    }
}

function getRoleClass(role) {
    switch (role) {
        case "سوپر مدیر":
            return "super-admin";
        case "مدیر":
            return "admin";
        default:
            return "user";
    }
}

/* ==================================================
                ACCOUNT TYPE LABEL
================================================== */

function getAccountTypeLabel(type) {
    switch (type) {
        case "freelancer":
        case "فریلنسر":
            return "فریلنسر";
        case "employer":
        case "کارفرما":
            return "کارفرما";
        default:
            return "انتخاب نشده";
    }
}

/* ==================================================
                    TOAST
================================================== */

function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const existingToasts = container.querySelectorAll(".toast");
    existingToasts.forEach(t => t.remove());

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icons = {
        success: "✅",
        error: "❌",
        warning: "⚠️",
        info: "ℹ️"
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || "ℹ️"}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" type="button">✕</button>
    `;

    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => toast.remove());

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 3500);
}

/* ==================================================
                    VALIDATION
================================================== */

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^09\d{9}$/.test(phone);
}

/* ==================================================
                    DOM REFS
================================================== */

const elements = {
    profileName: document.getElementById("profileName"),
    profileUsername: document.getElementById("profileUsername"),
    profileStatus: document.getElementById("profileStatus"),
    profileRole: document.getElementById("profileRole"),
    profileRoleBox: document.getElementById("profileRoleBox"),
    profileAccountType: document.getElementById("profileAccountType"),
    profileTokens: document.getElementById("profileTokens"),
    profileAvatar: document.getElementById("profileAvatar"),
    changeAvatarBtn: document.getElementById("changeAvatarBtn"),
    avatarInput: document.getElementById("avatarInput"),
    fullnameValue: document.getElementById("fullnameValue"),
    usernameValue: document.getElementById("usernameValue"),
    emailValue: document.getElementById("emailValue"),
    phoneValue: document.getElementById("phoneValue"),
    publicId: document.getElementById("publicId"),
    joinDate: document.getElementById("joinDate"),
    roleValue: document.getElementById("roleValue"),
    accountTypeValue: document.getElementById("accountTypeValue"),
    accountStatus: document.getElementById("accountStatus"),
    profileTokensBottom: document.getElementById("profileTokensBottom"),
    adminInfoCard: document.getElementById("adminInfoCard"),
    adminInfoTitle: document.getElementById("adminInfoTitle"),
    adminInfoText: document.getElementById("adminInfoText"),
    editModal: document.getElementById("editModal"),
    modalTitle: document.getElementById("modalTitle"),
    modalInput: document.getElementById("modalInput"),
    modalLabel: document.querySelector(".modal-label"),
    closeModal: document.getElementById("closeModal"),
    cancelModal: document.getElementById("cancelModal"),
    saveModal: document.getElementById("saveModal"),
    logoutModal: document.getElementById("logoutModal"),
    closeLogoutModal: document.getElementById("closeLogoutModal"),
    cancelLogout: document.getElementById("cancelLogout"),
    confirmLogout: document.getElementById("confirmLogout"),
    adminMenu: document.getElementById("adminMenu"),
    logoutBtn: document.getElementById("logoutBtn"),
    editBtns: document.querySelectorAll(".edit-btn")
};

/* ==================================================
                RENDER PROFILE
================================================== */

function renderProfile(user) {
    if (!user) {
        showToast("لطفاً ابتدا وارد شوید", "error");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);
        return;
    }

    user = normalizeAccountData(user);

    elements.profileName.textContent = user.fullname || "کاربر مهمان";
    elements.profileUsername.textContent = user.username ? `@${user.username}` : "@guest";
    elements.profileStatus.textContent = user.status || "فعال";
    
    const roleLabel = getRoleLabel(user.role);
    elements.profileRole.textContent = roleLabel;
    elements.profileRoleBox.className = `profile-role ${getRoleClass(user.role)}`;
    
    const accountTypeLabel = getAccountTypeLabel(user.accountType);
    elements.profileAccountType.textContent = accountTypeLabel;
    elements.profileTokens.textContent = (Number(user.tokens) || 0).toLocaleString("fa-IR");
    elements.profileAvatar.src = user.avatar || "../images/avatar-default.svg";

    elements.fullnameValue.textContent = user.fullname || "-";
    elements.usernameValue.textContent = user.username || "-";
    elements.emailValue.textContent = user.email || "-";
    elements.phoneValue.textContent = user.phone || "-";
    elements.publicId.textContent = user.publicId || "PC-000000";
    elements.joinDate.textContent = user.createdAt || "-";
    elements.roleValue.textContent = roleLabel;
    elements.accountTypeValue.textContent = accountTypeLabel;
    elements.accountStatus.textContent = user.status || "فعال";
    elements.profileTokensBottom.textContent = (Number(user.tokens) || 0).toLocaleString("fa-IR");

    const adminRoles = ["مدیر", "سوپر مدیر"];
    if (user && adminRoles.includes(user.role)) {
        elements.adminMenu.style.display = "flex";
    } else {
        elements.adminMenu.style.display = "none";
    }

    if (user.role === "سوپر مدیر") {
        elements.adminInfoCard.style.display = "flex";
        elements.adminInfoTitle.textContent = "دسترسی کامل به پنل مدیریت";
        elements.adminInfoText.textContent = "شما به تمام بخش‌های مدیریت دسترسی دارید.";
    } else if (user.role === "مدیر") {
        elements.adminInfoCard.style.display = "flex";
        elements.adminInfoTitle.textContent = "دسترسی به پنل مدیریت";
        elements.adminInfoText.textContent = "شما به پنل مدیریت دسترسی دارید.";
    } else {
        elements.adminInfoCard.style.display = "none";
    }
}

/* ==================================================
                UPDATE USER
================================================== */

function updateUser(updatedUser) {
    try {
        updatedUser = normalizeAccountData(updatedUser);
        const users = getUsers();
        const index = users.findIndex(user => user.id === updatedUser.id);

        if (index !== -1) {
            users[index] = updatedUser;
        } else {
            users.push(updatedUser);
        }

        saveUsers(users);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        return true;
    } catch (error) {
        console.error(error);
        showToast("خطا در به‌روزرسانی اطلاعات", "error");
        return false;
    }
}

/* ==================================================
                UPDATE FIELD
================================================== */

function updateUserField(field, value) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showToast("کاربر یافت نشد", "error");
        return false;
    }

    const validFields = ["fullname", "username", "email", "phone"];
    if (!validFields.includes(field)) {
        showToast("فیلد نامعتبر است", "error");
        return false;
    }

    const newValue = value.trim();
    if (!newValue) {
        showToast("مقدار نمی‌تواند خالی باشد", "warning");
        return false;
    }

    if (field === "email" && !isValidEmail(newValue)) {
        showToast("ایمیل نامعتبر است", "error");
        return false;
    }

    if (field === "phone" && !isValidPhone(newValue)) {
        showToast("شماره موبایل نامعتبر است", "error");
        return false;
    }

    const users = getUsers();

    if (field === "username") {
        const exists = users.some(user => 
            user.username === newValue && user.id !== currentUser.id
        );
        if (exists) {
            showToast("این نام کاربری قبلاً ثبت شده است", "error");
            return false;
        }
    }

    if (field === "email") {
        const exists = users.some(user => 
            user.email === newValue && user.id !== currentUser.id
        );
        if (exists) {
            showToast("این ایمیل قبلاً ثبت شده است", "error");
            return false;
        }
    }

    currentUser[field] = newValue;

    if (updateUser(currentUser)) {
        renderProfile(currentUser);
        showToast("اطلاعات با موفقیت به‌روزرسانی شد", "success");
        return true;
    }

    return false;
}

/* ==================================================
                    AVATAR
================================================== */

function handleAvatarUpload(file) {
    if (!file) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
        showToast("کاربر یافت نشد", "error");
        return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
        showToast("فرمت فایل پشتیبانی نمی‌شود", "error");
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        showToast("حجم فایل باید کمتر از ۲ مگابایت باشد", "error");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        currentUser.avatar = event.target.result;
        if (updateUser(currentUser)) {
            renderProfile(currentUser);
            showToast("تصویر پروفایل تغییر کرد", "success");
        }
    };
    reader.onerror = function() {
        showToast("خطا در خواندن فایل", "error");
    };
    reader.readAsDataURL(file);
}

/* ==================================================
                    EDIT MODAL
================================================== */

let currentEditField = null;

function openEditModal(field) {
    const user = getCurrentUser();
    if (!user) return;

    currentEditField = field;

    const labels = {
        fullname: {
            title: "ویرایش نام و نام خانوادگی",
            label: "نام جدید",
            placeholder: "نام و نام خانوادگی جدید را وارد کنید"
        },
        username: {
            title: "ویرایش نام کاربری",
            label: "نام کاربری جدید",
            placeholder: "نام کاربری جدید را وارد کنید"
        },
        email: {
            title: "ویرایش ایمیل",
            label: "ایمیل جدید",
            placeholder: "ایمیل جدید را وارد کنید"
        },
        phone: {
            title: "ویرایش شماره موبایل",
            label: "شماره موبایل جدید",
            placeholder: "شماره موبایل جدید را وارد کنید"
        }
    };

    const data = labels[field];
    if (!data) return;

    elements.modalTitle.textContent = data.title;
    elements.modalLabel.textContent = data.label;
    elements.modalInput.value = user[field] || "";
    elements.modalInput.placeholder = data.placeholder;

    if (field === "email") {
        elements.modalInput.type = "email";
    } else if (field === "phone") {
        elements.modalInput.type = "tel";
    } else {
        elements.modalInput.type = "text";
    }

    elements.editModal.classList.remove("hidden");
    setTimeout(() => elements.modalInput.focus(), 100);
}

function closeEditModal() {
    elements.editModal.classList.add("hidden");
    currentEditField = null;
    elements.modalInput.value = "";
}

function saveEditModal() {
    if (!currentEditField) return;
    updateUserField(currentEditField, elements.modalInput.value);
}

/* ==================================================
                    LOGOUT
================================================== */

function openLogoutModal() {
    if (elements.logoutModal) {
        elements.logoutModal.classList.remove("hidden");
    }
}

function closeLogoutModal() {
    if (elements.logoutModal) {
        elements.logoutModal.classList.add("hidden");
    }
}

function logoutUser() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
    showToast("با موفقیت خارج شدید", "success");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 900);
}

/* ==================================================
                EVENT LISTENERS
================================================== */

elements.editBtns.forEach(button => {
    button.addEventListener("click", function() {
        const field = this.dataset.field;
        if (field) openEditModal(field);
    });
});

if (elements.closeModal) {
    elements.closeModal.addEventListener("click", closeEditModal);
}

if (elements.cancelModal) {
    elements.cancelModal.addEventListener("click", closeEditModal);
}

if (elements.saveModal) {
    elements.saveModal.addEventListener("click", saveEditModal);
}

if (elements.editModal) {
    elements.editModal.addEventListener("click", function(event) {
        if (event.target === this) closeEditModal();
    });
}

if (elements.modalInput) {
    elements.modalInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            saveEditModal();
        }
    });
}

document.addEventListener("keydown", function(event) {
    if (event.key !== "Escape") return;

    if (elements.editModal && !elements.editModal.classList.contains("hidden")) {
        closeEditModal();
    }

    if (elements.logoutModal && !elements.logoutModal.classList.contains("hidden")) {
        closeLogoutModal();
    }
});

if (elements.changeAvatarBtn) {
    elements.changeAvatarBtn.addEventListener("click", () => {
        elements.avatarInput.click();
    });
}

if (elements.avatarInput) {
    elements.avatarInput.addEventListener("change", function() {
        if (this.files && this.files[0]) {
            handleAvatarUpload(this.files[0]);
            this.value = "";
        }
    });
}

if (elements.logoutBtn) {
    elements.logoutBtn.addEventListener("click", function(event) {
        event.preventDefault();
        openLogoutModal();
    });
}

if (elements.closeLogoutModal) {
    elements.closeLogoutModal.addEventListener("click", closeLogoutModal);
}

if (elements.cancelLogout) {
    elements.cancelLogout.addEventListener("click", closeLogoutModal);
}

if (elements.logoutModal) {
    elements.logoutModal.addEventListener("click", function(event) {
        if (event.target === this) closeLogoutModal();
    });
}

if (elements.confirmLogout) {
    elements.confirmLogout.addEventListener("click", function() {
        closeLogoutModal();
        logoutUser();
    });
}

/* ==================================================
                         INIT
================================================== */

function init() {
    let user = getCurrentUser();
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn || !user) {
        showToast("لطفاً ابتدا وارد شوید", "error");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);
        return;
    }

    user = normalizeAndSaveCurrentUser();
    renderProfile(user);
}

document.addEventListener("DOMContentLoaded", init);

window.profileUtils = {
    getCurrentUser,
    getUsers,
    saveUsers,
    normalizeAccountData,
    normalizeAndSaveCurrentUser,
    getRoleLabel,
    getAccountTypeLabel,
    updateUser,
    renderProfile,
    logoutUser,
    showToast
};