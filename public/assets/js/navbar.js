let lastScrollY = window.scrollY;

const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 0) {
        nav.classList.remove("nav-hidden");
        return;
    }

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        nav.classList.add("nav-hidden");
    } else {
        nav.classList.remove("nav-hidden");
    }

    lastScrollY = currentScrollY;
});