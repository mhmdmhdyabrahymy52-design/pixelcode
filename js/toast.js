const toastContainer = document.createElement("div");

toastContainer.id = "toast";

document.body.appendChild(toastContainer);

function showToast(message,type="success",duration=4000){

    const icons={

        success:"✔",

        error:"✖",

        warning:"⚠",

        info:"ℹ"

    };

    const toast=document.createElement("div");

    toast.className=`toast ${type}`;

    toast.innerHTML=`

        <div class="toast-icon">

            ${icons[type]}

        </div>

        <div class="toast-content">

            <div class="toast-message">

                ${message}

            </div>

            <div class="toast-progress"></div>

        </div>

        <button class="toast-close">

            ×

        </button>

    `;

    toastContainer.appendChild(toast);

    requestAnimationFrame(()=>{

        toast.classList.add("show");

    });

    const progress=toast.querySelector(".toast-progress");

    progress.style.animationDuration=`${duration}ms`;

    const removeToast=()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },350);

    };

    toast.querySelector(".toast-close").onclick=removeToast;

    setTimeout(removeToast,duration);

}