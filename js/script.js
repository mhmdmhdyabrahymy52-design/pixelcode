const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const profileStatus = document.getElementById("profileStatus");
const profileImage = document.querySelector(".profile-image");
const profileBox = document.getElementById("profileBox");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser) {

    profileStatus.textContent = currentUser.fullname;

    loginBtn.style.display = "none";

    registerBtn.style.display = "none";

    profileBox.href = "profile.html";

    if (currentUser.avatar) {
        profileImage.src = currentUser.avatar;
    }

} else {

    profileStatus.textContent = "ثبت نام نکرده‌ای";

    loginBtn.style.display = "inline-flex";

    registerBtn.style.display = "inline-flex";

    profileImage.src = "../images/avatar-default.svg";

}