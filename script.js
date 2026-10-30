/* =========================================================
   INSIDE TRACK — navigation, archive filtering and submission
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");

  // Mobile navigation: toggle menu and keep ARIA state in sync.
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  // Close the mobile menu after a navigation link is selected.
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    });
  });

  // Archive search and decade filters work together.
  const searchInput = document.getElementById("archive-search");
  const filterButtons = [...document.querySelectorAll(".filter-button")];
  const archiveCards = [...document.querySelectorAll(".archive-card")];
  const noResults = document.getElementById("no-results");
  let activePeriod = "all";

  function applyArchiveFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    archiveCards.forEach(card => {
      const year = Number(card.dataset.year);
      const decade = `${Math.floor(year / 10) * 10}s`;
      const matchesPeriod = activePeriod === "all" || decade === activePeriod;
      const searchableText = `${card.dataset.search} ${card.textContent}`.toLowerCase();
      const matchesQuery = searchableText.includes(query);
      const isVisible = matchesPeriod && matchesQuery;
      card.hidden = !isVisible;
      if (isVisible) visibleCount++;
    });

    noResults.hidden = visibleCount !== 0;
  }

  searchInput.addEventListener("input", applyArchiveFilters);
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      activePeriod = button.dataset.filter;
      filterButtons.forEach(item => item.classList.toggle("active", item === button));
      applyArchiveFilters();
    });
  });

  // Keyboard shortcut: Ctrl/Cmd + K focuses archive search.
  document.addEventListener("keydown", event => {
    const isSearchShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
    if (isSearchShortcut) {
      event.preventDefault();
      searchInput.focus();
      document.getElementById("archive").scrollIntoView({ behavior: "smooth" });
    }
  });

  // Contribution form: opens a pre-filled email. Replace this with a secure
  // server-side endpoint or form provider before launching publicly.
  const form = document.getElementById("contribute-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const subject = encodeURIComponent(`Inside Track archive contribution: ${data.get("type")}`);
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nType: ${data.get("type")}\nSource: ${data.get("source")}\n\nContext:\n${data.get("note") || "Not provided"}`
    );

    // Update this address to the museum's official editorial inbox.
    const editorialEmail = "archive@insidetrack.example";
    status.textContent = "Opening your email app. Replace the demo editorial address in script.js before publishing.";
    window.location.href = `mailto:${editorialEmail}?subject=${subject}&body=${body}`;
  });

  // Automatically keep the footer year current.
  document.getElementById("current-year").textContent = new Date().getFullYear();
});
