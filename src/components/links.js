export function initLinks() {
  const linksToggleButton = document.querySelector("#links-toggle");
  const linksContainerElement = document.querySelector("nav.links");

  linksToggleButton.addEventListener("mouseenter", expandLinksGrid);
  linksToggleButton.addEventListener("focus", () => {
    if (linksToggleButton.matches(":focus-visible")) {
      expandLinksGrid();
    }
  });
  linksContainerElement.addEventListener("focusin", (event) => {
    if (document.querySelector(".js-links-grid").contains(event.target)) {
      expandLinksGrid();
    }
  });
  linksToggleButton.addEventListener("click", (event) => {
    if (window.matchMedia("(hover: none)").matches) {
      event.preventDefault();
      toggleLinksGrid();
    }
  });
  linksContainerElement.addEventListener("mouseleave", () => {
    if (!linksContainerElement.matches(":focus-within")) {
      collapseLinksGrid();
    }
  });
  linksContainerElement.addEventListener("focusout", (event) => {
    if (!linksContainerElement.contains(event.relatedTarget)) {
      collapseLinksGrid();
    }
  });
}

function expandLinksGrid() {
  const linksGrid = document.querySelector(".js-links-grid");
  linksGrid.removeAttribute("collapsed");
  linksGrid.setAttribute("expanded", "true");
  const linksToggleButton = document.querySelector("#links-toggle");
  linksToggleButton.setAttribute("aria-expanded", "true");
  linksToggleButton.setAttribute("aria-label", "Show less");
  linksToggleButton.querySelector("span").textContent = "Show less";
}

function toggleLinksGrid() {
  const linksGrid = document.querySelector(".js-links-grid");

  if (linksGrid.hasAttribute("collapsed")) {
    expandLinksGrid();
  } else {
    collapseLinksGrid();
  }
}

function collapseLinksGrid() {
  const linksGrid = document.querySelector(".js-links-grid");
  linksGrid.removeAttribute("expanded");
  linksGrid.setAttribute("collapsed", true);
  const linksToggleButton = document.querySelector("#links-toggle");
  linksToggleButton.setAttribute("aria-expanded", "false");
  linksToggleButton.setAttribute("aria-label", "Show more");
  linksToggleButton.querySelector("span").textContent = "Show more";
}
