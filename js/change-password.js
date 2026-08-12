"use strict";

/*======================================
        PIXELCODE
      CHANGE PASSWORD
======================================*/

/*======================================
            ELEMENTS
======================================*/

const form =
    document.getElementById("changePasswordForm");

const currentPasswordInput =
    document.getElementById("currentPassword");

const newPasswordInput =
    document.getElementById("newPassword");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const toggleCurrentPassword =
    document.getElementById("toggleCurrentPassword");

const toggleNewPassword =
    document.getElementById("toggleNewPassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");

const userAvatar =
    document.getElementById("userAvatar");

const userFullname =
    document.getElementById("userFullname");

const userUsername =
    document.getElementById("userUsername");

/*======================================
        LOCAL STORAGE
======================================*/

let currentUser =
    JSON.parse(
        localStorage.getItem("currentUser")
    );

let users =
    JSON.parse(
        localStorage.getItem("users")
    ) || [];

/*======================================
        CHECK LOGIN
======================================*/

if (!currentUser) {

    window.location.href =
        "login.html";

}

/*======================================
        LOAD PROFILE
======================================*/

userAvatar.src =
    currentUser.avatar;

userFullname.textContent =
    currentUser.fullname;

userUsername.textContent =
    "@" + currentUser.username;

/*======================================
        SHOW PASSWORD
======================================*/

function togglePassword(input) {

    input.type =

        input.type === "password"

        ?

        "text"

        :

        "password";

}

toggleCurrentPassword.addEventListener(

    "click",

    function () {

        togglePassword(

            currentPasswordInput

        );

    }

);

toggleNewPassword.addEventListener(

    "click",

    function () {

        togglePassword(

            newPasswordInput

        );

    }

);

toggleConfirmPassword.addEventListener(

    "click",

    function () {

        togglePassword(

            confirmPasswordInput

        );

    }

);

/*======================================
        CHANGE PASSWORD
======================================*/

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const currentPassword =
        currentPasswordInput.value.trim();

    const newPassword =
        newPasswordInput.value.trim();

    const confirmPassword =
        confirmPasswordInput.value.trim();

    /*==========================
            EMPTY
    ==========================*/

    if (

        currentPassword === "" ||

        newPassword === "" ||

        confirmPassword === ""

    ) {

        showToast(

            "تمام فیلدها را تکمیل کنید",

            "error"

        );

        currentPasswordInput.focus();

        return;

    }

    /*==========================
        CURRENT PASSWORD
    ==========================*/

    if (

        currentPassword !==

        currentUser.password

    ) {

        showToast(

            "رمز عبور فعلی اشتباه است",

            "error"

        );

        currentPasswordInput.focus();

        return;

    }

    /*==========================
        PASSWORD LENGTH
    ==========================*/

    if (

        newPassword.length < 8

    ) {

        showToast(

            "رمز عبور باید حداقل ۸ کاراکتر باشد",

            "error"

        );

        newPasswordInput.focus();

        return;

    }

    /*==========================
        SAME PASSWORD
    ==========================*/

    if (

        newPassword === currentPassword

    ) {

        showToast(

            "رمز جدید نباید با رمز قبلی یکسان باشد",

            "error"

        );

        newPasswordInput.focus();

        return;

    }

    /*==========================
        CONFIRM PASSWORD
    ==========================*/

    if (

        newPassword !== confirmPassword

    ) {

        showToast(

            "تکرار رمز عبور صحیح نیست",

            "error"

        );

        confirmPasswordInput.focus();

        return;

    }

    /*==========================
            UPDATE PASSWORD
    ==========================*/

    currentUser.password =
        newPassword;


    /*==========================
            UPDATE USERS ARRAY
    ==========================*/

    const userIndex =

        users.findIndex(

            user =>

            user.username === currentUser.username

        );


    if (userIndex !== -1) {

        users[userIndex].password =
            newPassword;

    }


    /*==========================
            SAVE STORAGE
    ==========================*/

    localStorage.setItem(

        "currentUser",

        JSON.stringify(currentUser)

    );


    localStorage.setItem(

        "users",

        JSON.stringify(users)

    );


    /*==========================
            SUCCESS
    ==========================*/

    showToast(

        "رمز عبور با موفقیت تغییر کرد",

        "success"

    );


    form.reset();


});