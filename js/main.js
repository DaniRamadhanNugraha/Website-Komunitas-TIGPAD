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

// Jalankan saat DOM siap
document.addEventListener("DOMContentLoaded", function () {
    /* ===============================================
       1. Load header dan footer
       Memuat navbar dan footer dari file terpisah untuk kemudahan maintenance
    =============================================== */
    loadPartial("navbar", "partials/navbar.html").then(setActiveNav);
    loadPartial("footer", "partials/footer.html");

    /* ===============================================
       2. FADE-IN DENGAN INTERSECTION OBSERVER (MODERN)
       Lebih hemat performa dibanding scroll event
    =============================================== */
    const revealElements = document.querySelectorAll(".card, .section");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target); // Animasi hanya sekali
            }
        });
    }, {
        threshold: 0.1 // Muncul saat 10% terlihat
    });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    /* ===============================================
       3. RIPPLE EFFECT (OPSIONAL) UNTUK TOMBOL
       Desain modern tanpa library, bisa dipakai untuk tombol lain juga
    =============================================== */
    // Ripple Effect
    document.querySelectorAll(".ripple").forEach(button => {
        button.addEventListener("click", function (e) {
            const circle = document.createElement("span");
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - this.getBoundingClientRect().left - radius}px`;
            circle.style.top = `${e.clientY - this.getBoundingClientRect().top - radius}px`;
            circle.classList.add("ripple-effect");

            const ripple = this.getElementsByClassName("ripple-effect")[0];
            if (ripple) {
                ripple.remove();
            }

            this.appendChild(circle);
        });
    });

    // Interaksi tombol WhatsApp
    const waBtn = document.getElementById("waButton");

    if (waBtn) {
        waBtn.addEventListener("click", function (e) {
            e.preventDefault();

            const phone = "6285171744541"; // https://wa.me/6285171744541
            const message = "Halo Tim TIGPAD, saya ingin bertanya mengenai ...";
            const encodedMessage = encodeURIComponent(message);

            const waAppLink = `whatsapp://send?phone=${phone}&text=${encodedMessage}`;
            const waWebLink = `https://wa.me/${phone}?text=${encodedMessage}`;

            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

            // Tampilkan loader
            loader.classList.add("show");

            if (isMobile) {
                // Coba buka WhatsApp App
                window.location.href = waAppLink;
            } else {
                // Desktop langsung ke WA Web
                window.open(waWebLink, "_blank");
            }

            // Fallback (jika mobile gagal buka app)
            setTimeout(function () {
                loader.classList.remove("show");

                if (isMobile) {
                    notice.textContent = "Jika WhatsApp tidak terbuka, WhatsApp Web akan dibuka.";
                    notice.classList.add("show");
                    window.open(waWebLink, "_blank");

                    setTimeout(() => {
                        notice.classList.remove("show");
                    }, 4000);
                }
            }, 1800);
        });
    }

    // Interaksi tombol email
    const emailBtn = document.getElementById("emailButton");
    const loader = document.getElementById("emailLoader");
    const notice = document.getElementById("emailNotice");

    if (emailBtn) {
        emailBtn.addEventListener("click", function (e) {
            e.preventDefault();

            const email = "tigpadunpad25@gmail.com";
            const subject = "Komunitas TIGPAD - Pertanyaan";
            const body = "Halo Tim TIGPAD,\n\nSaya ingin bertanya mengenai ...";

            const encodedSubject = encodeURIComponent(subject);
            const encodedBody = encodeURIComponent(body);

            const mailtoLink = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
            const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodedSubject}&body=${encodedBody}`;

            // Deteksi mobile 
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

            // Tampilkan loader
            loader.classList.add("show");

            // Coba buka mailto
            window.location.href = mailtoLink;

            // Fallback / Jika tidak terjadi apa-apa dalam beberapa detik → buka Gmail
            setTimeout(function () {
                loader.classList.remove("show");

                // Jika desktop, buka Gmail sebagai fallback
                if (!isMobile) {
                    notice.classList.add("show");
                    window.open(gmailLink, "_blank");

                    setTimeout(() => {
                        notice.classList.remove("show");
                    }, 4000);
                }
            }, 1800);
        });
    }

    /* ===============================================
       4. SMOOTH SCROLL (JIKA ADA ANCHOR)
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
