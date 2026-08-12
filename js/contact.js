/*=========================================
            FAQ
=========================================*/

const faqItems=document.querySelectorAll(".faq-item");

faqItems.forEach(item=>{

    const button=item.querySelector(".faq-question");

    button.addEventListener("click",()=>{

        const active=document.querySelector(".faq-item.active");

        if(active && active!==item){

            active.classList.remove("active");

        }

        item.classList.toggle("active");

    });

});