const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

menuButton?.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  navLinks?.classList.toggle("open", !expanded);
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const tabs = [...document.querySelectorAll(".code-tab")];
const blocks = [...document.querySelectorAll(".code-block")];
const copyButton = document.querySelector(".copy-button");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    blocks.forEach((block) => block.classList.remove("active"));
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    document.getElementById(tab.dataset.code)?.classList.add("active");
    if (copyButton) copyButton.textContent = "Copy";
  });
});

copyButton?.addEventListener("click", async () => {
  const code = document.querySelector(".code-block.active code")?.textContent;
  if (!code) return;
  await navigator.clipboard.writeText(code);
  copyButton.textContent = "Copied";
  window.setTimeout(() => {
    copyButton.textContent = "Copy";
  }, 1400);
});

