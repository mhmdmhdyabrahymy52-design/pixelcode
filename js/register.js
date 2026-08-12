/*======================================
            PIXELCODE REGISTER
======================================*/

const registerForm = document.getElementById("registerForm");

const fullnameInput = document.getElementById("fullname");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const termsInput = document.getElementById("acceptTerms");

const togglePasswordBtn = document.getElementById("togglePassword");
const toggleConfirmPasswordBtn = document.getElementById("toggleConfirmPassword");

/*======================================
            REGEX
======================================*/

const usernameRegex = /^[A-Za-z0-9._]+$/;

const emailRegex =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneRegex =
/^09\d{9}$/;

/*======================================
        SHOW PASSWORD
======================================*/

togglePasswordBtn.addEventListener("click",function(){

    passwordInput.type=

        passwordInput.type==="password"

        ?

        "text"

        :

        "password";

});

toggleConfirmPasswordBtn.addEventListener("click",function(){

    confirmPasswordInput.type=

        confirmPasswordInput.type==="password"

        ?

        "text"

        :

        "password";

});

/*======================================
            USERS
======================================*/

function getUsers(){

    return JSON.parse(

        localStorage.getItem("users")

    ) || [];

}

function saveUsers(users){

    localStorage.setItem(

        "users",

        JSON.stringify(users)

    );

}

/*======================================
        REGISTER FORM
======================================*/

registerForm.addEventListener("submit",function(e){

    e.preventDefault();

    const fullname=fullnameInput.value.trim();

    const username=usernameInput.value.trim();

    const email=emailInput.value.trim().toLowerCase();

    const phone=phoneInput.value.trim();

    const password=passwordInput.value;

    const confirmPassword=confirmPasswordInput.value;

    /*=========================
            نام
    =========================*/

    if(fullname===""){

        showToast(

            "نام و نام خانوادگی را وارد کنید",

            "error"

        );

        fullnameInput.focus();

        return;

    }

    /*=========================
        نام کاربری
    =========================*/

    if(username===""){

        showToast(

            "نام کاربری را وارد کنید",

            "error"

        );

        usernameInput.focus();

        return;

    }

    if(!usernameRegex.test(username)){

        showToast(

            "نام کاربری فقط باید انگلیسی باشد",

            "error"

        );

        usernameInput.classList.add("input-error");

        setTimeout(()=>{

            usernameInput.classList.remove("input-error");

        },2000);

        usernameInput.focus();

        return;

    }

    if(username.length<3){

        showToast(

            "نام کاربری حداقل ۳ کاراکتر باشد",

            "error"

        );

        usernameInput.focus();

        return;

    }

    /*=========================
            ایمیل
    =========================*/

    if(email===""){

        showToast(

            "ایمیل را وارد کنید",

            "error"

        );

        emailInput.focus();

        return;

    }

    if(!emailRegex.test(email)){

        showToast(

            "ایمیل معتبر نیست",

            "error"

        );

        emailInput.focus();

        return;

    }

    /*=========================
            موبایل
    =========================*/

    if(!phoneRegex.test(phone)){

        showToast(

            "شماره موبایل صحیح نیست",

            "error"

        );

        phoneInput.focus();

        return;

    }

    /*=========================
            رمز
    =========================*/

    if(password.length<8){

        showToast(

            "رمز عبور باید حداقل ۸ کاراکتر باشد",

            "error"

        );

        passwordInput.focus();

        return;

    }

    if(password!==confirmPassword){

        showToast(

            "تکرار رمز عبور صحیح نیست",

            "error"

        );

        confirmPasswordInput.focus();

        return;

    }

    /*=========================
            قوانین
    =========================*/

    if(!termsInput.checked){

        showToast(

            "ابتدا قوانین را بپذیرید",

            "error"

        );

        return;

    }

        /*=========================
        دریافت کاربران
    =========================*/

    let users = getUsers();

    /*=========================
        نام کاربری تکراری
    =========================*/

    if(users.some(user=>user.username===username)){

        showToast(

            "این نام کاربری قبلاً ثبت شده است",

            "error"

        );

        usernameInput.focus();

        return;

    }

    /*=========================
        ایمیل تکراری
    =========================*/

    if(users.some(user=>user.email===email)){

        showToast(

            "این ایمیل قبلاً ثبت شده است",

            "error"

        );

        emailInput.focus();

        return;

    }

    /*=========================
        شناسه عمومی
    =========================*/

    const publicId =

        "PC-" +

        String(users.length+1).padStart(6,"0");

    /*=========================
            مدیر
    =========================*/

    const isAdmin =

        email==="mhmdmhdyabrahymy52@gmail.com";

    /*=========================
        ساخت کاربر
    =========================*/

    const newUser={

        id:Date.now(),

        publicId,

        fullname,

        username,

        email,

        phone,

        password,

        avatar:"../images/avatar-default.svg",

        role:isAdmin ? "مدیر" : "کاربر",

        status:"فعال",

        permissions:{

            dashboard:isAdmin,

            users:isAdmin,

            media:isAdmin,

            home:isAdmin,

            prompts:isAdmin,

            settings:isAdmin

        },

        createdAt:new Date().toLocaleDateString("fa-IR")

    };

    /*=========================
            ذخیره
    =========================*/

    users.push(newUser);

    saveUsers(users);

    /*=========================
        ورود خودکار
    =========================*/

    localStorage.setItem(

        "currentUser",

        JSON.stringify(newUser)

    );

    localStorage.setItem(

        "isLoggedIn",

        "true"

    );

    showToast(

        "ثبت نام با موفقیت انجام شد",

        "success"

    );

    setTimeout(()=>{

        window.location.href="login.html";

    },1200);

});