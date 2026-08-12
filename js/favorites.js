"use strict";

/* ==================================================
                    PIXELCODE
              FAVORITES.JS
================================================== */


/* ==================================================
                    VARIABLES
================================================== */

let allFavoriteFiles = [];


/* ==================================================
                GET CURRENT USER
================================================== */

function getCurrentUser() {

    let user =
        localStorage.getItem("pixelcode_user");

    if (user) {

        try {

            return JSON.parse(user);

        } catch (error) {

            console.warn(
                "خطا در pixelcode_user",
                error
            );

        }

    }


    user =
        localStorage.getItem("currentUser");

    if (user) {

        try {

            return JSON.parse(user);

        } catch (error) {

            console.warn(
                "خطا در currentUser",
                error
            );

        }

    }


    return null;

}


/* ==================================================
                LOGIN STATUS
================================================== */

function isUserLoggedIn() {

    if (
        localStorage.getItem(
            "pixelcode_isLoggedIn"
        ) === "true"
    ) {

        return true;

    }


    if (
        localStorage.getItem(
            "isLoggedIn"
        ) === "true"
    ) {

        return true;

    }


    return getCurrentUser() !== null;

}


/* ==================================================
                FAVORITES KEY
================================================== */

function getFavoritesKey() {

    const user =
        getCurrentUser();

    if (!user) {

        return null;

    }

    return "user_favorites_" + user.id;

}


/* ==================================================
                GET FAVORITE IDS
================================================== */

function getFavoriteIds() {

    const key =
        getFavoritesKey();

    if (!key) {

        return [];

    }


    const saved =
        localStorage.getItem(key);

    if (!saved) {

        return [];

    }


    try {

        const favorites =
            JSON.parse(saved);

        return Array.isArray(favorites)
            ? favorites
            : [];

    } catch (error) {

        console.warn(
            "خطا در خواندن علاقه‌مندی‌ها",
            error
        );

        return [];

    }

}


/* ==================================================
                SAVE FAVORITE IDS
================================================== */

function saveFavoriteIds(ids) {

    const key =
        getFavoritesKey();

    if (!key) {

        return;

    }


    localStorage.setItem(
        key,
        JSON.stringify(ids)
    );

}


/* ==================================================
                UPDATE HEADER BADGE
================================================== */

function updateFavoritesBadge() {

    const badge =
        document.getElementById(
            "favoritesCount"
        );

    if (!badge) {

        return;

    }


    const count =
        getFavoriteIds().length;


    badge.textContent =
        count;


    if (count > 0) {

        badge.classList.add("show");

    } else {

        badge.classList.remove("show");

    }

}


/* ==================================================
                    HEADER
================================================== */

function updateHeader() {

    const user =
        getCurrentUser();

    const loggedIn =
        isUserLoggedIn();


    const loginBtn =
        document.getElementById(
            "loginBtn"
        );

    const registerBtn =
        document.getElementById(
            "registerBtn"
        );

    const profileBox =
        document.getElementById(
            "profileBox"
        );

    const profileAvatar =
        document.getElementById(
            "profileAvatar"
        );

    const profileTitle =
        document.getElementById(
            "profileTitle"
        );

    const profileStatus =
        document.getElementById(
            "profileStatus"
        );


    if (loggedIn && user) {

        if (loginBtn) {

            loginBtn.style.display =
                "none";

        }


        if (registerBtn) {

            registerBtn.style.display =
                "none";

        }


        if (profileBox) {

            profileBox.style.display =
                "flex";

        }


        if (profileAvatar) {

            profileAvatar.src =
                user.avatar ||
                "../images/avatar-default.svg";

        }


        if (profileTitle) {

            profileTitle.textContent =
                user.fullname ||
                "کاربر";

        }


        if (profileStatus) {

            profileStatus.textContent =
                "آنلاین";

            profileStatus.style.color =
                "#22C55E";

        }

    } else {

        if (loginBtn) {

            loginBtn.style.display =
                "inline-flex";

        }


        if (registerBtn) {

            registerBtn.style.display =
                "inline-flex";

        }


        if (profileBox) {

            profileBox.style.display =
                "flex";

        }


        if (profileAvatar) {

            profileAvatar.src =
                "../images/avatar-default.svg";

        }


        if (profileTitle) {

            profileTitle.textContent =
                "پروفایل";

        }


        if (profileStatus) {

            profileStatus.textContent =
                "ثبت نام نکرده‌ای";

            profileStatus.style.color =
                "#94A3B8";

        }

    }


    updateFavoritesBadge();

}


/* ==================================================
                    FILE ICON
================================================== */

function getFileIcon(category) {

    const icons = {

        background: "🎨",

        css: "🎨",

        html: "💻",

        javascript: "⚙️",

        logo: "🖋️",

        icon: "🧩",

        font: "🔤",

        project: "📦",

        ui: "🎛️",

        effect: "✨",

        responsive: "📱",

        other: "📂"

    };


    return icons[category] ||
        "📄";

}


/* ==================================================
                CATEGORY NAME
================================================== */

function getCategoryName(category) {

    const names = {

        background: "بک گراند",

        css: "فایل CSS",

        html: "فایل HTML",

        javascript: "فایل JavaScript",

        logo: "لوگو",

        icon: "آیکون",

        font: "فونت",

        project: "پروژه کامل",

        ui: "UI Kit",

        effect: "افکت CSS",

        responsive: "قالب ریسپانسیو",

        other: "سایر فایل‌ها"

    };


    return names[category] ||
        category ||
        "سایر";

}


/* ==================================================
                GET FILE PRICE
================================================== */

function getPriceLabel(file) {

    const price =
        Number(file.price || 0);


    if (price === 0) {

        return {
            text: "رایگان",
            className: "free"
        };

    }


    return {

        text:
            price.toLocaleString(
                "fa-IR"
            ) + " تومان",

        className: ""

    };

}


/* ==================================================
                FIND FILE BY ID
================================================== */

function findFileById(id) {

    return allFavoriteFiles.find(
        function (file) {

            return String(file.id) ===
                String(id);

        }
    );

}


/* ==================================================
                RENDER FAVORITES
================================================== */

function renderFavorites() {

    const grid =
        document.getElementById(
            "favoritesGrid"
        );

    const empty =
        document.getElementById(
            "emptyFavorites"
        );

    const loginRequired =
        document.getElementById(
            "loginRequired"
        );


    if (!grid) {

        return;

    }


    /* ==========================================
                    LOGIN CHECK
    ========================================== */

    if (!isUserLoggedIn()) {

        grid.innerHTML = "";

        grid.style.display =
            "none";


        if (empty) {

            empty.style.display =
                "none";

        }


        if (loginRequired) {

            loginRequired.style.display =
                "flex";

        }


        updateFavoritesBadge();

        return;

    }


    if (loginRequired) {

        loginRequired.style.display =
            "none";

    }


    grid.style.display =
        "grid";


    /* ==========================================
                GET FAVORITE IDS
    ========================================== */

    const favoriteIds =
        getFavoriteIds();


    /* ==========================================
                    CLEAN IDS
    ========================================== */

    const favoriteFiles =
        favoriteIds
            .map(function (id) {

                return findFileById(id);

            })
            .filter(function (file) {

                return file &&
                    file.status === "فعال";

            });


    /* ==========================================
                REMOVE OLD FILE IDS
    ========================================== */

    const validIds =
        favoriteFiles.map(
            function (file) {

                return String(file.id);

            }
        );


    const cleanedIds =
        favoriteIds.filter(
            function (id) {

                return validIds.includes(
                    String(id)
                );

            }
        );


    if (
        cleanedIds.length !==
        favoriteIds.length
    ) {

        saveFavoriteIds(
            cleanedIds
        );

    }


    allFavoriteFiles =
        favoriteFiles;


    /* ==========================================
                EMPTY FAVORITES
    ========================================== */

    if (favoriteFiles.length === 0) {

        grid.innerHTML = "";

        grid.style.display =
            "none";


        if (empty) {

            empty.style.display =
                "flex";

        }


        updateFavoritesBadge();

        return;

    }


    if (empty) {

        empty.style.display =
            "none";

    }


    /* ==========================================
                CREATE CARDS
    ========================================== */

    grid.innerHTML =
        favoriteFiles
            .map(function (file) {

                return createFavoriteCard(
                    file
                );

            })
            .join("");


    updateFavoritesBadge();

}


/* ==================================================
                CREATE FAVORITE CARD
================================================== */

function createFavoriteCard(file) {

    const price =
        getPriceLabel(file);


    const icon =
        getFileIcon(
            file.category
        );


    const size =
        file.fileSize ||
        "نامشخص";


    const date =
        file.date ||
        "نامشخص";


    return `

        <div
            class="file-item-card"
            data-file-id="${file.id}"
        >

            <!-- File Icon -->

            <span class="file-icon">

                ${icon}

            </span>


            <!-- File Information -->

            <div class="file-info">

                <h4>
                    ${escapeHTML(
                        file.name ||
                        "فایل بدون نام"
                    )}
                </h4>


                <div class="file-meta">

                    <span>
                        📁
                        ${escapeHTML(
                            getCategoryName(
                                file.category
                            )
                        )}
                    </span>


                    <span>
                        📅
                        ${escapeHTML(
                            date
                        )}
                    </span>


                    <span>
                        📦
                        ${escapeHTML(
                            size
                        )}
                    </span>

                </div>

            </div>


            <!-- Price -->

            <span
                class="file-price-tag ${price.className}"
            >

                ${price.text}

            </span>


            <!-- Favorite -->

            <button
                type="button"
                class="favorite-btn active"
                onclick="
                    window.removeFavoriteFile('${file.id}')
                "
                title="حذف از علاقه‌مندی‌ها"
            >

                <i class="ri-heart-fill"></i>

            </button>


            <!-- Download -->

            <button
                type="button"
                class="download-btn"
                onclick="
                    window.downloadFavoriteFile('${file.id}')
                "
                title="دانلود"
            >

                <i class="ri-download-2-line"></i>

            </button>

        </div>

    `;

}


/* ==================================================
                REMOVE FAVORITE
================================================== */

window.removeFavoriteFile =
    function (id) {

        const user =
            getCurrentUser();


        if (!user) {

            showFavoriteToast(
                "لطفاً وارد حساب خود شوید",
                "warning"
            );

            return;

        }


        const favorites =
            getFavoriteIds();


        const index =
            favorites.findIndex(
                function (favoriteId) {

                    return String(
                        favoriteId
                    ) === String(id);

                }
            );


        if (index === -1) {

            return;

        }


        favorites.splice(
            index,
            1
        );


        saveFavoriteIds(
            favorites
        );


        const file =
            findFileById(id);


        showFavoriteToast(

            file
                ? `💔 "${file.name}" از علاقه‌مندی‌ها حذف شد`
                : "💔 فایل از علاقه‌مندی‌ها حذف شد",

            "warning"

        );


        renderFavorites();

    };


/* ==================================================
                DOWNLOAD FAVORITE
================================================== */

window.downloadFavoriteFile =
    function (id) {

        const file =
            findFileById(id);


        if (!file) {

            showFavoriteToast(
                "فایل پیدا نشد",
                "error"
            );

            return;

        }


        if (!isUserLoggedIn()) {

            showFavoriteToast(
                "لطفاً ابتدا وارد حساب خود شوید",
                "warning"
            );

            setTimeout(
                function () {

                    window.location.href =
                        "login.html";

                },
                1200
            );

            return;

        }


        const price =
            Number(
                file.price || 0
            );


        /*
            فایل رایگان
        */

        if (price === 0) {

            downloadRealFile(
                file
            );

            return;

        }


        /*
            فایل پولی
        */

        showFavoriteToast(

            "💳 این فایل پولی است؛ برای خرید آن از صفحه فایل اقدام کنید.",

            "warning"

        );

    };


/* ==================================================
                REAL DOWNLOAD
================================================== */

function downloadRealFile(file) {

    const alreadyDownloaded =
        hasUserDownloaded(
            file.id
        );


    /*
        ثبت دانلود
    */

    if (!alreadyDownloaded) {

        saveUserDownload(
            file.id
        );


        file.downloads =
            Number(
                file.downloads || 0
            ) + 1;


        if (
            typeof saveFileToDB ===
            "function"
        ) {

            saveFileToDB(
                file
            ).catch(
                function () {}
            );

        }

    }


    /*
        Base64
    */

    if (
        file.isBase64 &&
        file.content
    ) {

        const link =
            document.createElement(
                "a"
            );


        link.href =
            file.content;


        link.download =
            file.fileName ||
            (
                file.name +
                "." +
                (
                    file.fileType ||
                    "file"
                )
            );


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        showFavoriteToast(

            alreadyDownloaded
                ? `📥 "${file.name}" دوباره دانلود شد`
                : `✅ "${file.name}" دانلود شد`,

            "success"

        );


        return;

    }


    /*
        Text / Blob
    */

    const content =
        file.content ||
        "محتوای فایل در دسترس نیست";


    const fileName =
        file.fileName ||
        (
            file.name +
            "." +
            (
                file.fileType ||
                "txt"
            )
        );


    const blob =
        new Blob(
            [content],
            {
                type:
                    "application/octet-stream"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        fileName;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    setTimeout(
        function () {

            URL.revokeObjectURL(
                url
            );

        },
        1000
    );


    showFavoriteToast(

        alreadyDownloaded
            ? `📥 "${file.name}" دوباره دانلود شد`
            : `✅ "${file.name}" دانلود شد`,

        "success"

    );

}


/* ==================================================
                USER DOWNLOADS
================================================== */

function getUserDownloadKey() {

    const user =
        getCurrentUser();


    if (!user) {

        return null;

    }


    return "user_downloads_" +
        user.id;

}


function getUserDownloads() {

    const key =
        getUserDownloadKey();


    if (!key) {

        return [];

    }


    const saved =
        localStorage.getItem(
            key
        );


    if (!saved) {

        return [];

    }


    try {

        const downloads =
            JSON.parse(saved);

        return Array.isArray(downloads)
            ? downloads
            : [];

    } catch (error) {

        return [];

    }

}


function saveUserDownload(
    fileId
) {

    const key =
        getUserDownloadKey();


    if (!key) {

        return;

    }


    const downloads =
        getUserDownloads();


    const exists =
        downloads.some(
            function (id) {

                return String(id) ===
                    String(fileId);

            }
        );


    if (!exists) {

        downloads.push(
            fileId
        );


        localStorage.setItem(
            key,
            JSON.stringify(
                downloads
            )
        );

    }

}


function hasUserDownloaded(
    fileId
) {

    return getUserDownloads()
        .some(
            function (id) {

                return String(id) ===
                    String(fileId);

            }
        );

}


/* ==================================================
                    TOAST
================================================== */

function showFavoriteToast(
    message,
    type
) {

    if (
        typeof window.showToast ===
        "function"
    ) {

        window.showToast(
            message,
            type
        );

        return;

    }


    const container =
        document.getElementById(
            "toastContainer"
        );


    if (!container) {

        return;

    }


    const icons = {

        success: "✅",

        error: "❌",

        warning: "⚠️"

    };


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "toast toast-" +
        (
            type ||
            "success"
        );


    toast.innerHTML = `

        <span class="toast-icon">

            ${icons[type] || "📢"}

        </span>

        <span class="toast-message">

            ${escapeHTML(message)}

        </span>

        <button
            class="toast-close"
            type="button"
        >

            ✕

        </button>

    `;


    const closeButton =
        toast.querySelector(
            ".toast-close"
        );


    closeButton.addEventListener(
        "click",
        function () {

            toast.remove();

        }
    );


    container.appendChild(
        toast
    );


    setTimeout(
        function () {

            if (
                toast.parentElement
            ) {

                toast.style.opacity =
                    "0";

                toast.style.transform =
                    "translateX(40px)";


                setTimeout(
                    function () {

                        if (
                            toast.parentElement
                        ) {

                            toast.remove();

                        }

                    },
                    300
                );

            }

        },
        5000
    );

}


/* ==================================================
                ESCAPE HTML
================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ==================================================
                LOAD FILES
================================================== */

function loadFavoriteFiles() {

    if (
        typeof getAllFilesFromDB !==
        "function"
    ) {

        showFavoriteToast(
            "اتصال به دیتابیس فایل‌ها برقرار نشد",
            "error"
        );

        return;

    }


    getAllFilesFromDB()

        .then(
            function (files) {

                allFavoriteFiles =
                    Array.isArray(files)
                        ? files
                        : [];


                renderFavorites();

            }
        )

        .catch(
            function (error) {

                console.error(
                    "خطا در دریافت فایل‌ها:",
                    error
                );


                allFavoriteFiles =
                    [];


                renderFavorites();


                showFavoriteToast(
                    "خطا در دریافت فایل‌ها",
                    "error"
                );

            }
        );

}


/* ==================================================
                STORAGE CHANGE
================================================== */

window.addEventListener(
    "storage",
    function (event) {

        const key =
            getFavoritesKey();


        if (
            key &&
            event.key === key
        ) {

            updateFavoritesBadge();

            renderFavorites();

        }

    }
);


/* ==================================================
                    INIT
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateHeader();


        /*
            اول دیتابیس را باز می‌کنیم،
            بعد فایل‌ها را می‌گیریم.
        */

        if (
            typeof openPixelDB ===
            "function"
        ) {

            openPixelDB()

                .then(
                    function () {

                        loadFavoriteFiles();

                    }
                )

                .catch(
                    function (error) {

                        console.error(
                            error
                        );


                        showFavoriteToast(
                            "خطا در اتصال به دیتابیس",
                            "error"
                        );

                    }
                );

        } else {

            loadFavoriteFiles();

        }

    }
);