const menuButton = document.querySelector(".menu-button");
const menu = document.querySelector("#menu-principal");
const backToTop = document.querySelector(".back-to-top");
const searchInput = document.querySelector("#searchInput");
const clearSearch = document.querySelector("#clearSearch");
const searchResults = document.querySelector("#searchResults");
const searchStatus = document.querySelector("#searchStatus");
const tocLinks = Array.from(document.querySelectorAll(".toc a"));
const searchableSections = Array.from(document.querySelectorAll("[data-search-title]"));

const originalHTML = new Map();

searchableSections.forEach((section) => {
  originalHTML.set(section.id, section.innerHTML);
});

menuButton?.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  menu.classList.toggle("open");
});

document.addEventListener("click", (event) => {
  if (!menu?.classList.contains("open")) return;
  if (menu.contains(event.target) || menuButton.contains(event.target)) return;
  menu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
});

function normalizeText(text) {
  return text
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSnippet(text, query) {
  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);
  const index = normalizedText.indexOf(normalizedQuery);

  if (index === -1) {
    return text.trim().replace(/\s+/g, " ").slice(0, 150) + "…";
  }

  const start = Math.max(0, index - 58);
  const end = Math.min(text.length, index + query.length + 92);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < text.length ? "…" : "";
  return prefix + text.slice(start, end).trim().replace(/\s+/g, " ") + suffix;
}

function resetHighlights() {
  searchableSections.forEach((section) => {
    const original = originalHTML.get(section.id);
    if (original) section.innerHTML = original;
  });
  document.body.classList.remove("searching");
}

function highlightTerm(term) {
  if (!term || term.length < 2) return;

  const regex = new RegExp(`(${escapeRegExp(term)})`, "giu");
  const walkerTargets = searchableSections.flatMap((section) => Array.from(section.querySelectorAll("p, li, h2, h3, figcaption")));

  walkerTargets.forEach((node) => {
    node.innerHTML = node.textContent.replace(regex, "<mark class=\"search-hit\">$1</mark>");
  });

  document.body.classList.add("searching");
}

function performSearch() {
  const query = searchInput.value.trim();
  resetHighlights();
  searchResults.innerHTML = "";

  if (query.length < 2) {
    searchStatus.textContent = "Digite pelo menos 2 caracteres para pesquisar.";
    if (!query) searchStatus.textContent = "";
    return;
  }

  const normalizedQuery = normalizeText(query);
  const matches = searchableSections
    .map((section) => {
      const title = section.dataset.searchTitle || section.querySelector("h2, h3")?.textContent || "Seção";
      const text = section.textContent || "";
      const normalizedText = normalizeText(`${title} ${text}`);
      return {
        id: section.id,
        title,
        text,
        matched: normalizedText.includes(normalizedQuery),
      };
    })
    .filter((item) => item.matched);

  if (!matches.length) {
    searchStatus.textContent = `Nenhum resultado encontrado para “${query}”.`;
    return;
  }

  highlightTerm(query);
  searchStatus.textContent = `${matches.length} resultado(s) encontrado(s) para “${query}”.`;

  const fragment = document.createDocumentFragment();

  matches.forEach((match) => {
    const link = document.createElement("a");
    link.className = "result-link";
    link.href = `#${match.id}`;
    link.innerHTML = `<strong>${match.title}</strong><span>${getSnippet(match.text, query)}</span>`;

    link.addEventListener("click", () => {
      setTimeout(() => {
        const firstHit = document.querySelector(`#${CSS.escape(match.id)} mark.search-hit`);
        if (firstHit) firstHit.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    });

    fragment.appendChild(link);
  });

  searchResults.appendChild(fragment);
}

searchInput?.addEventListener("input", performSearch);

clearSearch?.addEventListener("click", () => {
  searchInput.value = "";
  searchResults.innerHTML = "";
  searchStatus.textContent = "";
  resetHighlights();
  searchInput.focus();
});

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 700);

  let activeId = "";
  searchableSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) activeId = section.id;
  });

  tocLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
  });
}, { passive: true });

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
