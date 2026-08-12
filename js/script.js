"use strict";

/* ======================================
            PIXELCODE
            HEADER SCRIPT
====================================== */


/* ======================================
            ELEMENTS
====================================== */

const loginBtn =
    document.getElementById("loginBtn");

const registerBtn =
    document.getElementById("registerBtn");

const profileStatus =
    document.getElementById("profileStatus");

const profileImage =
    document.querySelector(".profile-image");

const profileBox =
    document.getElementById("profileBox");


/* ======================================
            CURRENT USER
====================================== */

let currentUser = null;

try {

    currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );

} catch (error) {

    currentUser = null;

}


/* ======================================
            DEFAULT AVATAR
====================================== */

const defaultAvatar =
    "/pixelcode/images/avatar-default.svg";


/* ======================================
            CHECK ELEMENTS
====================================== */

if (
    profileStatus &&
    loginBtn &&
    registerBtn &&
    profileImage &&
    profileBox
) {


    /* ==================================
                LOGGED IN
    ================================== */

    if (currentUser) {

        profileStatus.textContent =
            currentUser.fullname || "کاربر";


        loginBtn.style.display =
            "none";


        registerBtn.style.display =
            "none";


        profileBox.href =
            "/pixelcode/html/profile.html";


        if (currentUser.avatar) {

            profileImage.src =
                currentUser.avatar;

        } else {

            profileImage.src =
                defaultAvatar;

        }

    }


    /* ==================================
                LOGGED OUT
    ================================== */

    else {

        profileStatus.textContent =
            "ثبت نام نکرده‌ای";


        loginBtn.style.display =
            "inline-flex";


        registerBtn.style.display =
            "inline-flex";


        profileBox.href =
            "/pixelcode/html/profile.html";


        profileImage.src =
            defaultAvatar;

    }

}
