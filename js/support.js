"use strict";

/*======================================
            ELEMENTS
======================================*/

const ticketList = document.getElementById("ticketList");
const ticketCount = document.getElementById("ticketCount");

const ticketSearch = document.getElementById("ticketSearch");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const chatMessages =
    document.getElementById("chatMessages");

const ticketTitle =
    document.getElementById("ticketTitle");

const ticketStatus =
    document.getElementById("ticketStatus");

const messageInput =
    document.getElementById("messageInput");

const sendMessageBtn =
    document.getElementById("sendMessageBtn");

const refreshChat =
    document.getElementById("refreshChat");

const closeTicket =
    document.getElementById("closeTicket");

const newTicketBtn =
    document.getElementById("newTicketBtn");

const newTicketModal =
    document.getElementById("newTicketModal");

const closeModal =
    document.getElementById("closeModal");

const cancelTicket =
    document.getElementById("cancelTicket");

const createTicket =
    document.getElementById("createTicket");

const ticketTitleInput =
    document.getElementById("ticketTitleInput");

const ticketCategory =
    document.getElementById("ticketCategory");

const ticketPriority =
    document.getElementById("ticketPriority");

const ticketDescription =
    document.getElementById("ticketDescription");

const emojiBtn =
    document.getElementById("emojiBtn");

const emojiPicker =
    document.getElementById("emojiPicker");

const imageInput =
    document.getElementById("imageInput");

const fileInput =
    document.getElementById("fileInput");

const selectedFiles =
    document.getElementById("selectedFiles");

const replyPreview =
    document.getElementById("replyPreview");

const replyContent =
    document.getElementById("replyContent");

const cancelReply =
    document.getElementById("cancelReply");


/*======================================
            STORAGE
======================================*/

const STORAGE_KEY = "pixelcode_support_tickets";


/*======================================
            VARIABLES
======================================*/

let tickets = JSON.parse(
    localStorage.getItem(STORAGE_KEY)
) || [];

let currentTicket = null;

let replyMessageId = null;

let pendingFiles = [];

let currentFilter = "all";

/*======================================
            HELPERS
======================================*/

function saveTickets() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tickets)
    );

}

function generateId() {

    return Date.now() + Math.floor(Math.random() * 1000);

}

function getCurrentDate() {

    return new Date().toLocaleString("fa-IR");

}

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


/*======================================
            MODAL
======================================*/

function openModal() {

    newTicketModal.classList.add("active");

}

function closeTicketModal() {

    newTicketModal.classList.remove("active");

    ticketTitleInput.value = "";

    ticketDescription.value = "";

    ticketCategory.value = "عمومی";

    ticketPriority.value = "کم";

}


/*======================================
            EVENTS
======================================*/

newTicketBtn.onclick = openModal;

closeModal.onclick = closeTicketModal;

cancelTicket.onclick = closeTicketModal;

window.onclick = function (e) {

    if (e.target === newTicketModal) {

        closeTicketModal();

    }

};


/*======================================
            INIT
======================================*/

ticketCount.textContent = tickets.length;
/*======================================
            CREATE TICKET
======================================*/

createTicket.onclick = function () {

    const title = ticketTitleInput.value.trim();

    const description = ticketDescription.value.trim();

    if (!title) {

        alert("عنوان تیکت را وارد کنید.");

        return;

    }

    if (!description) {

        alert("توضیحات تیکت را وارد کنید.");

        return;

    }

    const ticket = {

        id: generateId(),

        title: title,

        category: ticketCategory.value,

        priority: ticketPriority.value,

        description: description,

        status: "open",

        date: getCurrentDate(),

        messages: [

            {

                id: generateId(),

                sender: "user",

                text: description,

                time: getCurrentDate(),

                files: [],

                reply: null

            }

        ]

    };

    tickets.unshift(ticket);

    saveTickets();

    ticketCount.textContent = tickets.length;

    closeTicketModal();

    renderTicketList();

    openTicket(ticket.id);

};

/*======================================
            RENDER TICKETS
======================================*/

function renderTicketList() {

    ticketList.innerHTML = "";

    let list = [...tickets];

    // سرچ
    const search = ticketSearch.value.trim();

    if (search !== "") {

        list = list.filter(ticket =>

            ticket.title.includes(search) ||

            ticket.description.includes(search)

        );

    }

    // فیلتر
    if (currentFilter !== "all") {

        list = list.filter(ticket => ticket.status === currentFilter);

    }

    ticketCount.textContent = list.length;

    if (list.length === 0) {

        ticketList.innerHTML = `

        <div class="empty-chat">

            <i class="ri-inbox-line"></i>

            <p>تیکتی پیدا نشد.</p>

        </div>

        `;

        return;

    }

    list.forEach(ticket => {

        const item = document.createElement("div");

        item.className =
            "ticket-item " +
            getPriorityClass(ticket.priority);

        if (
            currentTicket &&
            currentTicket.id === ticket.id
        ) {

            item.classList.add("active");

        }

        item.innerHTML = `

            <h3>${ticket.title}</h3>

            <div class="ticket-preview">

                ${ticket.description}

            </div>

            <div class="ticket-footer">

                <span class="ticket-date">

                    ${ticket.date}

                </span>

                <span class="ticket-status ${ticket.status}">

                    ${getStatusText(ticket.status)}

                </span>

            </div>

        `;

        item.onclick = () => {

            openTicket(ticket.id);

        };

        ticketList.appendChild(item);

    });

}


/*======================================
            OPEN TICKET
======================================*/

function openTicket(id) {

    currentTicket = tickets.find(

        ticket => ticket.id === id

    );

    if (!currentTicket) return;

    ticketTitle.textContent =
        currentTicket.title;

    ticketStatus.textContent =
        "وضعیت : " +
        getStatusText(currentTicket.status);

    renderTicketList();

    renderMessages();

}


/*======================================
            SEARCH
======================================*/

ticketSearch.addEventListener(

    "input",

    renderTicketList

);


/*======================================
            FILTER
======================================*/

filterButtons.forEach(button => {

    button.onclick = function () {

        filterButtons.forEach(btn =>

            btn.classList.remove("active")

        );

        this.classList.add("active");

        currentFilter = this.dataset.filter;

        renderTicketList();

    };

});

/*======================================
            RENDER MESSAGES
======================================*/

function renderMessages() {

    if (!currentTicket) {

        chatMessages.innerHTML = "";

        return;

    }

    chatMessages.innerHTML = "";

    if (currentTicket.messages.length === 0) {

        chatMessages.innerHTML = `

        <div class="empty-chat">

            <i class="ri-message-3-line"></i>

            <h3>پیامی وجود ندارد</h3>

        </div>

        `;

        return;

    }

    currentTicket.messages.forEach(message => {

        const box = document.createElement("div");

        box.className = "message " + message.sender;

        let filesHTML = "";

        if (message.files && message.files.length > 0) {

            message.files.forEach(file => {

                if (file.type === "image") {

                    filesHTML += `

                    <img
                        class="message-image"
                        src="${file.src}"
                    >

                    `;

                }

                else {

                    filesHTML += `

                    <a
                        href="${file.src}"
                        target="_blank"
                        class="message-file"
                    >

                        <i class="ri-file-line"></i>

                        <span>${file.name}</span>

                    </a>

                    `;

                }

            });

        }

        let replyHTML = "";

        if (message.reply) {

            const replied = currentTicket.messages.find(

                m => m.id === message.reply

            );

            if (replied) {

                replyHTML = `

                <div class="message-reply">

                    <strong>

                        پاسخ به

                    </strong>

                    <p>

                        ${replied.text}

                    </p>

                </div>

                `;

            }

        }

        box.innerHTML = `

        <div class="message-content">

            <div class="message-header">

                <strong>

                    ${
                        message.sender === "user"

                        ?

                        "شما"

                        :

                        "پشتیبانی"

                    }

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

        box.addEventListener("dblclick", () => {

            replyMessageId = message.id;

            replyContent.textContent = message.text;

            replyPreview.classList.remove("hidden");

            messageInput.focus();

        });

        chatMessages.appendChild(box);

    });

    chatMessages.scrollTop = chatMessages.scrollHeight;

}

/*======================================
            SEND MESSAGE
======================================*/

function sendMessage() {

    if (!currentTicket) {

        alert("ابتدا یک تیکت انتخاب کنید.");

        return;

    }

    const text = messageInput.value.trim();

    if (

        text === "" &&

        pendingFiles.length === 0

    ) {

        return;

    }

    const message = {

        id: generateId(),

        sender: "user",

        text: text,

        time: getCurrentDate(),

        files: [...pendingFiles],

        reply: replyMessageId

    };

    currentTicket.messages.push(message);

    saveTickets();

    renderMessages();

    renderTicketList();

    messageInput.value = "";

    pendingFiles = [];

    renderPendingFiles();

    replyMessageId = null;

    replyPreview.classList.add("hidden");

    replyContent.textContent = "";

}


/*======================================
            SEND BUTTON
======================================*/

sendMessageBtn.onclick = sendMessage;


/*======================================
            ENTER SEND
======================================*/

messageInput.addEventListener(

    "keydown",

    function (e) {

        if (

            e.key === "Enter" &&

            !e.shiftKey

        ) {

            e.preventDefault();

            sendMessage();

        }

    }

);


/*======================================
            CANCEL REPLY
======================================*/

cancelReply.onclick = function () {

    replyMessageId = null;

    replyContent.textContent = "";

    replyPreview.classList.add("hidden");

};


/*======================================
            REFRESH
======================================*/

refreshChat.onclick = function () {

    tickets = JSON.parse(

        localStorage.getItem(STORAGE_KEY)

    ) || [];

    if (currentTicket) {

        currentTicket = tickets.find(

            t => t.id === currentTicket.id

        );

    }

    renderTicketList();

    renderMessages();

};


/*======================================
            CLOSE TICKET
======================================*/

closeTicket.onclick = function () {

    if (!currentTicket) return;

    currentTicket.status = "closed";

    saveTickets();

    renderTicketList();

    ticketStatus.textContent =

        "وضعیت : بسته شده";

};

/*======================================
            FILE SELECT
======================================*/

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


/*======================================
        PREVIEW FILES
======================================*/

function renderPendingFiles() {

    selectedFiles.innerHTML = "";

    if (pendingFiles.length === 0) {

        return;

    }

    pendingFiles.forEach((file, index) => {

        const box = document.createElement("div");

        box.className = "selected-file";

        if (file.type === "image") {

            box.innerHTML = `

                <img
                    class="pending-image"
                    src="${file.src}"
                >

                <span>

                    ${file.name}

                </span>

                <button
                    class="remove-file"
                    data-index="${index}"
                >

                    <i class="ri-close-line"></i>

                </button>

            `;

        }

        else {

            box.innerHTML = `

                <i class="ri-file-line"></i>

                <span>

                    ${file.name}

                </span>

                <button
                    class="remove-file"
                    data-index="${index}"
                >

                    <i class="ri-close-line"></i>

                </button>

            `;

        }

        selectedFiles.appendChild(box);

    });

}

const emojis = [

    "😀","😁","😂","🤣","😃","😄","😅","😊","😍","🥰",

    "😘","😎","🤔","🤨","😐","😴","😭","😡","🥳","😇",

    "❤️","💙","💚","💛","🖤","🤍","💜","💖","💯","🔥",

    "👍","👎","👏","🙏","👌","🤝","💪","✌️","👀","🎉",

    "💻","⌨️","🖱️","📱","📂","📎","⚙️","🚀","⭐","✅"

];

function buildEmojiPicker(){

    emojiPicker.innerHTML = "";

    emojis.forEach(emoji=>{

        const btn = document.createElement("button");

        btn.type = "button";

        btn.className = "emoji-item";

        btn.textContent = emoji;

        btn.onclick = ()=>{

            messageInput.value += emoji;

            messageInput.focus();

        };

        emojiPicker.appendChild(btn);

    });

}

emojiBtn.addEventListener("click",()=>{

    emojiPicker.classList.toggle("show");

});

document.addEventListener("click",(e)=>{

    if(

        !emojiPicker.contains(e.target) &&

        !emojiBtn.contains(e.target)

    ){

        emojiPicker.classList.remove("show");

    }

});


/*======================================
        REMOVE FILE
======================================*/

selectedFiles.addEventListener("click", function (e) {

    const button = e.target.closest(".remove-file");

    if (!button) return;

    const index = Number(

        button.dataset.index

    );

    pendingFiles.splice(index, 1);

    renderPendingFiles();

});




/*======================================
            START
======================================*/

renderTicketList();
buildEmojiPicker();