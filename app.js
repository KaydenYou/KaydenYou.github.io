const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const navigationLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
const observedSections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const copyButton = document.querySelector(".copy-contact");
const copyStatus = document.querySelector(".copy-status");

const closeNavigation = () => {
  if (!menuButton || !navigation) return;
  navigation.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.textContent = "菜单";
  document.body.classList.remove("nav-open");
};

menuButton?.addEventListener("click", () => {
  if (!navigation) return;
  const isOpen = navigation.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.textContent = isOpen ? "关闭" : "菜单";
  document.body.classList.toggle("nav-open", isOpen);
});

navigationLinks.forEach((link) => link.addEventListener("click", closeNavigation));

const setActiveNavigation = () => {
  let currentSection = observedSections[0];

  observedSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= 120) {
      currentSection = section;
    }
  });

  if (!currentSection) return;

  navigationLinks.forEach((link) => {
    const isCurrent = link.getAttribute("href") === `#${currentSection.id}`;
    link.classList.toggle("is-active", isCurrent);
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

let copyTimer;

copyButton?.addEventListener("click", async () => {
  const value = copyButton.dataset.copy;
  if (!value || !copyStatus) return;

  try {
    await navigator.clipboard.writeText(value);
    copyStatus.textContent = `微信号已复制：${value}`;
  } catch {
    copyStatus.textContent = `微信号：${value}`;
  }

  copyStatus.classList.add("is-visible");
  window.clearTimeout(copyTimer);
  copyTimer = window.setTimeout(() => copyStatus.classList.remove("is-visible"), 2200);
});

setActiveNavigation();
window.addEventListener("scroll", setActiveNavigation, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 860) closeNavigation();
});
