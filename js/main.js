/* ==================================================
   MAIN.JS
   Interaksi dasar website TIGPAD
   Ditulis rapi & mudah dikembangkan
================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ===============================================
       1. ACTIVE NAVIGATION (AUTO DETECT PAGE)
       Menandai menu sesuai halaman aktif
    =============================================== */
    const navLinks = document.querySelectorAll(".nav-links a");
    const currentPath = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
        const linkPath = link.getAttribute("href");

        if (linkPath === currentPath) {
            link.classList.add("active");
        }
    });


    /* ===============================================
       2. SMOOTH SCROLL (JIKA ADA ANCHOR)
       Aman meskipun sekarang belum dipakai
    =============================================== */
    const smoothLinks = document.querySelectorAll('a[href^="#"]');

    smoothLinks.forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            const targetEl = document.querySelector(targetId);

            if (targetEl) {
                targetEl.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    /* ===============================================
       3. SIMPLE FADE-IN ON SCROLL (OPTIONAL)
       Ringan, tanpa library
    =============================================== */
    const revealElements = document.querySelectorAll(".card, .section");

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;

        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;

            if (elementTop < windowHeight - 100) {
                el.classList.add("show");
            }
        });
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // trigger awal

});
