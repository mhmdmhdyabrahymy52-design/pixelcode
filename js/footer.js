"use strict";

/* ======================================
            PIXELCODE
            LOAD FOOTER
====================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        fetch("/pixelcode/footer.html")

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        `Footer HTTP Error: ${response.status}`
                    );

                }

                return response.text();

            })

            .then(data => {

                document.body.insertAdjacentHTML(
                    "beforeend",
                    data
                );

            })

            .catch(error => {

                console.error(
                    "Footer Error:",
                    error
                );

            });

    }
);
