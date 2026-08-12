"use strict";

/*==================================================
                PIXELCODE SUPPORT ADMIN
==================================================*/

/*==============================
        ELEMENTS
==============================*/

const ticketList = document.getElementById("ticketList");

const totalTickets = document.getElementById("totalTickets");
const openTickets = document.getElementById("openTickets");
const answeredTickets = document.getElementById("answeredTickets");
const closedTickets = document.getElementById("closedTickets");

const ticketSearch = document.getElementById("ticketSearch");
const filterButtons = document.querySelectorAll(".filter-btn");

const chatMessages = document.getElementById("chatMessages");

const ticketUserName = document.getElementById("ticketUserName");
const ticketStatus = document.getElementById("ticketStatus");

const ticketId = document.getElementById("ticketId");
const ticketTitle = document.getElementById("ticketTitle");
const ticketCategory = document.getElementById("ticketCategory");
const ticketPriority = document.getElementById("ticketPriority");

const refreshTicket = document.getElementById("refreshTicket");
const changeStatus = document.getElementById("changeStatus");
const closeTicket = document.getElementById("closeTicket");
const deleteTicket = document.getElementById("deleteTicket");

const messageInput = document.getElementById("messageInput");
const sendMessageBtn = document.getElementById("sendMessageBtn");

const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");

const imageInput = document.getElementById("imageInput");
const fileInput = document.getElementById("fileInput");

const selectedFiles = document.getElementById("selectedFiles");

const replyPreview = document.getElementById("replyPreview");
const replyContent = document.getElementById("replyContent");
const cancelReply = document.getElementById("cancelReply");

const imageModal = document.getElementById("imageModal");
const previewImage = document.getElementById("previewImage");
const closeImageModal = document.getElementById("closeImageModal");

const toastContainer = document.getElementById("toastContainer");


/*==============================
        STORAGE
==============================*/

const STORAGE_KEY = "pixelcode_support_tickets";


/*==============================
        VARIABLES
==============================*/

let tickets = [];
let currentTicket = null;

let currentFilter = "all";

let pendingFiles = [];
let replyMessageId = null;


/*==============================
        LOAD / SAVE
==============================*/

function loadTickets() {

    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {

        tickets = [];

        return;

    }

    try {

        tickets = JSON.parse(data);

    }

    catch {

        tickets = [];

    }

}

function saveTickets() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(tickets)

    );

}


/*==============================
        HELPERS
==============================*/

function generateId() {

    return Date.now() + Math.floor(Math.random() * 9999);

}

function getCurrentDate() {

    return new Date().toLocaleString("fa-IR");

}

function showToast(text, type = "success") {

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.textContent = text;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {

        toast.classList.add("show");

    });

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3000);

}

/*==================================================
                STATUS
==================================================*/

function getStatusText(status) {

    switch (status) {

        case "open":
            return "باز";

        case "answered":
            return "پاسخ داده شده";

        case "closed":
            return "بسته شده";

        default:
            return "-";

    }

}

function getPriorityText(priority) {

    switch (priority) {

        case "کم":
            return "🟢 کم";

        case "متوسط":
            return "🟡 متوسط";

        case "زیاد":
            return "🟠 زیاد";

        case "فوری":
            return "🔴 فوری";

        default:
            return "-";

    }

}

function getPriorityClass(priority) {

    switch (priority) {

        case "کم":
            return "priority-low";

        case "متوسط":
            return "priority-medium";

        case "زیاد":
            return "priority-high";

        case "فوری":
            return "priority-urgent";

        default:
            return "";

    }

}


/*==================================================
                STATISTICS
==================================================*/

function updateStats() {

    totalTickets.textContent = tickets.length;

    openTickets.textContent = tickets.filter(
        ticket => ticket.status === "open"
    ).length;

    answeredTickets.textContent = tickets.filter(
        ticket => ticket.status === "answered"
    ).length;

    closedTickets.textContent = tickets.filter(
        ticket => ticket.status === "closed"
    ).length;

}


/*==================================================
                RENDER TICKET LIST
==================================================*/

function renderTicketList() {

    ticketList.innerHTML = "";

    let list = [...tickets];

    const search = ticketSearch.value.trim().toLowerCase();

    if (search) {

        list = list.filter(ticket => {

            return (

                (ticket.title || "").toLowerCase().includes(search) ||

                (ticket.description || "").toLowerCase().includes(search) ||

                (ticket.category || "").toLowerCase().includes(search)

            );

        });

    }

    if (currentFilter !== "all") {

        list = list.filter(ticket => ticket.status === currentFilter);

    }

    list.sort((a, b) => b.id - a.id);

    if (list.length === 0) {

        ticketList.innerHTML = `

            <div class="empty-list">

                <i class="ri-inbox-line"></i>

                <h3>تیکتی پیدا نشد</h3>

            </div>

        `;

        return;

    }

    list.forEach(ticket => {

        const item = document.createElement("div");

        item.className = "ticket-item";

        if (currentTicket && currentTicket.id === ticket.id) {

            item.classList.add("active");

        }

        item.innerHTML = `

            <div class="ticket-top">

                <h3>${ticket.title}</h3>

                <span class="ticket-status ${ticket.status}">

                    ${getStatusText(ticket.status)}

                </span>

            </div>

            <div class="ticket-middle">

                <span>${ticket.category}</span>

                <span class="${getPriorityClass(ticket.priority)}">

                    ${getPriorityText(ticket.priority)}

                </span>

            </div>

            <div class="ticket-bottom">

                <small>${ticket.date}</small>

            </div>

        `;

        item.addEventListener("click", () => {

            openTicket(ticket.id);

        });

        ticketList.appendChild(item);

    });

}

/*==================================================
                OPEN TICKET
==================================================*/

function openTicket(id) {

    const ticket = tickets.find(ticket => ticket.id === id);

    if (!ticket) return;

    currentTicket = ticket;

    ticketUserName.textContent = ticket.userName || "کاربر";

    ticketStatus.textContent = getStatusText(ticket.status);

    ticketId.textContent = ticket.id;

    ticketTitle.textContent = ticket.title;

    ticketCategory.textContent = ticket.category;

    ticketPriority.textContent = getPriorityText(ticket.priority);

    renderTicketList();

    renderMessages();

}


/*==================================================
                SEARCH
==================================================*/

ticketSearch.addEventListener("input", function () {

    renderTicketList();

});


/*==================================================
                FILTER
==================================================*/

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTicketList();

    });

});

/*==================================================
                RENDER MESSAGES
==================================================*/

function renderMessages() {

    if (!currentTicket) {

        chatMessages.innerHTML = `

            <div class="empty-chat">

                <i class="ri-chat-3-line"></i>

                <h3>هیچ تیکتی انتخاب نشده</h3>

                <p>از سمت راست یک تیکت را انتخاب کنید.</p>

            </div>

        `;

        return;

    }

    chatMessages.innerHTML = "";

    if (!currentTicket.messages || currentTicket.messages.length === 0) {

        chatMessages.innerHTML = `

            <div class="empty-chat">

                <i class="ri-message-2-line"></i>

                <h3>هنوز پیامی وجود ندارد</h3>

            </div>

        `;

        return;

    }

    currentTicket.messages.forEach(message => {

        const box = document.createElement("div");

        box.className = `message ${message.sender}`;

        /*==============================
                    Reply
        ==============================*/

        let replyHTML = "";

        if (message.reply) {

            const replied = currentTicket.messages.find(

                m => m.id === message.reply

            );

            if (replied) {

                replyHTML = `

                    <div class="message-reply">

                        <strong>پاسخ به</strong>

                        <p>${replied.text}</p>

                    </div>

                `;

            }

        }

        /*==============================
                    Files
        ==============================*/

        let filesHTML = "";

        if (message.files && message.files.length) {

            message.files.forEach(file => {

                if (file.type === "image") {

                    filesHTML += `

                        <img
                            class="message-image"
                            src="${file.src}"
                            onclick="openImageModal('${file.src}')"
                        >

                    `;

                }

                else {

                    filesHTML += `

                        <a
                            class="message-file"
                            href="${file.src}"
                            target="_blank"
                        >

                            <i class="ri-file-line"></i>

                            ${file.name}

                        </a>

                    `;

                }

            });

        }

        /*==============================
                    Message
        ==============================*/

        box.innerHTML = `

            <div class="message-content">

                <div class="message-header">

                    <strong>

                        ${message.sender === "admin"

                            ? "پشتیبانی"

                            : "کاربر"}

                    </strong>

                </div>

                ${replyHTML}

                <div class="message-text">

                    ${message.text}

                </div>

                ${filesHTML}

                <div class="message-time">

                    ${message.time}

                </div>

            </div>

        `;

        /*==============================
                Double Click Reply
        ==============================*/

        box.addEventListener("dblclick", () => {

            if (currentTicket.status === "closed") {

                showToast("این تیکت بسته شده است.","error");

                return;

            }

            replyMessageId = message.id;

            replyContent.textContent = message.text;

            replyPreview.classList.remove("hidden");

            messageInput.focus();

        });

        chatMessages.appendChild(box);

    });

    chatMessages.scrollTop = chatMessages.scrollHeight;

}

/*==================================================
                REPLY SYSTEM
==================================================*/

function clearReply() {

    replyMessageId = null;

    replyContent.textContent = "";

    replyPreview.classList.add("hidden");

}

cancelReply.addEventListener("click", function () {

    clearReply();

});

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        clearReply();

    }

});

/*==================================================
                EMOJI PICKER
==================================================*/

const emojis = [

    "😀","😁","😂","🤣","😅","😊","😍","🥰","😘","😎",
    "🤔","😐","😭","😡","🥳","😇",
    "❤️","💙","💚","💛","🖤","🤍","💜",
    "👍","👎","👏","🙏","👌","🤝","💪",
    "🔥","⭐","✨","💻","📱","📎","🎉","🚀"

];

function buildEmojiPicker() {

    emojiPicker.innerHTML = "";

    emojis.forEach(emoji => {

        const button = document.createElement("button");

        button.type = "button";

        button.className = "emoji-item";

        button.textContent = emoji;

        button.addEventListener("click", function () {

            messageInput.value += emoji;

            messageInput.focus();

            emojiPicker.classList.remove("show");

        });

        emojiPicker.appendChild(button);

    });

}


/*==============================
        OPEN / CLOSE
==============================*/

emojiBtn.addEventListener("click", function (e) {

    e.stopPropagation();

    emojiPicker.classList.toggle("show");

});


document.addEventListener("click", function (e) {

    if (

        !emojiPicker.contains(e.target) &&
        !emojiBtn.contains(e.target)

    ) {

        emojiPicker.classList.remove("show");

    }

});

/*==================================================
                IMAGE UPLOAD
==================================================*/

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {

        pendingFiles.push({

            type: "image",

            name: file.name,

            src: reader.result

        });

        renderPendingFiles();

    };

    reader.readAsDataURL(file);

    imageInput.value = "";

});


/*==================================================
                FILE UPLOAD
==================================================*/

fileInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {

        pendingFiles.push({

            type: "file",

            name: file.name,

            src: reader.result

        });

        renderPendingFiles();

    };

    reader.readAsDataURL(file);

    fileInput.value = "";

});


/*==================================================
            PENDING FILES
==================================================*/

function renderPendingFiles() {

    selectedFiles.innerHTML = "";

    if (pendingFiles.length === 0) return;

    pendingFiles.forEach((file, index) => {

        const item = document.createElement("div");

        item.className = "selected-file";

        if (file.type === "image") {

            item.innerHTML = `

                <img
                    class="pending-image"
                    src="${file.src}"
                >

                <span>${file.name}</span>

                <button
                    class="remove-file"
                    data-index="${index}"
                >
                    <i class="ri-close-line"></i>
                </button>

            `;

        } else {

            item.innerHTML = `

                <i class="ri-file-line"></i>

                <span>${file.name}</span>

                <button
                    class="remove-file"
                    data-index="${index}"
                >
                    <i class="ri-close-line"></i>
                </button>

            `;

        }

        selectedFiles.appendChild(item);

    });

}


/*==================================================
            REMOVE FILE
==================================================*/

selectedFiles.addEventListener("click", function (e) {

    const button = e.target.closest(".remove-file");

    if (!button) return;

    const index = Number(button.dataset.index);

    pendingFiles.splice(index, 1);

    renderPendingFiles();

});

/*==================================================
                SEND MESSAGE
==================================================*/

function sendMessage() {

    if (!currentTicket) {

        showToast("ابتدا یک تیکت انتخاب کنید.", "error");

        return;

    }

    if (currentTicket.status === "closed") {

        showToast("این تیکت بسته شده است.", "error");

        return;

    }

    const text = messageInput.value.trim();

    if (text === "" && pendingFiles.length === 0) {

        return;

    }

    const message = {

        id: generateId(),

        sender: "admin",

        text: text === "" ? "(فایل ارسال شد)" : text,

        time: getCurrentDate(),

        files: [...pendingFiles],

        reply: replyMessageId

    };

    if (!currentTicket.messages) {

        currentTicket.messages = [];

    }

    currentTicket.messages.push(message);

    if (currentTicket.status === "open") {

        currentTicket.status = "answered";

    }

    saveTickets();

    renderMessages();

    renderTicketList();

    updateStats();

    ticketStatus.textContent = getStatusText(currentTicket.status);

    messageInput.value = "";

    pendingFiles = [];

    renderPendingFiles();

    clearReply();

}

sendMessageBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", function (e) {

    if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();

        sendMessage();

    }

});

/*==================================================
                DOWNLOAD FILE
==================================================*/

window.downloadFile = function (src, name) {

    const link = document.createElement("a");

    link.href = src;
    link.download = name;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

};


/*==================================================
                IMAGE MODAL
==================================================*/

window.openImageModal = function (src) {

    previewImage.src = src;

    imageModal.classList.remove("hidden");

};

closeImageModal.addEventListener("click", function () {

    imageModal.classList.add("hidden");

});

imageModal.addEventListener("click", function (e) {

    if (e.target === imageModal) {

        imageModal.classList.add("hidden");

    }

});


/*==================================================
                CHANGE STATUS
==================================================*/

changeStatus.addEventListener("click", function () {

    if (!currentTicket) return;

    const statuses = ["open","answered","closed"];

    const index = statuses.indexOf(currentTicket.status);

    currentTicket.status = statuses[(index + 1) % statuses.length];

    saveTickets();

    ticketStatus.textContent = getStatusText(currentTicket.status);

    renderTicketList();

    updateStats();

});


/*==================================================
                CLOSE TICKET
==================================================*/

closeTicket.addEventListener("click", function () {

    if (!currentTicket) return;

    currentTicket.status = "closed";

    saveTickets();

    ticketStatus.textContent = getStatusText(currentTicket.status);

    renderTicketList();

    updateStats();

});


/*==================================================
                DELETE TICKET
==================================================*/

deleteTicket.addEventListener("click", function () {

    if (!currentTicket) return;

    if (!confirm("آیا از حذف این تیکت مطمئن هستید؟")) return;

    tickets = tickets.filter(

        ticket => ticket.id !== currentTicket.id

    );

    saveTickets();

    currentTicket = null;

    renderTicketList();

    renderMessages();

    updateStats();

});


/*==================================================
                REFRESH
==================================================*/

refreshTicket.addEventListener("click", function () {

    loadTickets();

    if (currentTicket) {

        currentTicket = tickets.find(

            t => t.id === currentTicket.id

        );

    }

    renderTicketList();

    renderMessages();

    updateStats();

});


/*==================================================
                INIT
==================================================*/

loadTickets();

updateStats();

renderTicketList();

renderMessages();

buildEmojiPicker();