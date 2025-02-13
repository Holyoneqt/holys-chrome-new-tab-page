export function initLinks() {
  const linksToggleButton = document.querySelector("#links-toggle");

  linksToggleButton.onmouseenter = expandLinksGrid;
}

function expandLinksGrid() {
  const linksContainerElement = document.querySelector("nav.links");
  const linksGrid = document.querySelector(".js-links-grid");
  const linksIsCollapsed = linksGrid.hasAttribute("collapsed");

  if (linksIsCollapsed) {
    linksGrid.removeAttribute("collapsed");
    linksGrid.setAttribute("expanded", true);
    linksContainerElement.addEventListener("mouseleave", collapseLinksGrid, { once: true });
  }
}

function collapseLinksGrid() {
  const linksGrid = document.querySelector(".js-links-grid");
  linksGrid.removeAttribute("expanded");
  linksGrid.setAttribute("collapsed", true);
}
