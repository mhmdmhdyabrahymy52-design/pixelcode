const modalRoot = document.createElement("div");

modalRoot.id = "modal-root";

document.body.appendChild(modalRoot);

let modalCallback = null;

function showModal(options = {}){

    const{

        title="",

        content="",

        confirmText="تایید",

        cancelText="انصراف",

        type="info",

        onConfirm=null

    } = options;

    modalCallback = onConfirm;

    modalRoot.innerHTML = `

    <div class="modal-overlay show">

        <div class="modal ${type}">

            <div class="modal-header">

                <h2>${title}</h2>

                <button id="closeModal">

                    ✕

                </button>

            </div>

            <div class="modal-body">

                ${content}

            </div>

            <div class="modal-footer">

                <button
                class="cancel-btn"
                id="cancelModal">

                    ${cancelText}

                </button>

                <button
                class="confirm-btn"
                id="confirmModal">

                    ${confirmText}

                </button>

            </div>

        </div>

    </div>

    `;

    document
    .getElementById("closeModal")
    .onclick = closeModal;

    document
    .getElementById("cancelModal")
    .onclick = closeModal;

    document
    .querySelector(".modal-overlay")
    .onclick = function(e){

        if(e.target===this){

            closeModal();

        }

    };

document
.getElementById("confirmModal")
.onclick = function(){

    if(modalCallback){

        const result = modalCallback();

        if(result===false){

            return;

        }

    }

    closeModal();

};

}

function closeModal(){

    modalRoot.innerHTML = "";

}