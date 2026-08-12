"use strict";

/* =====================================================
                    PIXELCODE PROJECTS
===================================================== */


/* =====================================================
                    CONSTANTS
===================================================== */

const PROJECT_COST = 50;
const PROPOSAL_COST = 50;
const INITIAL_TOKENS = 100;


/* =====================================================
                    STORAGE
===================================================== */

const STORAGE = {

    users: "users",
    currentUser: "currentUser",
    projects: "pixelcode_projects",
    proposals: "pixelcode_proposals",
    notifications: "pixelcode_notifications",
    chats: "pixelcode_chats"

};


function read(key, fallback){

    try{

        const value =
            localStorage.getItem(key);

        return value
            ? JSON.parse(value)
            : fallback;

    }catch{

        return fallback;

    }

}


function write(key,value){

    localStorage.setItem(
        key,
        JSON.stringify(value)
    );

}


/* =====================================================
                    CURRENT USER
===================================================== */

let currentUser =
    read(STORAGE.currentUser,null);


if(!currentUser){

    window.location.href =
        "login.html";

}


let users =
    read(STORAGE.users,[]);


/* =====================================================
                    NORMALIZE USER
===================================================== */

function normalizeUser(){

    users =
        read(STORAGE.users,[]);

    const freshUser =
        users.find(
            user =>
                String(user.id) ===
                String(currentUser.id)
        );

    if(freshUser){

        currentUser = freshUser;

    }


    if(
        typeof currentUser.tokens !==
        "number"
    ){

        currentUser.tokens =
            INITIAL_TOKENS;

    }


    if(
        !currentUser.avatar
    ){

        currentUser.avatar =
            "../images/avatar-default.svg";

    }


    const index =
        users.findIndex(
            user =>
                String(user.id) ===
                String(currentUser.id)
        );


    if(index !== -1){

        users[index] =
            currentUser;

        write(
            STORAGE.users,
            users
        );

    }


    write(
        STORAGE.currentUser,
        currentUser
    );

}


normalizeUser();


/* =====================================================
                    ROLE
===================================================== */

let selectedRole =
    currentUser.projectRole || null;


const roleModal =
    document.getElementById(
        "roleModal"
    );


const employerPanel =
    document.getElementById(
        "employerPanel"
    );


const freelancerPanel =
    document.getElementById(
        "freelancerPanel"
    );


function openRoleModal(){

    roleModal.classList.remove(
        "hidden"
    );

}


function saveRole(role){

    selectedRole = role;

    currentUser.projectRole =
        role;


    users =
        read(
            STORAGE.users,
            []
        );


    const index =
        users.findIndex(
            user =>
                String(user.id) ===
                String(currentUser.id)
        );


    if(index !== -1){

        users[index] =
            currentUser;

        write(
            STORAGE.users,
            users
        );

    }


    write(
        STORAGE.currentUser,
        currentUser
    );


    roleModal.classList.add(
        "hidden"
    );


    applyRole();

}


function applyRole(){

    if(!selectedRole){

        openRoleModal();

        return;

    }


    if(
        selectedRole ===
        "employer"
    ){

        employerPanel.classList.remove(
            "hidden"
        );

        freelancerPanel.classList.add(
            "hidden"
        );

    }else{

        freelancerPanel.classList.remove(
            "hidden"
        );

        employerPanel.classList.add(
            "hidden"
        );

    }

}


document
    .querySelectorAll(".role-option")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                saveRole(
                    button.dataset.role
                );

            }
        );

    });


/* =====================================================
                    HEADER
===================================================== */

const tokenCount =
    document.getElementById(
        "tokenCount"
    );


const heroTokenCount =
    document.getElementById(
        "heroTokenCount"
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


function renderUser(){

    tokenCount.textContent =
        currentUser.tokens;

    heroTokenCount.textContent =
        currentUser.tokens;


    profileAvatar.src =
        currentUser.avatar ||
        "../images/avatar-default.svg";


    profileTitle.textContent =
        currentUser.fullname ||
        currentUser.name ||
        currentUser.username ||
        "پروفایل";


    profileStatus.textContent =
        selectedRole === "employer"
            ? "کارفرما"
            : selectedRole === "freelancer"
                ? "فریلنسر"
                : "ثبت نقش نشده";

}


renderUser();


/* =====================================================
                    TOKEN UPDATE
===================================================== */

function updateTokens(){

    users =
        read(
            STORAGE.users,
            []
        );


    const index =
        users.findIndex(
            user =>
                String(user.id) ===
                String(currentUser.id)
        );


    if(index !== -1){

        users[index].tokens =
            currentUser.tokens;

        currentUser =
            users[index];

        write(
            STORAGE.users,
            users
        );

    }


    write(
        STORAGE.currentUser,
        currentUser
    );


    renderUser();

}


/* =====================================================
                    PROJECTS
===================================================== */

let projects =
    read(
        STORAGE.projects,
        []
    );


let proposals =
    read(
        STORAGE.proposals,
        []
    );


let notifications =
    read(
        STORAGE.notifications,
        []
    );


let chats =
    read(
        STORAGE.chats,
        []
    );


let activeProjectId =
    null;


let activeChatId =
    null;


/* =====================================================
                    HELPERS
===================================================== */

function uid(prefix){

    return (
        prefix +
        "_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .slice(2,8)
    );

}


function money(value){

    return Number(value)
        .toLocaleString("fa-IR")
        + " تومان";

}


function categoryName(value){

    const map = {

        frontend:"Front-End",
        backend:"Back-End",
        graphic:"طراحی گرافیک",
        logo:"طراحی لوگو",
        photoshop:"Photoshop",
        other:"سایر"

    };

    return map[value] || value;

}


function currentUserId(){

    return String(
        currentUser.id
    );

}


function userById(id){

    return users.find(
        user =>
            String(user.id) ===
            String(id)
    );

}


/* =====================================================
                    TOAST
===================================================== */

const toastContainer =
    document.getElementById(
        "toastContainer"
    );


function showToast(
    message,
    type = "success"
){

    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        "toast " + type;


    const icon =
        type === "success"
            ? "ri-checkbox-circle-line"
            : type === "error"
                ? "ri-error-warning-line"
                : "ri-information-line";


    toast.innerHTML = `

        <i class="${icon}"></i>

        <span>
            ${escapeHtml(message)}
        </span>

    `;


    toastContainer.appendChild(
        toast
    );


    setTimeout(() => {

        toast.remove();

    },3500);

}


/* =====================================================
                    ESCAPE
===================================================== */

function escapeHtml(value){

    return String(value ?? "")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");

}


/* =====================================================
                    NOTIFICATIONS
===================================================== */

const notificationBtn =
    document.getElementById(
        "notificationBtn"
    );


const notificationsPanel =
    document.getElementById(
        "notificationsPanel"
    );


const notificationCount =
    document.getElementById(
        "notificationCount"
    );


const notificationsList =
    document.getElementById(
        "notificationsList"
    );


const clearNotificationsBtn =
    document.getElementById(
        "clearNotificationsBtn"
    );


function userNotifications(){

    return notifications
        .filter(
            item =>
                String(item.userId) ===
                currentUserId()
        )
        .sort(
            (a,b) =>
                b.createdAt -
                a.createdAt
        );

}


function addNotification({

    userId,
    title,
    message,
    type = "info",
    action = null,
    data = null

}){

    notifications =
        read(
            STORAGE.notifications,
            []
        );


    notifications.push({

        id:uid("notification"),

        userId,

        title,

        message,

        type,

        action,

        data,

        read:false,

        createdAt:Date.now()

    });


    write(
        STORAGE.notifications,
        notifications
    );


    if(
        String(userId) ===
        currentUserId()
    ){

        renderNotifications();

    }

}


function renderNotifications(){

    notifications =
        read(
            STORAGE.notifications,
            []
        );


    const list =
        userNotifications();


    const unread =
        list.filter(
            item => !item.read
        ).length;


    notificationCount.textContent =
        unread;


    notificationCount.classList.toggle(
        "show",
        unread > 0
    );


    if(!list.length){

        notificationsList.innerHTML = `

            <div class="empty-notification">
                اعلان جدیدی وجود ندارد.
            </div>

        `;

        return;

    }


    notificationsList.innerHTML =
        list.map(item => `

            <div
                class="notification-item ${
                    item.read ? "" : "unread"
                }"
                data-notification-id="${item.id}"
            >

                <strong>
                    ${escapeHtml(item.title)}
                </strong>

                <p>
                    ${escapeHtml(item.message)}
                </p>

                <small>
                    ${new Date(item.createdAt)
                        .toLocaleTimeString(
                            "fa-IR",
                            {
                                hour:"2-digit",
                                minute:"2-digit"
                            }
                        )}
                </small>

            </div>

        `).join("");

}


function handleNotification(id){

    const item =
        notifications.find(
            notification =>
                notification.id === id
        );


    if(!item) return;


    item.read = true;


    write(
        STORAGE.notifications,
        notifications
    );


    notificationsPanel.classList.remove(
        "open"
    );


    if(
        item.action ===
        "chat"
    ){

        openChat(
            item.data.chatId
        );

        document
            .querySelector(
                ".chat-section"
            )
            .scrollIntoView({
                behavior:"smooth"
            });

    }


    renderNotifications();

}


notificationBtn.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        notificationsPanel.classList.toggle(
            "open"
        );

    }
);


document.addEventListener(
    "click",
    event => {

        if(
            notificationsPanel.classList.contains(
                "open"
            ) &&
            !notificationsPanel.contains(
                event.target
            ) &&
            !notificationBtn.contains(
                event.target
            )
        ){

            notificationsPanel.classList.remove(
                "open"
            );

        }

    }
);


notificationsList.addEventListener(
    "click",
    event => {

        const item =
            event.target.closest(
                ".notification-item"
            );

        if(!item) return;

        handleNotification(
            item.dataset.notificationId
        );

    }
);


clearNotificationsBtn.addEventListener(
    "click",
    () => {

        notifications =
            notifications.filter(
                item =>
                    String(item.userId) !==
                    currentUserId()
            );


        write(
            STORAGE.notifications,
            notifications
        );


        renderNotifications();

    }
);


/* =====================================================
                    PROJECT CREATE
===================================================== */

const createProjectModal =
    document.getElementById(
        "createProjectModal"
    );


const openCreateProjectBtn =
    document.getElementById(
        "openCreateProjectBtn"
    );


const createProjectForm =
    document.getElementById(
        "createProjectForm"
    );


openCreateProjectBtn.addEventListener(
    "click",
    () => {

        if(
            currentUser.tokens <
            PROJECT_COST
        ){

            showToast(
                "برای ثبت پروژه حداقل ۵۰ توکن نیاز دارید.",
                "warning"
            );

            return;

        }


        createProjectModal.classList.remove(
            "hidden"
        );

    }
);


createProjectForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        normalizeUser();


        if(
            currentUser.tokens <
            PROJECT_COST
        ){

            showToast(
                "موجودی توکن شما کافی نیست.",
                "error"
            );

            return;

        }


        const title =
            document
                .getElementById(
                    "projectTitle"
                )
                .value.trim();


        const category =
            document
                .getElementById(
                    "projectCategory"
                )
                .value;


        const budget =
            Number(
                document
                    .getElementById(
                        "projectBudget"
                    )
                    .value
            );


        const deadline =
            document
                .getElementById(
                    "projectDeadline"
                )
                .value.trim();


        const skills =
            document
                .getElementById(
                    "projectSkills"
                )
                .value
                .split(",")
                .map(
                    item =>
                        item.trim()
                )
                .filter(Boolean);


        const description =
            document
                .getElementById(
                    "projectDescription"
                )
                .value.trim();


        if(
            !title ||
            !category ||
            !budget ||
            !deadline ||
            !description
        ){

            showToast(
                "همه اطلاعات پروژه را کامل کنید.",
                "error"
            );

            return;

        }


        const project = {

            id:uid("project"),

            title,

            category,

            budget,

            deadline,

            skills,

            description,

            employerId:currentUser.id,

            employerName:
                currentUser.fullname ||
                currentUser.name ||
                currentUser.username,

            status:"open",

            selectedFreelancerId:null,

            createdAt:Date.now()

        };


        projects.push(
            project
        );


        currentUser.tokens -=
            PROJECT_COST;


        write(
            STORAGE.projects,
            projects
        );


        updateTokens();


        createProjectForm.reset();


        createProjectModal.classList.add(
            "hidden"
        );


        renderAll();


        showToast(
            "پروژه با موفقیت ثبت شد و ۵۰ توکن کسر شد.",
            "success"
        );

    }
);


/* =====================================================
                    PROJECT DETAILS
===================================================== */

const projectDetailsModal =
    document.getElementById(
        "projectDetailsModal"
    );


const openProposalBtn =
    document.getElementById(
        "openProposalBtn"
    );


const detailsTitle =
    document.getElementById(
        "detailsProjectTitle"
    );


function openProjectDetails(
    projectId
){

    const project =
        projects.find(
            item =>
                item.id === projectId
        );


    if(!project) return;


    activeProjectId =
        projectId;


    document.getElementById(
        "detailsProjectTitle"
    ).textContent =
        project.title;


    document.getElementById(
        "detailsProjectCategory"
    ).textContent =
        categoryName(
            project.category
        );


    document.getElementById(
        "detailsProjectBudget"
    ).textContent =
        money(
            project.budget
        );


    document.getElementById(
        "detailsProjectDeadline"
    ).textContent =
        project.deadline;


    document.getElementById(
        "detailsProjectEmployer"
    ).textContent =
        project.employerName;


    document.getElementById(
        "detailsProjectDescription"
    ).textContent =
        project.description;


    document.getElementById(
        "detailsProjectSkills"
    ).innerHTML =
        project.skills.length

            ? project.skills.map(
                skill =>
                    `<span class="skill-tag">
                        ${escapeHtml(skill)}
                    </span>`
              ).join("")

            : `<span class="skill-tag">
                    بدون مهارت مشخص
               </span>`;


    projectDetailsModal.classList.remove(
        "hidden"
    );

}


/* =====================================================
                    PROJECT CARDS
===================================================== */

function projectHasProposal(
    projectId
){

    return proposals.some(
        proposal =>
            proposal.projectId ===
            projectId &&
            String(
                proposal.freelancerId
            ) ===
            currentUserId()
    );

}


function renderProjects(){

    const grid =
        document.getElementById(
            "projectsGrid"
        );


    const search =
        document
            .getElementById(
                "projectSearch"
            )
            .value
            .trim()
            .toLowerCase();


    const category =
        document
            .getElementById(
                "categoryFilter"
            )
            .value;


    const budget =
        document
            .getElementById(
                "budgetFilter"
            )
            .value;


    const available =
        projects.filter(
            project => {

                if(
                    project.status !==
                    "open"
                ){

                    return false;

                }


                const searchMatch =
                    !search ||

                    project.title
                        .toLowerCase()
                        .includes(search) ||

                    project.description
                        .toLowerCase()
                        .includes(search);


                const categoryMatch =
                    category === "all" ||
                    project.category ===
                    category;


                let budgetMatch =
                    true;


                if(
                    budget === "low"
                ){

                    budgetMatch =
                        project.budget <
                        10000000;

                }


                if(
                    budget === "medium"
                ){

                    budgetMatch =
                        project.budget >=
                        10000000 &&
                        project.budget <=
                        50000000;

                }


                if(
                    budget === "high"
                ){

                    budgetMatch =
                        project.budget >
                        50000000;

                }


                return (
                    searchMatch &&
                    categoryMatch &&
                    budgetMatch
                );

            }
        );


    grid.innerHTML =
        available.map(
            project =>
                projectCard(
                    project,
                    false
                )
        ).join("");


    document
        .getElementById(
            "projectsEmpty"
        )
        .classList.toggle(
            "hidden",
            available.length !== 0
        );

}


function projectCard(
    project,
    employer
){

    const taken =
        project.status ===
        "taken";


    let actionButtons = "";


    if(!employer){

        const already =
            projectHasProposal(
                project.id
            );


        actionButtons = `

            <button
                data-action="details"
                data-id="${project.id}"
            >
                جزئیات
            </button>

            ${
                !already && !taken

                ? `

                    <button
                        data-action="proposal"
                        data-id="${project.id}"
                    >
                        پیشنهاد
                    </button>

                  `

                : already

                    ? `<button disabled>
                            پیشنهاد ارسال شد
                       </button>`

                    : ""

            }

        `;

    }


    return `

        <article class="project-card">

            <div class="project-top">

                <span class="project-category">
                    ${escapeHtml(
                        categoryName(
                            project.category
                        )
                    )}
                </span>

                <span class="
                    project-status
                    ${taken ? "taken" : ""}
                ">
                    ${
                        taken
                            ? "فریلنسر انتخاب شده"
                            : "پروژه باز"
                    }
                </span>

            </div>


            <h3>
                ${escapeHtml(
                    project.title
                )}
            </h3>


            <p class="project-description">
                ${escapeHtml(
                    project.description
                )}
            </p>


            <div class="project-info">

                <div class="project-info-item">

                    <span>
                        بودجه
                    </span>

                    <strong>
                        ${money(
                            project.budget
                        )}
                    </strong>

                </div>


                <div class="project-info-item">

                    <span>
                        مهلت
                    </span>

                    <strong>
                        ${escapeHtml(
                            project.deadline
                        )}
                    </strong>

                </div>

            </div>


            <div class="project-card-footer">

                <span class="project-employer">

                    ${escapeHtml(
                        project.employerName
                    )}

                </span>


                <div class="project-actions">

                    ${actionButtons}

                </div>

            </div>

        </article>

    `;

}


/* =====================================================
                    EMPLOYER PROJECTS
===================================================== */

function renderEmployerProjects(){

    const grid =
        document.getElementById(
            "employerProjects"
        );


    const mine =
        projects.filter(
            project =>
                String(
                    project.employerId
                ) ===
                currentUserId()
        );


    document.getElementById(
        "myProjectsCount"
    ).textContent =
        mine.length;


    const received =
        proposals.filter(
            proposal =>
                mine.some(
                    project =>
                        project.id ===
                        proposal.projectId
                )
        );


    document.getElementById(
        "receivedProposalsCount"
    ).textContent =
        received.length;


    if(!mine.length){

        grid.innerHTML = "";

        document
            .getElementById(
                "employerEmpty"
            )
            .classList.remove(
                "hidden"
            );

        return;

    }


    document
        .getElementById(
            "employerEmpty"
        )
        .classList.add(
            "hidden"
        );


    grid.innerHTML =
        mine.map(
            project =>
                employerProjectCard(
                    project
                )
        ).join("");

}


function employerProjectCard(
    project
){

    const projectProposals =
        proposals.filter(
            proposal =>
                proposal.projectId ===
                project.id
        );


    return `

        <article class="project-card">

            <div class="project-top">

                <span class="project-category">
                    ${escapeHtml(
                        categoryName(
                            project.category
                        )
                    )}
                </span>

                <span class="
                    project-status
                    ${
                        project.status ===
                        "taken"
                        ? "taken"
                        : ""
                    }
                ">

                    ${
                        project.status ===
                        "taken"
                            ? "فریلنسر انتخاب شده"
                            : "باز"
                    }

                </span>

            </div>


            <h3>
                ${escapeHtml(
                    project.title
                )}
            </h3>


            <p class="project-description">
                ${escapeHtml(
                    project.description
                )}
            </p>


            <div class="project-info">

                <div class="project-info-item">

                    <span>
                        بودجه
                    </span>

                    <strong>
                        ${money(
                            project.budget
                        )}
                    </strong>

                </div>


                <div class="project-info-item">

                    <span>
                        پیشنهادها
                    </span>

                    <strong>
                        ${projectProposals.length}
                    </strong>

                </div>

            </div>


            ${
                projectProposals.length

                    ? `

                        <div class="proposals-box">

                            <div class="proposals-title">
                                پیشنهادهای دریافتی
                            </div>

                            ${projectProposals
                                .map(
                                    proposal =>
                                        proposalCard(
                                            proposal,
                                            project
                                        )
                                )
                                .join("")}

                        </div>

                      `

                    : `

                        <div class="proposals-box">

                            <div class="proposals-title">
                                هنوز پیشنهادی دریافت نشده است.
                            </div>

                        </div>

                      `
            }

        </article>

    `;

}


/* =====================================================
                    PROPOSAL CARD
===================================================== */

function proposalCard(
    proposal,
    project
){

    const freelancer =
        userById(
            proposal.freelancerId
        );


    if(!freelancer){

        return "";

    }


    const accepted =
        proposal.status ===
        "accepted";


    const rejected =
        proposal.status ===
        "rejected";


    return `

        <div class="proposal-item">

            <div class="proposal-main">

                <span class="proposal-name">
                    ${escapeHtml(
                        freelancer.fullname ||
                        freelancer.name ||
                        freelancer.username
                    )}
                </span>

                <span class="proposal-price">
                    ${money(
                        proposal.price
                    )}
                </span>

            </div>


            <div class="proposal-meta">

                <span>
                    ${escapeHtml(
                        proposal.days
                    )}
                </span>

                <span>
                    ${
                        accepted
                            ? "تأیید شده"
                            : rejected
                                ? "رد شده"
                                : "در انتظار بررسی"
                    }
                </span>

            </div>


            <p class="proposal-message">
                ${escapeHtml(
                    proposal.message
                )}
            </p>


            ${
                !accepted &&
                !rejected &&
                project.status === "open"

                    ? `

                        <div class="proposal-actions">

                            <button
                                class="accept-proposal"
                                data-proposal-action="accept"
                                data-proposal-id="${proposal.id}"
                            >
                                انتخاب فریلنسر
                            </button>

                            <button
                                class="reject-proposal"
                                data-proposal-action="reject"
                                data-proposal-id="${proposal.id}"
                            >
                                رد پیشنهاد
                            </button>

                        </div>

                      `

                    : accepted

                        ? `

                            <div class="proposal-actions">

                                <button
                                    class="accept-proposal"
                                    data-chat="${proposal.chatId || ""}"
                                >
                                    ادامه گفتگو
                                </button>

                            </div>

                          `

                        : ""

            }

        </div>

    `;

}


/* =====================================================
                    SEND PROPOSAL
===================================================== */

const proposalModal =
    document.getElementById(
        "proposalModal"
    );


const proposalForm =
    document.getElementById(
        "proposalForm"
    );


function openProposal(
    projectId
){

    const project =
        projects.find(
            item =>
                item.id === projectId
        );


    if(!project) return;


    if(
        currentUser.tokens <
        PROPOSAL_COST
    ){

        showToast(
            "برای ارسال پیشنهاد حداقل ۵۰ توکن نیاز دارید.",
            "warning"
        );

        return;

    }


    if(
        projectHasProposal(
            projectId
        )
    ){

        showToast(
            "قبلاً برای این پروژه پیشنهاد ارسال کرده‌اید.",
            "warning"
        );

        return;

    }


    activeProjectId =
        projectId;


    document.getElementById(
        "proposalProjectTitle"
    ).textContent =
        project.title;


    document.getElementById(
        "proposalUserName"
    ).textContent =
        currentUser.fullname ||
        currentUser.name ||
        currentUser.username;


    proposalModal.classList.remove(
        "hidden"
    );

}


proposalForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const project =
            projects.find(
                item =>
                    item.id ===
                    activeProjectId
            );


        if(!project) return;


        if(
            currentUser.tokens <
            PROPOSAL_COST
        ){

            showToast(
                "توکن کافی ندارید.",
                "error"
            );

            return;

        }


        const price =
            Number(
                document
                    .getElementById(
                        "proposalPrice"
                    )
                    .value
            );


        const days =
            document
                .getElementById(
                    "proposalDays"
                )
                .value
                .trim();


        const message =
            document
                .getElementById(
                    "proposalMessage"
                )
                .value
                .trim();


        if(
            !price ||
            !days ||
            !message
        ){

            showToast(
                "اطلاعات پیشنهاد را کامل کنید.",
                "error"
            );

            return;

        }


        const proposal = {

            id:uid("proposal"),

            projectId:

                project.id,

            freelancerId:

                currentUser.id,

            freelancerName:

                currentUser.fullname ||
                currentUser.name ||
                currentUser.username,

            price,

            days,

            message,

            status:"pending",

            chatId:null,

            createdAt:Date.now()

        };


        proposals.push(
            proposal
        );


        currentUser.tokens -=
            PROPOSAL_COST;


        write(
            STORAGE.proposals,
            proposals
        );


        updateTokens();


        addNotification({

            userId:
                project.employerId,

            title:
                "پیشنهاد جدید",

            message:
                `${proposal.freelancerName} برای پروژه «${project.title}» پیشنهاد ارسال کرده است.`,

            type:
                "proposal",

            action:
                null,

            data:{
                projectId:
                    project.id,

                proposalId:
                    proposal.id
            }

        });


        proposalForm.reset();


        proposalModal.classList.add(
            "hidden"
        );


        renderAll();


        showToast(
            "پیشنهاد ارسال شد و ۵۰ توکن کسر شد.",
            "success"
        );

    }
);


/* =====================================================
                    ACCEPT / REJECT
===================================================== */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-proposal-action]"
            );


        if(!button) return;


        const action =
            button.dataset.proposalAction;


        const proposalId =
            button.dataset.proposalId;


        const proposal =
            proposals.find(
                item =>
                    item.id ===
                    proposalId
            );


        if(!proposal) return;


        const project =
            projects.find(
                item =>
                    item.id ===
                    proposal.projectId
            );


        if(!project) return;


        if(
            String(
                project.employerId
            ) !==
            currentUserId()
        ){

            return;

        }


        if(action === "reject"){

            proposal.status =
                "rejected";


            write(
                STORAGE.proposals,
                proposals
            );


            addNotification({

                userId:
                    proposal.freelancerId,

                title:
                    "پیشنهاد رد شد",

                message:
                    `پیشنهاد شما برای پروژه «${project.title}» توسط کارفرما رد شد.`,

                type:
                    "error"

            });


            renderAll();


            showToast(
                "پیشنهاد رد شد.",
                "success"
            );


            return;

        }


        if(action === "accept"){

            acceptProposal(
                proposal,
                project
            );

        }

    }
);


/* =====================================================
                    ACCEPT PROPOSAL
===================================================== */

function acceptProposal(
    proposal,
    project
){

    proposal.status =
        "accepted";


    project.status =
        "taken";


    project.selectedFreelancerId =
        proposal.freelancerId;


    const existingChat =
        chats.find(
            chat =>
                chat.projectId ===
                project.id
        );


    let chat;


    if(existingChat){

        chat =
            existingChat;

    }else{

        chat = {

            id:
                uid("chat"),

            projectId:
                project.id,

            employerId:
                project.employerId,

            freelancerId:
                proposal.freelancerId,

            createdAt:
                Date.now(),

            messages:[]

        };


        chats.push(
            chat
        );

    }


    proposal.chatId =
        chat.id;


    write(
        STORAGE.projects,
        projects
    );


    write(
        STORAGE.proposals,
        proposals
    );


    write(
        STORAGE.chats,
        chats
    );


    addNotification({

        userId:
            proposal.freelancerId,

        title:
            "پیشنهاد شما تأیید شد",

        message:
            `کارفرما پیشنهاد شما برای پروژه «${project.title}» را تأیید کرده است. برای گفتگو وارد بخش چت شوید.`,

        type:
            "success",

        action:
            "chat",

        data:{
            chatId:
                chat.id
        }

    });


    renderAll();


    showToast(
        "فریلنسر انتخاب شد و گفتگو ایجاد شد.",
        "success"
    );


    setTimeout(
        () => {

            openChat(
                chat.id
            );

            document
                .querySelector(
                    ".chat-section"
                )
                .scrollIntoView({
                    behavior:"smooth"
                });

        },
        200
    );

}


/* =====================================================
                    CHAT
===================================================== */

const chatList =
    document.getElementById(
        "chatList"
    );


const chatEmpty =
    document.getElementById(
        "chatEmpty"
    );


const chatContent =
    document.getElementById(
        "chatContent"
    );


const chatUserName =
    document.getElementById(
        "chatUserName"
    );


const chatProjectName =
    document.getElementById(
        "chatProjectName"
    );


const messagesList =
    document.getElementById(
        "messagesList"
    );


const chatForm =
    document.getElementById(
        "chatForm"
    );


const chatInput =
    document.getElementById(
        "chatInput"
    );


function myChats(){

    return chats.filter(
        chat =>

            String(
                chat.employerId
            ) === currentUserId() ||

            String(
                chat.freelancerId
            ) === currentUserId()

    );

}


function renderChatList(){

    chats =
        read(
            STORAGE.chats,
            []
        );


    const list =
        myChats();


    if(!list.length){

        chatList.innerHTML = `

            <div class="chat-list-empty">
                هنوز گفتگویی وجود ندارد.
            </div>

        `;

        return;

    }


    chatList.innerHTML =
        list.map(
            chat => {

                const otherId =

                    String(
                        chat.employerId
                    ) ===
                    currentUserId()

                        ? chat.freelancerId

                        : chat.employerId;


                const other =
                    userById(
                        otherId
                    );


                const project =
                    projects.find(
                        item =>
                            item.id ===
                            chat.projectId
                    );


                if(!other || !project){

                    return "";

                }


                return `

                    <div
                        class="
                            chat-list-item
                            ${
                                activeChatId ===
                                chat.id
                                    ? "active"
                                    : ""
                            }
                        "
                        data-chat-id="${chat.id}"
                    >

                        <strong>
                            ${escapeHtml(
                                other.fullname ||
                                other.name ||
                                other.username
                            )}
                        </strong>

                        <span>
                            ${escapeHtml(
                                project.title
                            )}
                        </span>

                    </div>

                `;

            }
        ).join("");

}


function openChat(
    chatId
){

    chats =
        read(
            STORAGE.chats,
            []
        );


    const chat =
        chats.find(
            item =>
                item.id ===
                chatId
        );


    if(!chat) return;


    if(
        String(
            chat.employerId
        ) !== currentUserId() &&
        String(
            chat.freelancerId
        ) !== currentUserId()
    ){

        return;

    }


    activeChatId =
        chatId;


    const otherId =

        String(
            chat.employerId
        ) === currentUserId()

            ? chat.freelancerId

            : chat.employerId;


    const other =
        userById(
            otherId
        );


    const project =
        projects.find(
            item =>
                item.id ===
                chat.projectId
        );


    if(!other || !project){

        return;

    }


    chatEmpty.classList.add(
        "hidden"
    );


    chatContent.classList.remove(
        "hidden"
    );


    chatUserName.textContent =
        other.fullname ||
        other.name ||
        other.username;


    chatProjectName.textContent =
        project.title;


    renderMessages(
        chat
    );


    renderChatList();

}


function renderMessages(
    chat
){

    if(!chat.messages.length){

        messagesList.innerHTML = `

            <div class="chat-list-empty">
                هنوز پیامی در این گفتگو ارسال نشده است.
            </div>

        `;

        return;

    }


    messagesList.innerHTML =
        chat.messages.map(
            message => `

                <div class="
                    message
                    ${
                        String(
                            message.senderId
                        ) ===
                        currentUserId()
                            ? "mine"
                            : "theirs"
                    }
                ">

                    ${escapeHtml(
                        message.text
                    )}

                    <small>
                        ${new Date(
                            message.createdAt
                        ).toLocaleTimeString(
                            "fa-IR",
                            {
                                hour:"2-digit",
                                minute:"2-digit"
                            }
                        )}
                    </small>

                </div>

            `
        ).join("");


    messagesList.scrollTop =
        messagesList.scrollHeight;

}


chatForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const text =
            chatInput.value.trim();


        if(!text || !activeChatId){

            return;

        }


        chats =
            read(
                STORAGE.chats,
                []
            );


        const chat =
            chats.find(
                item =>
                    item.id ===
                    activeChatId
            );


        if(!chat) return;


        chat.messages.push({

            id:
                uid("message"),

            senderId:
                currentUser.id,

            text,

            createdAt:
                Date.now()

        });


        const receiverId =

            String(
                chat.employerId
            ) === currentUserId()

                ? chat.freelancerId

                : chat.employerId;


        const project =
            projects.find(
                item =>
                    item.id ===
                    chat.projectId
            );


        write(
            STORAGE.chats,
            chats
        );


        addNotification({

            userId:
                receiverId,

            title:
                "پیام جدید",

            message:
                `در پروژه «${project?.title || "پروژه"}» پیام جدیدی دریافت کرده‌اید.`,

            type:
                "message",

            action:
                "chat",

            data:{
                chatId:
                    chat.id
            }

        });


        chatInput.value = "";


        renderMessages(
            chat
        );

    }
);


chatList.addEventListener(
    "click",
    event => {

        const item =
            event.target.closest(
                ".chat-list-item"
            );


        if(!item) return;


        openChat(
            item.dataset.chatId
        );

    }
);


/* =====================================================
                    CARD ACTIONS
===================================================== */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-action]"
            );


        if(!button) return;


        const action =
            button.dataset.action;


        const id =
            button.dataset.id;


        if(action === "details"){

            openProjectDetails(
                id
            );

        }


        if(action === "proposal"){

            openProposal(
                id
            );

        }

    }
);


/* =====================================================
                    ACCEPTED CHAT BUTTON
===================================================== */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-chat]"
            );


        if(
            !button ||
            !button.dataset.chat
        ){

            return;

        }


        openChat(
            button.dataset.chat
        );


        document
            .querySelector(
                ".chat-section"
            )
            .scrollIntoView({
                behavior:"smooth"
            });

    }
);


/* =====================================================
                    MODAL CLOSE
===================================================== */

document
    .querySelectorAll(
        "[data-close]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.close;


                    document
                        .getElementById(
                            id
                        )
                        .classList.add(
                            "hidden"
                        );

                }
            );

        }
    );


document
    .querySelectorAll(
        ".modal-overlay"
    )
    .forEach(
        overlay => {

            overlay.addEventListener(
                "click",
                event => {

                    if(
                        event.target ===
                        overlay &&
                        overlay.id !==
                        "roleModal"
                    ){

                        overlay.classList.add(
                            "hidden"
                        );

                    }

                }
            );

        }
    );


document.addEventListener(
    "keydown",
    event => {

        if(
            event.key !==
            "Escape"
        ){

            return;

        }


        document
            .querySelectorAll(
                ".modal-overlay"
            )
            .forEach(
                modal => {

                    if(
                        modal.id !==
                        "roleModal"
                    ){

                        modal.classList.add(
                            "hidden"
                        );

                    }

                }
            );


        notificationsPanel.classList.remove(
            "open"
        );

    }
);


/* =====================================================
                    FILTER EVENTS
===================================================== */

document
    .getElementById(
        "projectSearch"
    )
    .addEventListener(
        "input",
        renderProjects
    );


document
    .getElementById(
        "categoryFilter"
    )
    .addEventListener(
        "change",
        renderProjects
    );


document
    .getElementById(
        "budgetFilter"
    )
    .addEventListener(
        "change",
        renderProjects
    );


/* =====================================================
                    RENDER ALL
===================================================== */

function renderAll(){

    projects =
        read(
            STORAGE.projects,
            []
        );


    proposals =
        read(
            STORAGE.proposals,
            []
        );


    chats =
        read(
            STORAGE.chats,
            []
        );


    notifications =
        read(
            STORAGE.notifications,
            []
        );


    renderUser();

    renderProjects();

    renderEmployerProjects();

    renderChatList();

    renderNotifications();

}


/* =====================================================
                    START
===================================================== */

renderAll();

applyRole();