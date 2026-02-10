/* ==================================================
   MAIN.JS
   Interaksi dasar website TIGPAD
   Ditulis rapi & mudah dikembangkan
================================================== */

// Fungsi untuk load partial HTML (header/footer)
const loadPartial = async (id, file) => {
    const target = document.getElementById(id);
    if (!target) {
        console.warn(`Elemen #${id} tidak ditemukan`);
        return;
    }

    try {
        const res = await fetch(file);
        const html = await res.text();
        target.innerHTML = html;
    } catch (err) {
        console.error(err);
    }
};

// Fungsi untuk menandai menu navigasi aktif
const setActiveNav = () => {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a").forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });
};

document.addEventListener("DOMContentLoaded", function () {

    // Load header dan footer
    loadPartial("navbar", "partials/navbar.html").then(setActiveNav);
    loadPartial("footer", "partials/footer.html");

    /* ===============================================
       1. SMOOTH SCROLL (JIKA ADA ANCHOR)
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
       2. SIMPLE FADE-IN ON SCROLL (OPTIONAL)
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

// Pendaftaran Service Worker untuk PWA
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js");

        navigator.serviceWorker.addEventListener("message", event => {
            if (event.data?.type === "SW_UPDATED") {
                console.log("Service Worker updated — reload");
                window.location.reload();
            }
        });
    });
}
