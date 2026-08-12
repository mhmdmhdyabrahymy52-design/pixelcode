/*======================================
        PIXELCODE LOGIN
======================================*/

const loginForm = document.getElementById("loginForm");

const usernameInput = document.getElementById("username");

const passwordInput = document.getElementById("password");

const rememberMe = document.getElementById("rememberMe");

const togglePassword = document.getElementById("togglePassword");

const loginBtn = document.getElementById("loginBtn");

/*======================================
            REGEX
======================================*/

const usernameRegex =

/^[A-Za-z0-9._]+$/;

const emailRegex =

/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*======================================
        USERS
======================================*/

function getUsers(){

    return JSON.parse(

        localStorage.getItem("users")

    ) || [];

}

/*======================================
        LOADING BUTTON
======================================*/

function startLoading(){

    loginBtn.disabled = true;

    loginBtn.innerHTML = `

        <span class="loader"></span>

        در حال ورود...

    `;

}

function stopLoading(){

    loginBtn.disabled = false;

    loginBtn.innerHTML = "ورود به حساب";

}

/*======================================
        SHOW PASSWORD
======================================*/

togglePassword.addEventListener(

    "click",

    function(){

        passwordInput.type =

        passwordInput.type==="password"

        ?

        "text"

        :

        "password";

    }

);

/*======================================
        LOAD REMEMBER ME
======================================*/

window.addEventListener(

    "DOMContentLoaded",

    function(){

        const remembered =

        localStorage.getItem(

            "rememberUser"

        );

        if(remembered){

            usernameInput.value =

            remembered;

            rememberMe.checked = true;

        }

    }

);

/*======================================
            LOGIN
======================================*/

loginForm.addEventListener(

    "submit",

    function(e){

        e.preventDefault();

        startLoading();

        const username =

        usernameInput.value.trim();

        const password =

        passwordInput.value;

                /*==========================
            نام کاربری یا ایمیل
        ==========================*/

        if(username===""){

            showToast(

                "نام کاربری یا ایمیل را وارد کنید",

                "error"

            );

            stopLoading();

            usernameInput.focus();

            return;

        }

        /*==========================
        اگر ایمیل نیست باید انگلیسی باشد
        ==========================*/

        if(

            !emailRegex.test(username)

            &&

            !usernameRegex.test(username)

        ){

            showToast(

                "نام کاربری فقط باید انگلیسی باشد",

                "error"

            );

            usernameInput.classList.add(

                "input-error"

            );

            setTimeout(function(){

                usernameInput.classList.remove(

                    "input-error"

                );

            },2000);

            stopLoading();

            usernameInput.focus();

            return;

        }

        /*==========================
                رمز
        ==========================*/

        if(password===""){

            showToast(

                "رمز عبور را وارد کنید",

                "error"

            );

            stopLoading();

            passwordInput.focus();

            return;

        }

        if(password.length<8){

            showToast(

                "رمز عبور باید حداقل ۸ کاراکتر باشد",

                "error"

            );

            stopLoading();

            passwordInput.focus();

            return;

        }

        /*==========================
            کاربران
        ==========================*/

        const users = getUsers();

        const user = users.find(

            u =>

            u.username===username ||

            u.email===username.toLowerCase()

        );

        if(!user){

            showToast(

                "کاربری پیدا نشد",

                "error"

            );

            stopLoading();

            usernameInput.focus();

            return;

        }

        if(user.password!==password){

            showToast(

                "رمز عبور اشتباه است",

                "error"

            );

            stopLoading();

            passwordInput.focus();

            return;

        }

        if(user.status==="مسدود"){

            showToast(

                "حساب شما مسدود شده است",

                "error"

            );

            stopLoading();

            return;

        }

                /*==========================
            Remember Me
        ==========================*/

        if(rememberMe.checked){

            localStorage.setItem(

                "rememberUser",

                username

            );

        }else{

            localStorage.removeItem(

                "rememberUser"

            );

        }

        /*==========================
            مدیر
        ==========================*/

        if(user.email==="mhmdmhdyabrahymy52@gmail.com"){

            user.role="مدیر";

            user.permissions={

                dashboard:true,

                users:true,

                media:true,

                home:true,

                prompts:true,

                settings:true

            };

            users[

                users.findIndex(

                    u=>u.id===user.id

                )

            ]=user;

            localStorage.setItem(

                "users",

                JSON.stringify(users)

            );

        }

        /*==========================
            ذخیره ورود
        ==========================*/

        localStorage.setItem(

            "currentUser",

            JSON.stringify(user)

        );

        localStorage.setItem(

            "isLoggedIn",

            "true"

        );

        /*==========================
            موفق
        ==========================*/

        showToast(

            "ورود با موفقیت انجام شد",

            "success"

        );

        setTimeout(function(){

            stopLoading();

            window.location.href="index.html";

        },1200);

});