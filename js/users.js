/*=========================================

            USERS.JS

=========================================*/

"use strict";

/*=========================================

            ELEMENTS

=========================================*/

const usersTableBody =
document.getElementById("usersTableBody");

const totalUsers =
document.getElementById("totalUsers");

const adminUsers =
document.getElementById("adminUsers");

const blockedUsers =
document.getElementById("blockedUsers");

const searchInput =
document.getElementById("searchUser");

const pagination =
document.getElementById("pagination");

const paginationInfo =
document.getElementById("paginationInfo");

/*=========================================

            CONSTANTS

=========================================*/

const SUPER_ADMIN_EMAIL =
"mhmdmhdyabrahymy52@gmail.com";

const USERS_PER_PAGE = 10;

/*=========================================

            VARIABLES

=========================================*/

let users =
JSON.parse(
localStorage.getItem("users")
) || [];

let filteredUsers = [];

let currentPage = 1;

let currentSortField = null;

let currentSortDirection = "asc";
/*=========================================

            SAVE USERS

=========================================*/

function saveUsers() {

    localStorage.setItem(

        "users",

        JSON.stringify(users)

    );

}

/*=========================================

        SUPER ADMIN

=========================================*/

function fixSuperAdmin() {

    users.forEach(user => {

        if (user.email === SUPER_ADMIN_EMAIL) {

            user.role = "سوپر مدیر";

            user.status = "فعال";

            user.permissions = {

                dashboard: true,

                users: true,

                media: true,

                prompts: true,

                settings: true

            };

        }

        /*=========================
            FIX CREATED DATE
        =========================*/

        if (!user.createdAt) {

            user.createdAt =

                user.date ||

                user.joinDate ||

                new Date().toLocaleDateString("fa-IR");

        }

    });

    saveUsers();

}

/*=========================================

        UPDATE STATS

=========================================*/

function updateStats() {

    totalUsers.textContent =

        users.length;

    adminUsers.textContent =

        users.filter(user =>

            user.role === "مدیر" ||

            user.role === "سوپر مدیر"

        ).length;

    blockedUsers.textContent =

        users.filter(user =>

            user.status === "مسدود"

        ).length;

}

/*=========================================

        INITIALIZE

=========================================*/

function initializeUsers() {

    fixSuperAdmin();

    filteredUsers = [...users];

    currentPage = 1;

    updateStats();

}
/*=========================================

            RENDER USERS

=========================================*/

function renderUsers(list = filteredUsers) {

    usersTableBody.innerHTML = "";

    if (list.length === 0) {

        usersTableBody.innerHTML = `

        <tr>

            <td colspan="8">

                هیچ کاربری یافت نشد.

            </td>

        </tr>

        `;

        pagination.innerHTML = "";

        paginationInfo.textContent = "";

        return;

    }

    const start =

        (currentPage - 1) * USERS_PER_PAGE;

    const end =

        start + USERS_PER_PAGE;

    const pageUsers =

        list.slice(start, end);

    pageUsers.forEach(user => {

        const roleBadge =

            user.role === "سوپر مدیر"

            ?

            `<span class="badge super-admin">👑 سوپر مدیر</span>`

            :

            user.role === "مدیر"

            ?

            `<span class="badge admin">🛡 مدیر</span>`

            :

            `<span class="badge user">👤 کاربر</span>`;

        const statusBadge =

            user.status === "فعال"

            ?

            `<span class="badge active">🟢 فعال</span>`

            :

            `<span class="badge blocked">🔴 مسدود</span>`;

        /*=========================
            FIX DATE
        =========================*/

        const createdDate =

            user.createdAt ||

            user.date ||

            user.joinDate ||

            "-";

        usersTableBody.innerHTML += `

        <tr>

            <td>${user.publicId || "-"}</td>

            <td>${user.fullname || "-"}</td>

            <td>${user.username || "-"}</td>

            <td>${user.email || "-"}</td>

            <td>${roleBadge}</td>

            <td>${statusBadge}</td>

            <td>${createdDate}</td>

            <td>

                <div class="actions">

                    ${createActionButtons(user)}

                </div>

            </td>

        </tr>

        `;

    });

    updateStats();

    renderPagination(list.length);

}
/*=========================================

        ACTION BUTTONS

=========================================*/

function createActionButtons(user) {

    if (user.role === "سوپر مدیر") {

        return `

        <button
        class="role-btn locked-btn"
        disabled>

            🔒 قفل شده

        </button>

        <button
        class="edit-btn locked-btn"
        disabled>

            🔒 ویرایش

        </button>

        <button
        class="block-btn locked-btn"
        disabled>

            🔒 مسدود

        </button>

        <button
        class="delete-btn locked-btn"
        disabled>

            🔒 حذف

        </button>

        `;

    }

    return `

    <button
    class="role-btn"
    onclick="changeRole(${user.id})">

        ${user.role === "مدیر"

            ? "کاربر کردن"

            : "مدیر کردن"}

    </button>

    <button
    class="edit-btn"
    onclick="editUser(${user.id})">

        ویرایش

    </button>

    <button
    class="block-btn"
    onclick="blockUser(${user.id})">

        ${user.status === "فعال"

            ? "مسدود"

            : "رفع مسدودی"}

    </button>

    <button
    class="delete-btn"
    onclick="deleteUser(${user.id})">

        حذف

    </button>

    `;

}
/*=========================================

            PAGINATION

=========================================*/

function renderPagination(totalItems) {

    pagination.innerHTML = "";

    const totalPages = Math.ceil(

        totalItems / USERS_PER_PAGE

    );

    if (totalPages <= 1) {

        paginationInfo.textContent =

        `نمایش ${totalItems} کاربر`;

        return;

    }

    const start =

        (currentPage - 1) * USERS_PER_PAGE + 1;

    const end =

        Math.min(

            currentPage * USERS_PER_PAGE,

            totalItems

        );

    paginationInfo.textContent =

    `نمایش ${start} تا ${end} از ${totalItems} کاربر`;

    /*=========================
            PREVIOUS
    =========================*/

    const prevBtn = document.createElement("button");

    prevBtn.className = "page-btn";

    prevBtn.textContent = "قبلی";

    prevBtn.disabled = currentPage === 1;

    prevBtn.onclick = function () {

        currentPage--;

        renderUsers(filteredUsers);

    };

    pagination.appendChild(prevBtn);

    /*=========================
            NUMBERS
    =========================*/

    for (

        let i = 1;

        i <= totalPages;

        i++

    ) {

        const btn = document.createElement("button");

        btn.className = "page-number";

        btn.textContent = i;

        if (i === currentPage) {

            btn.classList.add("active");

        }

        btn.onclick = function () {

            currentPage = i;

            renderUsers(filteredUsers);

        };

        pagination.appendChild(btn);

    }

    /*=========================
            NEXT
    =========================*/

    const nextBtn = document.createElement("button");

    nextBtn.className = "page-btn";

    nextBtn.textContent = "بعدی";

    nextBtn.disabled =

        currentPage === totalPages;

    nextBtn.onclick = function () {

        currentPage++;

        renderUsers(filteredUsers);

    };

    pagination.appendChild(nextBtn);

}

/*=========================================

            LIVE SEARCH

=========================================*/

searchInput.addEventListener(

    "input",

    function () {

        const value =

            this.value.trim().toLowerCase();

        filteredUsers = users.filter(user => {

            return (

                (user.publicId || "")

                .toString()

                .toLowerCase()

                .includes(value)

                ||

                (user.fullname || "")

                .toLowerCase()

                .includes(value)

                ||

                (user.username || "")

                .toLowerCase()

                .includes(value)

                ||

                (user.email || "")

                .toLowerCase()

                .includes(value)

                ||

                (user.phone || "")

                .toLowerCase()

                .includes(value)

                ||

                (user.role || "")

                .toLowerCase()

                .includes(value)

                ||

                (user.status || "")

                .toLowerCase()

                .includes(value)

            );

        });

        currentPage = 1;

        renderUsers(filteredUsers);

    }

);

/*=========================================

            RESET SEARCH

=========================================*/

function resetSearch() {

    searchInput.value = "";

    filteredUsers = [...users];

    currentPage = 1;

    renderUsers(filteredUsers);

}

/*=========================================

            SORT USERS

=========================================*/

function sortUsers(field) {

    if (currentSortField === field) {

        currentSortDirection =

            currentSortDirection === "asc"

            ?

            "desc"

            :

            "asc";

    } else {

        currentSortField = field;

        currentSortDirection = "asc";

    }

    filteredUsers.sort((a, b) => {

        let valueA = a[field];
        let valueB = b[field];

        /*=========================
                DATE
        =========================*/

        if (field === "createdAt") {

            valueA = a.createdAt || a.date || "";

            valueB = b.createdAt || b.date || "";

        }

        /*=========================
                NULL
        =========================*/

        if (valueA === undefined || valueA === null)

            valueA = "";

        if (valueB === undefined || valueB === null)

            valueB = "";

        /*=========================
                STRING
        =========================*/

        if (typeof valueA === "string") {

            valueA = valueA.toLowerCase();

        }

        if (typeof valueB === "string") {

            valueB = valueB.toLowerCase();

        }

        /*=========================
                SORT
        =========================*/

        if (valueA < valueB) {

            return currentSortDirection === "asc"

                ?

                -1

                :

                1;

        }

        if (valueA > valueB) {

            return currentSortDirection === "asc"

                ?

                1

                :

                -1;

        }

        return 0;

    });

    currentPage = 1;

    renderUsers(filteredUsers);

}

/*=========================================

            CHANGE ROLE

=========================================*/

function changeRole(id) {

    const user = users.find(

        item => item.id === id

    );

    if (!user) return;

    if (user.role === "سوپر مدیر") {

        showToast(

            "امکان تغییر نقش سوپر مدیر وجود ندارد.",

            "warning"

        );

        return;

    }

    showModal({

        title: "تغییر نقش",

        type: "warning",

        content: `

        آیا از تغییر نقش

        <b>${user.fullname}</b>

        مطمئن هستید؟

        `,

        confirmText: "تغییر",

        cancelText: "انصراف",

        onConfirm() {

            user.role =

                user.role === "مدیر"

                ?

                "کاربر"

                :

                "مدیر";

            saveUsers();

            filteredUsers = [...users];

            updateStats();

            renderUsers(filteredUsers);

            showToast(

                "نقش کاربر با موفقیت تغییر کرد.",

                "success"

            );

        }

    });

}

/*=========================================

            BLOCK USER

=========================================*/

function blockUser(id) {

    const user = users.find(

        item => item.id === id

    );

    if (!user) return;

    if (user.role === "سوپر مدیر") {

        showToast(

            "سوپر مدیر قابل مسدود شدن نیست.",

            "warning"

        );

        return;

    }

    showModal({

        title: "تغییر وضعیت",

        type: "warning",

        content: `

        آیا از تغییر وضعیت

        <b>${user.fullname}</b>

        مطمئن هستید؟

        `,

        confirmText: "تایید",

        cancelText: "انصراف",

        onConfirm() {

            user.status =

                user.status === "فعال"

                ?

                "مسدود"

                :

                "فعال";

            saveUsers();

            filteredUsers = [...users];

            updateStats();

            renderUsers(filteredUsers);

            showToast(

                "وضعیت کاربر تغییر کرد.",

                "success"

            );

        }

    });

}

/*=========================================

            DELETE USER

=========================================*/

function deleteUser(id) {

    const user = users.find(

        item => item.id === id

    );

    if (!user) return;

    if (user.role === "سوپر مدیر") {

        showToast(

            "امکان حذف سوپر مدیر وجود ندارد.",

            "error"

        );

        return;

    }

    showModal({

        title: "حذف کاربر",

        type: "danger",

        content: `

        آیا از حذف

        <b>${user.fullname}</b>

        مطمئن هستید؟

        `,

        confirmText: "حذف",

        cancelText: "انصراف",

        onConfirm() {

            users = users.filter(

                item => item.id !== id

            );

            filteredUsers = [...users];

            saveUsers();

            updateStats();

            renderUsers(filteredUsers);

            showToast(

                "کاربر حذف شد.",

                "success"

            );

        }

    });

}

/*=========================================

            EDIT USER

=========================================*/

function editUser(id) {

    const user = users.find(

        item => item.id === id

    );

    if (!user) return;

    if (user.role === "سوپر مدیر") {

        showToast(

            "امکان ویرایش سوپر مدیر وجود ندارد.",

            "warning"

        );

        return;

    }

    localStorage.setItem(

        "editUserId",

        id

    );

    window.location.href =

    "edit-user.html";

}

/*=========================================

            INITIALIZE

=========================================*/

function initUsersPage() {

    initializeUsers();

    renderUsers(filteredUsers);

}

/*=========================================

        STORAGE REFRESH

=========================================*/

window.addEventListener(

    "storage",

    function () {

        users = JSON.parse(

            localStorage.getItem("users")

        ) || [];

        initializeUsers();

        renderUsers(filteredUsers);

    }

);

/*=========================================

        GLOBAL FUNCTIONS

=========================================*/

window.sortUsers = sortUsers;

window.changeRole = changeRole;

window.blockUser = blockUser;

window.deleteUser = deleteUser;

window.editUser = editUser;

/*=========================================

            START

=========================================*/

initUsersPage();

/*=========================================

            DEBUG

=========================================*/

console.log(

    "Users Loaded",

    users

);