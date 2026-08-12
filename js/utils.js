function generateId(){

    return Date.now() + Math.floor(Math.random() * 1000);

}

function formatDate(){

    return new Date().toLocaleDateString("fa-IR");

}

function getUsers(){

    return JSON.parse(localStorage.getItem("users")) || [];

}

function saveUsers(users){

    localStorage.setItem(

        "users",

        JSON.stringify(users)

    );

}

function getCurrentUser(){

    return JSON.parse(localStorage.getItem("currentUser"));

}

function saveCurrentUser(user){

    localStorage.setItem(

        "currentUser",

        JSON.stringify(user)

    );

}

function logout(){

    localStorage.removeItem("currentUser");

    window.location.href="login.html";

}

function copyText(text){

    navigator.clipboard.writeText(text);

    showToast("متن کپی شد.","success");

}

function randomString(length=8){

    const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result="";

    for(let i=0;i<length;i++){

        result+=chars[Math.floor(Math.random()*chars.length)];

    }

    return result;

}